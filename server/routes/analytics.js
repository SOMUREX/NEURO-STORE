import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const totalFiles = db.prepare('SELECT COUNT(*) as count FROM files').get().count;
    const totalStorage = db.prepare('SELECT SUM(size) as total FROM files').get().total || 0;

    const countsByTypeRows = db.prepare('SELECT type, COUNT(*) as count, SUM(size) as storage FROM files GROUP BY type').all();

    const countsByType = {
      Image: 0,
      Video: 0,
      Audio: 0,
      Document: 0
    };

    const storageByType = {
      Image: 0,
      Video: 0,
      Audio: 0,
      Document: 0
    };

    countsByTypeRows.forEach(row => {
      if (countsByType[row.type] !== undefined) {
        countsByType[row.type] = row.count;
        storageByType[row.type] = row.storage || 0;
      }
    });

    // Calculate duplicates count via group by sha256
    const duplicatesCount = db.prepare(`
      SELECT COUNT(*) as dupCount FROM (
        SELECT sha256 FROM files GROUP BY sha256 HAVING COUNT(*) > 1
      )
    `).get().dupCount || 0;

    // Total Views & Downloads
    const totalsStats = db.prepare('SELECT SUM(views) as totalViews, SUM(downloads) as totalDownloads FROM files').get();

    // Recent uploads
    const recentUploads = db.prepare(`
      SELECT f.id, f.name, f.type, f.size, f.upload_date, u.name as uploader
      FROM files f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.upload_date DESC
      LIMIT 5
    `).all();

    // Audit count
    const totalAuditLogs = db.prepare('SELECT COUNT(*) as count FROM audit_logs').get().count;

    res.json({
      totalFiles,
      totalStorage,
      storageFormatted: (totalStorage / (1024 * 1024)).toFixed(2) + ' MB',
      countsByType,
      storageByType,
      duplicatesCount,
      totalViews: totalsStats.totalViews || 0,
      totalDownloads: totalsStats.totalDownloads || 0,
      totalAuditLogs,
      recentUploads
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to retrieve analytics metrics' });
  }
});

export default router;
