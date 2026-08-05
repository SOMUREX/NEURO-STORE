import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'neurostore.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'User',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Metadata Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS metadata (
      id TEXT PRIMARY KEY,
      file_id TEXT,
      resolution TEXT,
      duration TEXT,
      tags TEXT,
      description TEXT,
      compression_ratio TEXT,
      face_count INTEGER DEFAULT 0,
      faces_detected TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Files Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- Image, Video, Audio, Document
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      file_path TEXT NOT NULL,
      sha256 TEXT NOT NULL,
      metadata_id TEXT,
      user_id TEXT NOT NULL,
      downloads INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (metadata_id) REFERENCES metadata(id) ON DELETE SET NULL
    );
  `);

  // 4. Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Database schema initialized successfully.');

  // Seed default users if table is empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    seedDefaultData();
  }
}

function seedDefaultData() {
  const hashedPasswordAdmin = bcrypt.hashSync('admin123', 10);
  const hashedPasswordUser = bcrypt.hashSync('user123', 10);

  const adminId = 'usr_admin_01';
  const userId = 'usr_regular_01';

  db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(adminId, 'Dr. Someshwar Rao', 'admin@neurostore.ai', hashedPasswordAdmin, 'Admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

  db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, 'Alex Morgan', 'user@neurostore.ai', hashedPasswordUser, 'User', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');

  console.log('🌱 Seeded default users: admin@neurostore.ai & user@neurostore.ai');

  // Seed default sample files
  const sampleFiles = [
    {
      id: 'fl_img_01',
      name: 'Brain_cortex_3D_scan.png',
      type: 'Image',
      mime_type: 'image/png',
      size: 4520100,
      file_path: 'uploads/sample_cortex.png',
      sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      user_id: adminId,
      metadata: {
        id: 'meta_01',
        resolution: '3840x2160 (4K)',
        duration: 'N/A',
        tags: JSON.stringify(['Neuroscience', 'MRI', 'Brain Scan', 'Medical']),
        description: 'High-resolution volumetric scan of the cerebral cortex for neural feature mapping.',
        compression_ratio: 'Original (100%)',
        face_count: 0,
        faces_detected: JSON.stringify([])
      }
    },
    {
      id: 'fl_vid_01',
      name: 'Synapse_signal_propagation.mp4',
      type: 'Video',
      mime_type: 'video/mp4',
      size: 18450000,
      file_path: 'uploads/sample_synapse.mp4',
      sha256: 'b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01',
      user_id: adminId,
      metadata: {
        id: 'meta_02',
        resolution: '1920x1080 (FHD)',
        duration: '02:45 min',
        tags: JSON.stringify(['Synapse', 'Action Potential', 'Simulation', 'AI']),
        description: 'Time-lapse micro-photography showing calcium ion exchange across axonal synapses.',
        compression_ratio: 'Compressed (42% saved)',
        face_count: 0,
        faces_detected: JSON.stringify([])
      }
    },
    {
      id: 'fl_aud_01',
      name: 'EEG_alpha_wave_session.mp3',
      type: 'Audio',
      mime_type: 'audio/mpeg',
      size: 8900000,
      file_path: 'uploads/sample_eeg.mp3',
      sha256: 'c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef012',
      user_id: userId,
      metadata: {
        id: 'meta_03',
        resolution: 'N/A',
        duration: '15:20 min',
        tags: JSON.stringify(['EEG', 'Brainwaves', 'Alpha Frequency', 'Telemetry']),
        description: 'Binaural 10Hz alpha wave spectrum recorded during deep focus cognitive task.',
        compression_ratio: 'Original (100%)',
        face_count: 0,
        faces_detected: JSON.stringify([])
      }
    },
    {
      id: 'fl_doc_01',
      name: 'NeuroStore_Architecture_Paper.pdf',
      type: 'Document',
      mime_type: 'application/pdf',
      size: 2450000,
      file_path: 'uploads/sample_paper.pdf',
      sha256: 'd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0123',
      user_id: adminId,
      metadata: {
        id: 'meta_04',
        resolution: 'N/A',
        duration: 'N/A',
        tags: JSON.stringify(['Research Paper', 'Hybrid Storage', 'Architecture', 'AI']),
        description: 'Comprehensive specification of the NeuroStore multimodal dataset indexing system.',
        compression_ratio: 'Original (100%)',
        face_count: 0,
        faces_detected: JSON.stringify([])
      }
    }
  ];

  const insertMeta = db.prepare(`
    INSERT INTO metadata (id, file_id, resolution, duration, tags, description, compression_ratio, face_count, faces_detected)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFile = db.prepare(`
    INSERT INTO files (id, name, type, mime_type, size, file_path, sha256, metadata_id, user_id, downloads, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of sampleFiles) {
    insertMeta.run(
      item.metadata.id,
      item.id,
      item.metadata.resolution,
      item.metadata.duration,
      item.metadata.tags,
      item.metadata.description,
      item.metadata.compression_ratio,
      item.metadata.face_count,
      item.metadata.faces_detected
    );

    insertFile.run(
      item.id,
      item.name,
      item.type,
      item.mime_type,
      item.size,
      item.file_path,
      item.sha256,
      item.metadata.id,
      item.user_id,
      Math.floor(Math.random() * 50) + 10,
      Math.floor(Math.random() * 200) + 50
    );
  }

  // Seed Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, user_id, user_name, action, details, ip_address, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run('aud_01', adminId, 'Dr. Someshwar Rao', 'LOGIN', 'Admin authenticated via standard credentials', '127.0.0.1', new Date(Date.now() - 3600000 * 4).toISOString());
  insertAudit.run('aud_02', adminId, 'Dr. Someshwar Rao', 'UPLOAD', 'Uploaded file: Brain_cortex_3D_scan.png (SHA256 computed)', '127.0.0.1', new Date(Date.now() - 3600000 * 3).toISOString());
  insertAudit.run('aud_03', userId, 'Alex Morgan', 'UPLOAD', 'Uploaded file: EEG_alpha_wave_session.mp3', '192.168.1.42', new Date(Date.now() - 3600000 * 2).toISOString());
  insertAudit.run('aud_04', adminId, 'Dr. Someshwar Rao', 'METADATA_GEN', 'Auto-generated resolution & tags for NeuroStore_Architecture_Paper.pdf', '127.0.0.1', new Date(Date.now() - 3600000 * 1).toISOString());

  console.log('🌱 Seeded initial multimedia files & audit log entries.');
}

export function logAuditEvent(userId, userName, action, details, ipAddress = '127.0.0.1') {
  const auditId = 'aud_' + crypto.randomBytes(6).toString('hex');
  db.prepare(`
    INSERT INTO audit_logs (id, user_id, user_name, action, details, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(auditId, userId, userName || 'Anonymous', action, details, ipAddress);
}

export default db;
