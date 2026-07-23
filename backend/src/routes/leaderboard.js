const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/leaderboard — top citizens by points, matches existing LEADERS UI shape
router.get('/', (req, res) => {
  const rows = db.prepare(
    `SELECT name, points, issues_count, verified_count
     FROM users WHERE role = 'citizen' ORDER BY points DESC LIMIT 10`
  ).all();

  const badges = ['🏆', '🥈', '🥉'];
  const result = rows.map((r, i) => ({
    rank: i + 1,
    name: r.name,
    pts: r.points,
    badge: badges[i] || '⭐',
    issues: r.issues_count,
    ver: r.verified_count,
  }));
  res.json(result);
});

module.exports = router;
