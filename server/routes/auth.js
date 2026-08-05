import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { logAuditEvent } from '../db.js';
import crypto from 'crypto';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'neurostore_secret_jwt_key_2026';

// Register
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const userId = 'usr_' + crypto.randomBytes(6).toString('hex');
    const hashedPassword = bcrypt.hashSync(password, 10);
    const assignedRole = role === 'Admin' ? 'Admin' : 'User';
    const avatar = `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?w=150`;

    db.prepare(`
      INSERT INTO users (id, name, email, password, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, name, email, hashedPassword, assignedRole, avatar);

    const token = jwt.sign({ id: userId, email, role: assignedRole, name }, JWT_SECRET, { expiresIn: '7d' });

    logAuditEvent(userId, name, 'REGISTER', `New user registered as ${assignedRole}`, req.ip);

    res.json({
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role: assignedRole, avatar }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      logAuditEvent('unknown', email, 'LOGIN_FAILED', 'User email not found', req.ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      logAuditEvent(user.id, user.name, 'LOGIN_FAILED', 'Invalid password attempt', req.ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    logAuditEvent(user.id, user.name, 'LOGIN', `User logged in successfully (${user.role})`, req.ip);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get Current User Profile
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
