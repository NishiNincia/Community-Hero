const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.patch('/:id/confirm', (req, res) => {
  const complaintId = req.params.id;
  const row = db.prepare('SELECT * FROM complaints WHERE id = ?').get(complaintId);

  if (!row) {
    return res.status(404).json({ error: 'Complaint not found' });
  }

  const updated = db.prepare(
    "UPDATE complaints SET status = 'Verified', stage = 1 WHERE id = ?"
  ).run(complaintId);

  const refreshed = db.prepare('SELECT * FROM complaints WHERE id = ?').get(complaintId);
  res.json({ ok: true, updated, complaint: refreshed });
});

module.exports = router;

