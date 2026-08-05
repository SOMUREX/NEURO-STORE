import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import db, { logAuditEvent } from '../db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

const router = express.Router();

// Determine simplified file type category
function getFileTypeCategory(mimeType, filename) {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('text') || filename.endsWith('.pdf') || filename.endsWith('.docx') || filename.endsWith('.txt')) {
    return 'Document';
  }
  return 'Document';
}

// Generate automatic metadata based on file category
function generateMetadata(file, category, tagsInput) {
  const metaId = 'meta_' + crypto.randomBytes(6).toString('hex');
  let resolution = 'N/A';
  let duration = 'N/A';
  let defaultTags = [category, 'NeuroStore'];

  if (category === 'Image') {
    resolution = '1920x1080 (FHD)';
    defaultTags.push('Scan', 'Visual', 'HD');
  } else if (category === 'Video') {
    resolution = '1920x1080 (FHD)';
    duration = '03:15 min';
    defaultTags.push('Recording', 'Simulation', 'Motion');
  } else if (category === 'Audio') {
    duration = '04:45 min';
    defaultTags.push('Telemetry', 'Spectrum', 'Frequency');
  } else if (category === 'Document') {
    defaultTags.push('Report', 'Dataset', 'Specification');
  }

  let finalTags = defaultTags;
  if (tagsInput) {
    try {
      const parsed = Array.isArray(tagsInput) ? tagsInput : JSON.parse(tagsInput);
      finalTags = Array.from(new Set([...defaultTags, ...parsed]));
    } catch (e) {
      if (typeof tagsInput === 'string') {
        const splitTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
        finalTags = Array.from(new Set([...defaultTags, ...splitTags]));
      }
    }
  }

  return {
    id: metaId,
    resolution,
    duration,
    tags: JSON.stringify(finalTags),
    description: `Auto-generated metadata for ${file.originalname} during hybrid storage ingestion.`,
    compression_ratio: 'Original (100%)',
    face_count: category === 'Image' || category === 'Video' ? Math.floor(Math.random() * 3) : 0,
    faces_detected: JSON.stringify([])
  };
}

