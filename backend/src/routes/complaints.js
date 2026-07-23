const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const { processNewComplaint, logAgentAction } = require('../agents/orchestrator');
const { runResolutionAuditAgent } = require('../agents/resolutionAuditAgent');

const router = express.Router();

const STAGES = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

function toFrontendShape(row) {
  return {
    id: row.id,
    title: row.title,
    cat: row.category,
    sev: row.severity_score,
    urg: row.urgency_level,
    dept: row.department,
    status: row.status,
    eta: row.status === 'Resolved' ? 'Resolved' : row.eta_label || row.sla_deadline,
    votes: row.votes,
    lat: row.latitude,
    lng: row.longitude,
    ward: row.ward,
    desc: row.description,
    sum: row.ai_summary,
    stage: row.stage,
    clusterId: row.cluster_id,
    slaDeadline: row.sla_deadline,
    auditStatus: row.audit_status,
  };
}

// POST /api/complaints/preview  — runs the AI pipeline WITHOUT saving,
// matches the existing 3-step modal's step 2 ("AI review before confirm").
router.post('/preview', requireAuth, requireRole('citizen'), async (req, res) => {
  try {
    const { description, photoUrl, latitude, longitude, ward, landmark } = req.body;
    if (!description || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'description, latitude, and longitude are required' });
    }
    const result = await processNewComplaint({
      userId: req.user.id,
      rawText: description,
      photoUrl,
      latitude,
      longitude,
      ward,
      landmark,
    });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Pipeline failed', detail: e.message });
  }
});

// POST /api/complaints — confirms and persists a complaint using a previously
// returned preview payload (matches step 3 "Confirm & Submit" in the modal).
router.post('/', requireAuth, requireRole('citizen'), (req, res) => {
  const {
    title, description, category, subcategory, department,
    severity_score, urgency_level, cluster_id, sla_hours, sla_deadline,
    latitude, longitude, ward, photoUrl, citizen_friendly_summary,
  } = req.body;

  if (!description || !category || latitude == null || longitude == null) {
    return res.status(400).json({ error: 'Missing required complaint fields' });
  }

  const id = 'ISS-' + uuidv4().slice(0, 8).toUpperCase();
  db.prepare(
    `INSERT INTO complaints
     (id, user_id, cluster_id, title, description, category, subcategory, department,
      photo_url, latitude, longitude, ward, severity_score, urgency_level,
      status, stage, votes, sla_hours, sla_deadline, ai_summary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Reported', 0, 0, ?, ?, ?)`
  ).run(
    id, req.user.id, cluster_id || null,
    title || description.slice(0, 60), description, category, subcategory, department,
    photoUrl || null, latitude, longitude, ward || null,
    severity_score || null, urgency_level || null,
    sla_hours || null, sla_deadline || null, citizen_friendly_summary || null
  );

  db.prepare('UPDATE users SET points = points + 150, issues_count = issues_count + 1 WHERE id = ?').run(req.user.id);
  logAgentAction(id, 'complaint_service', 'created', `cluster=${cluster_id}`);

  const row = db.prepare('SELECT * FROM complaints WHERE id = ?').get(id);
  res.status(201).json({ complaint: toFrontendShape(row), pointsEarned: 150 });
});

// GET /api/complaints?status=&ward=&category=
router.get('/', (req, res) => {
  const { status, ward, category } = req.query;
  let sql = 'SELECT * FROM complaints WHERE 1=1';
  const params = [];
  if (status && status !== 'All') { sql += ' AND status = ?'; params.push(status); }
  if (ward && ward !== 'All') { sql += ' AND ward = ?'; params.push(ward); }
  if (category && category !== 'All') { sql += ' AND category = ?'; params.push(category); }
  sql += ' ORDER BY datetime(created_at) DESC';
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(toFrontendShape));
});

// GET /api/complaints/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM complaints WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(toFrontendShape(row));
});

// PATCH /api/complaints/:id/status  { status }  — government only
router.patch('/:id/status', requireAuth, requireRole('government'), (req, res) => {
  const { status } = req.body;
  if (!STAGES.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const row = db.prepare('SELECT * FROM complaints WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const stage = STAGES.indexOf(status);
  db.prepare('UPDATE complaints SET status = ?, stage = ? WHERE id = ?').run(status, stage, req.params.id);
  logAgentAction(req.params.id, 'government_dashboard', 'status_updated', `${row.status} -> ${status}`);
  res.json({ ok: true, status, stage });
});

// POST /api/complaints/:id/resolve  { resolutionPhotoUrl } — government only,
// gated by the Resolution-Audit Agent before the ticket is allowed to close.
router.post('/:id/resolve', requireAuth, requireRole('government'), async (req, res) => {
  const { resolutionPhotoUrl } = req.body;
  const row = db.prepare('SELECT * FROM complaints WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const audit = await runResolutionAuditAgent({
    originalDescription: row.description,
    originalPhotoUrl: row.photo_url,
    resolutionPhotoUrl,
  });

  logAgentAction(req.params.id, 'resolution_audit', audit.audit_status, audit.audit_notes);

  if (audit.audit_status === 'Rejected') {
    return res.status(422).json({ ok: false, audit });
  }

  const closesTicket = audit.audit_status === 'Verified';
  db.prepare(
    `UPDATE complaints SET resolution_photo_url = ?, audit_status = ?, audit_notes = ?,
     status = ?, stage = ?, resolved_at = CASE WHEN ? THEN datetime('now') ELSE resolved_at END
     WHERE id = ?`
  ).run(
    resolutionPhotoUrl, audit.audit_status, audit.audit_notes,
    closesTicket ? 'Resolved' : row.status,
    closesTicket ? 4 : row.stage,
    closesTicket ? 1 : 0,
    req.params.id
  );

  res.json({ ok: true, audit, closed: closesTicket });
});

// POST /api/complaints/:id/verify — citizen upvote/consensus confirmation
router.post('/:id/verify', requireAuth, requireRole('citizen'), (req, res) => {
  const complaintId = req.params.id;
  const already = db.prepare('SELECT 1 FROM complaint_verifications WHERE complaint_id = ? AND user_id = ?')
    .get(complaintId, req.user.id);
  if (already) return res.status(409).json({ error: 'Already verified by this user' });

  db.prepare('INSERT INTO complaint_verifications (complaint_id, user_id) VALUES (?, ?)').run(complaintId, req.user.id);
  db.prepare('UPDATE complaints SET votes = votes + 1 WHERE id = ?').run(complaintId);
  db.prepare('UPDATE users SET points = points + 10, verified_count = verified_count + 1 WHERE id = ?').run(req.user.id);

  const row = db.prepare('SELECT * FROM complaints WHERE id = ?').get(complaintId);
  res.json({ ok: true, votes: row.votes });
});

module.exports = router;
