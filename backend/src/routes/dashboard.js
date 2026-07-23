const express = require('express');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats — powers the 4 stat cards on the citizen dashboard
// and the 3 header stats on the government dashboard.
router.get('/stats', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) c FROM complaints').get().c;
  const resolved = db.prepare(`SELECT COUNT(*) c FROM complaints WHERE status = 'Resolved'`).get().c;
  const pending = total - resolved;
  const critical = db.prepare(`SELECT COUNT(*) c FROM complaints WHERE urgency_level = 'Critical'`).get().c;
  const inProgress = db.prepare(`SELECT COUNT(*) c FROM complaints WHERE status = 'In Progress'`).get().c;

  const avgRow = db.prepare(
    `SELECT AVG(julianday(resolved_at) - julianday(created_at)) avgDays
     FROM complaints WHERE status = 'Resolved'`
  ).get();
  const avgResolutionDays = avgRow.avgDays ? Math.round(avgRow.avgDays * 10) / 10 : null;

  // Predictive-insights style rollup: wards with the most unresolved high/critical issues.
  const hotspots = db.prepare(
    `SELECT ward, category, COUNT(*) c FROM complaints
     WHERE status != 'Resolved' AND urgency_level IN ('High','Critical') AND ward IS NOT NULL
     GROUP BY ward, category ORDER BY c DESC LIMIT 3`
  ).all();

  res.json({
    totalReported: total,
    resolved,
    pending,
    criticalCount: critical,
    inProgressCount: inProgress,
    avgResolutionDays,
    hotspots,
  });
});

module.exports = router;
