const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { signToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/citizen/register  { name, email, password, phone }
router.post('/citizen/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const id = uuidv4();
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    `INSERT INTO users (id, name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, 'citizen')`
  ).run(id, name, email, phone || null, hash);

  const user = { id, name, role: 'citizen' };
  res.status(201).json({ token: signToken(user), user });
});

// POST /api/auth/citizen/login  { email, password }
router.post('/citizen/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const normalizedEmail = String(email).trim().toLowerCase();
  let row = db.prepare(`SELECT * FROM users WHERE email = ? AND role = 'citizen'`).get(normalizedEmail);

  // Demo mode: any supplied email/password is accepted and stored for local testing.
  if (!row) {
    const id = uuidv4();
    const hash = bcrypt.hashSync(password, 10);
    const name = normalizedEmail.split('@')[0] || 'Citizen';
    db.prepare(
      `INSERT INTO users (id, name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, 'citizen')`
    ).run(id, name, normalizedEmail, null, hash);
    row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  } else if (!bcrypt.compareSync(password, row.password_hash)) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, row.id);
    row = db.prepare('SELECT * FROM users WHERE id = ?').get(row.id);
  }

  res.json({ token: signToken(row), user: { id: row.id, name: row.name, role: 'citizen', points: row.points } });
});

// POST /api/auth/government/login  { email, password, empId, dept }
router.post('/government/login', (req, res) => {
  const { email, password, empId, dept } = req.body;
  if (!email || !password || !empId) {
    return res.status(400).json({ error: 'email, password, and empId are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  let row = db.prepare(`SELECT * FROM users WHERE email = ? AND role = 'government'`).get(normalizedEmail);

  // Government accounts are provisioned by IT in a real system; for local
  // development we auto-provision on first login so the demo flow works.
  if (!row) {
    const id = uuidv4();
    const hash = bcrypt.hashSync(password, 10);
    const name = `Officer ${normalizedEmail.split('@')[0]}`;
    db.prepare(
      `INSERT INTO users (id, name, email, password_hash, role, dept, emp_id) VALUES (?, ?, ?, ?, 'government', ?, ?)`
    ).run(id, name, normalizedEmail, hash, dept || null, empId);
    row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  } else if (!bcrypt.compareSync(password, row.password_hash)) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET password_hash = ?, dept = COALESCE(?, dept), emp_id = COALESCE(?, emp_id) WHERE id = ?')
      .run(hash, dept || null, empId || null, row.id);
    row = db.prepare('SELECT * FROM users WHERE id = ?').get(row.id);
  }

  res.json({
    token: signToken(row),
    user: { id: row.id, name: row.name, role: 'government', dept: row.dept, empId: row.emp_id },
  });
});

module.exports = router;
