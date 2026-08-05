import express from 'express';
import db, { logAuditEvent } from '../db.js';

const router = express.Router();

// 1. Smart Compression Prototype Endpoint
router.post('/compress', (req, res) => {
  try {
    const { fileId, targetQuality = 80 } = req.body;
    const file = db.prepare('SELECT f.*, m.id as meta_id FROM files f LEFT JOIN metadata m ON f.metadata_id = m.id WHERE f.id = ?').get(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const originalSize = file.size;
    const compressionFactor = (100 - (targetQuality * 0.4)) / 100;
    const compressedSize = Math.round(originalSize * compressionFactor);
    const savedBytes = originalSize - compressedSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

    // Update metadata compression ratio
    if (file.meta_id) {
      db.prepare('UPDATE metadata SET compression_ratio = ? WHERE id = ?').run(`Compressed (${savedPercent}% saved)`, file.meta_id);
    }

    logAuditEvent(file.user_id || 'usr_admin_01', 'NeuroStore AI', 'SMART_COMPRESS', `Compressed ${file.name} to ${targetQuality}% quality. Saved ${savedPercent}% storage.`, req.ip);

    res.json({
      success: true,
      fileId,
      filename: file.name,
      originalSize,
      compressedSize,
      savedBytes,
      savedPercent: `${savedPercent}%`,
      algorithm: 'NeuroLossless-AV1-Quantizer',
      previewMessage: 'Smart compression pipeline executed successfully.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to run compression pipeline' });
  }
});

// 2. Face Recognition Linking Prototype Endpoint
router.post('/face-link', (req, res) => {
  try {
    const { fileId } = req.body;
    const file = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);

    const mockFaces = [
      { subjectId: 'SUBJ_9042', confidence: 0.98, boundingBox: { x: 120, y: 80, width: 140, height: 160 }, label: 'Subject Alpha (Patient #104)' },
      { subjectId: 'SUBJ_1108', confidence: 0.94, boundingBox: { x: 340, y: 110, width: 130, height: 150 }, label: 'Dr. E. Vance (Researcher)' }
    ];

    if (file && file.metadata_id) {
      db.prepare('UPDATE metadata SET face_count = ?, faces_detected = ? WHERE id = ?')
        .run(mockFaces.length, JSON.stringify(mockFaces), file.metadata_id);
    }

    logAuditEvent('usr_admin_01', 'NeuroStore AI', 'FACE_LINKING', `Detected ${mockFaces.length} face embeddings in file ${file ? file.name : fileId}`, req.ip);

    res.json({
      success: true,
      fileId,
      facesDetected: mockFaces.length,
      faces: mockFaces,
      linkedDatabaseProfiles: 2
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed face recognition analysis' });
  }
});

// 3. Video Summarization Prototype Endpoint
router.post('/video-summary', (req, res) => {
  try {
    const { fileId } = req.body;
    const file = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);

    const keyframes = [
      { timestamp: '00:05', title: 'Stimulus Baseline', description: 'Patient resting state recording begins.' },
      { timestamp: '00:42', title: 'Axonal Activity Spike', description: 'High frequency spike observed in visual cortex.' },
      { timestamp: '01:50', title: 'Response Stabilization', description: 'Frequency settles back to 10Hz alpha spectrum.' }
    ];

    res.json({
      success: true,
      fileId,
      filename: file ? file.name : 'Sample Video',
      originalDuration: '02:45 min',
      summaryDuration: '00:30 min (82% reduction)',
      keyframes,
      executiveSummary: 'Automated AI summarization extracted 3 key neural excitation events, reducing review time from 165s down to 30s.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Video summarization failed' });
  }
});

// 4. Content-Based Similarity Search Prototype Endpoint
router.post('/vector-search', (req, res) => {
  try {
    const { fileId, queryText } = req.body;

    const allFiles = db.prepare(`
      SELECT f.*, m.tags, m.description, u.name as uploader_name
      FROM files f
      LEFT JOIN metadata m ON f.metadata_id = m.id
      LEFT JOIN users u ON f.user_id = u.id
      LIMIT 10
    `).all();

    const matches = allFiles.map(f => {
      const similarityScore = (0.75 + Math.random() * 0.23).toFixed(3);
      return {
        ...f,
        tags: f.tags ? JSON.parse(f.tags) : [],
        similarityScore: Number(similarityScore)
      };
    }).sort((a, b) => b.similarityScore - a.similarityScore);

    res.json({
      success: true,
      query: queryText || (fileId ? `File Feature Vector [${fileId}]` : 'Neural Scan Similarity'),
      similarFiles: matches.slice(0, 4)
    });
  } catch (err) {
    res.status(500).json({ error: 'Similarity search failed' });
  }
});

export default router;
