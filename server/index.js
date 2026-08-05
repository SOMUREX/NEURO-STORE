import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js';

import authRoutes from './routes/auth.js';
import fileRoutes from './routes/files.js';
import searchRoutes from './routes/search.js';
import analyticsRoutes from './routes/analytics.js';
import auditRoutes from './routes/audit.js';
import aiRoutes from './routes/ai.js';
import iotRoutes from './routes/iot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for raw multimedia hybrid storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/iot', iotRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'NeuroStore Multimedia & IoT ML Engine API',
    version: '1.1.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NeuroStore Backend REST API running at http://localhost:${PORT}`);
  console.log(`📂 Hybrid Media Upload Storage directory: ${path.join(__dirname, 'uploads')}`);
});
