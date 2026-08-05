import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { query, type, tag, minSize, maxSize, sortBy } = req.query;

    let sql = `
      SELECT f.*, m.resolution, m.duration, m.tags, m.description, m.compression_ratio, m.face_count, u.name as uploader_name
      FROM files f
      LEFT JOIN metadata m ON f.metadata_id = m.id
      LEFT JOIN users u ON f.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (query) {
      sql += ` AND (f.name LIKE ? OR m.description LIKE ? OR m.tags LIKE ? OR f.sha256 LIKE ?)`;
      const term = `%${query}%`;
      params.push(term, term, term, term);
    }

    if (type && type !== 'All') {
      sql += ` AND f.type = ?`;
      params.push(type);
    }

    if (tag) {
      sql += ` AND m.tags LIKE ?`;
      params.push(`%${tag}%`);
    }

    if (minSize) {
      sql += ` AND f.size >= ?`;
      params.push(Number(minSize));
    }

    if (maxSize) {
      sql += ` AND f.size <= ?`;
      params.push(Number(maxSize));
    }

    if (sortBy === 'oldest') {
      sql += ` ORDER BY f.upload_date ASC`;
    } else if (sortBy === 'size_desc') {
      sql += ` ORDER BY f.size DESC`;
    } else if (sortBy === 'name') {
      sql += ` ORDER BY f.name ASC`;
    } else {
      sql += ` ORDER BY f.upload_date DESC`;
    }

    const results = db.prepare(sql).all(...params);

    const formatted = results.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));

    res.json({
      count: formatted.length,
      results: formatted
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to execute search' });
  }
});

export default router;