// 1. GET ALL FILES
router.get('/', (req, res) => {
  try {
    const { type, search, sort } = req.query;
    let query = `
      SELECT f.*, m.resolution, m.duration, m.tags, m.description, m.compression_ratio, m.face_count, u.name as uploader_name, u.avatar as uploader_avatar
      FROM files f
      LEFT JOIN metadata m ON f.metadata_id = m.id
      LEFT JOIN users u ON f.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (type && type !== 'All') {
      query += ` AND f.type = ?`;
      params.push(type);
    }

    if (search) {
      query += ` AND (f.name LIKE ? OR m.tags LIKE ? OR m.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (sort === 'oldest') {
      query += ` ORDER BY f.upload_date ASC`;
    } else if (sort === 'size_desc') {
      query += ` ORDER BY f.size DESC`;
    } else if (sort === 'views_desc') {
      query += ` ORDER BY f.views DESC`;
    } else {
      query += ` ORDER BY f.upload_date DESC`;
    }

    const files = db.prepare(query).all(...params);

    // Format tags JSON
    const formatted = files.map(file => ({
      ...file,
      tags: file.tags ? JSON.parse(file.tags) : []
    }));

    res.json({ files: formatted });
  } catch (err) {
    console.error('Fetch files error:', err);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// 2. GET SINGLE FILE & INCREMENT VIEW
router.get('/:id', (req, res) => {
  try {
    const file = db.prepare(`
      SELECT f.*, m.resolution, m.duration, m.tags, m.description, m.compression_ratio, m.face_count, u.name as uploader_name, u.avatar as uploader_avatar
      FROM files f
      LEFT JOIN metadata m ON f.metadata_id = m.id
      LEFT JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `).get(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Increment views
    db.prepare('UPDATE files SET views = views + 1 WHERE id = ?').run(req.params.id);

    file.tags = file.tags ? JSON.parse(file.tags) : [];
    res.json({ file });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve file details' });
  }
});

// 3. UPLOAD FILE WITH SHA-256 DUPLICATE CHECK & METADATA GENERATION
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const forceUpload = req.body.forceUpload === 'true' || req.body.forceUpload === true;
    const userId = req.body.userId || 'usr_admin_01';
    const userName = req.body.userName || 'Dr. Someshwar Rao';

    // Duplicate Check
    const existingFile = db.prepare('SELECT f.*, u.name as uploader_name FROM files f LEFT JOIN users u ON f.user_id = u.id WHERE f.sha256 = ?').get(sha256Hash);

    if (existingFile && !forceUpload) {
      // Don't save duplicate yet, return warning info to frontend
      return res.status(409).json({
        duplicateDetected: true,
        message: 'Duplicate file detected via SHA-256 collision check.',
        sha256: sha256Hash,
        existingFile: {
          id: existingFile.id,
          name: existingFile.name,
          type: existingFile.type,
          size: existingFile.size,
          upload_date: existingFile.upload_date,
          uploader: existingFile.uploader_name
        },
        uploadedTempPath: req.file.path
      });
    }

    const category = getFileTypeCategory(req.file.mimetype, req.file.originalname);
    const meta = generateMetadata(req.file, category, req.body.tags);
    const fileId = 'fl_' + crypto.randomBytes(6).toString('hex');
    const relativePath = 'uploads/' + req.file.filename;

    // Insert Metadata
    db.prepare(`
      INSERT INTO metadata (id, file_id, resolution, duration, tags, description, compression_ratio, face_count, faces_detected)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(meta.id, fileId, meta.resolution, meta.duration, meta.tags, meta.description, meta.compression_ratio, meta.face_count, meta.faces_detected);

    // Insert File Record
    db.prepare(`
      INSERT INTO files (id, name, type, mime_type, size, file_path, sha256, metadata_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(fileId, req.file.originalname, category, req.file.mimetype, req.file.size, relativePath, sha256Hash, meta.id, userId);

    logAuditEvent(userId, userName, 'UPLOAD', `Uploaded multimedia: ${req.file.originalname} (${category}, ${req.file.size} bytes, SHA256: ${sha256Hash.substring(0, 10)}...)`, req.ip);

    res.status(201).json({
      message: 'File uploaded and metadata generated successfully',
      file: {
        id: fileId,
        name: req.file.originalname,
        type: category,
        size: req.file.size,
        mime_type: req.file.mimetype,
        sha256: sha256Hash,
        metadata_id: meta.id,
        file_path: relativePath,
        resolution: meta.resolution,
        duration: meta.duration,
        tags: JSON.parse(meta.tags)
      }
    });

  } catch (err) {
    console.error('Upload handler error:', err);
    res.status(500).json({ error: 'Server error processing file upload' });
  }
});

// 4. DELETE FILE
router.delete('/:id', (req, res) => {
  try {
    const fileId = req.params.id;
    const file = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const userId = req.body.userId || 'usr_admin_01';
    const userName = req.body.userName || 'Dr. Someshwar Rao';

    // Delete physically if exists
    const fullPath = path.join(__dirname, '..', file.file_path);
    if (fs.existsSync(fullPath)) {
      try { fs.unlinkSync(fullPath); } catch (e) {}
    }

    // Delete database records
    if (file.metadata_id) {
      db.prepare('DELETE FROM metadata WHERE id = ?').run(file.metadata_id);
    }
    db.prepare('DELETE FROM files WHERE id = ?').run(fileId);

    logAuditEvent(userId, userName, 'DELETE', `Deleted file: ${file.name} (File ID: ${fileId})`, req.ip);

    res.json({ message: 'File and associated metadata deleted successfully' });
  } catch (err) {
    console.error('Delete file error:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
