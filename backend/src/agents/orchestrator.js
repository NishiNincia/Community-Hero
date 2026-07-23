const { runIntakeAgent } = require('./intakeAgent');
const { runClassificationAgent } = require('./classificationAgent');
const { runDuplicateCheckAgent } = require('./duplicateCheckAgent');
const { runRoutingAgent } = require('./routingAgent');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

function logAgentAction(complaintId, agent, action, reason) {
  db.prepare(
    `INSERT INTO audit_log (id, complaint_id, agent, action, reason) VALUES (?, ?, ?, ?, ?)`
  ).run(uuidv4(), complaintId, agent, action, reason || null);
}

/**
 * Runs the full intake -> classify -> dedup -> route pipeline for a new
 * complaint, matching the architecture discussed: Citizen -> Intake Agent ->
 * {Classification Agent, Duplicate-Check Agent} -> Routing Agent -> output.
 */
async function processNewComplaint({ userId, rawText, photoUrl, latitude, longitude, ward, landmark }) {
  // 1. Intake
  const intake = await runIntakeAgent({
    rawText,
    photoProvided: Boolean(photoUrl),
    landmarkHint: landmark,
  });
  logAgentAction(null, 'intake', 'processed', intake.needs_clarification ? 'clarification needed' : 'ok');

  if (intake.needs_clarification) {
    return { status: 'needs_clarification', question: intake.clarification_question };
  }

  const description = intake.clean_description || rawText;

  // 2. Classification (runs independently of dedup, both fed by intake output)
  const classification = await runClassificationAgent({
    description,
    photoProvided: Boolean(photoUrl),
  });

  // 3. Duplicate-check / consensus (also independent, feeds into routing)
  const dedup = runDuplicateCheckAgent({
    userId,
    category: classification.category,
    latitude,
    longitude,
    ward,
  });

  // 4. Routing (deterministic, uses classification + dedup outputs)
  const routing = runRoutingAgent({
    category: classification.category,
    escalationTier: dedup.escalationTier,
    severityScore: classification.severity_score,
  });

  logAgentAction(
    null,
    'duplicate_check',
    dedup.isDuplicate ? 'merged_into_cluster' : 'new_cluster',
    `cluster=${dedup.clusterId} tier=${dedup.escalationTier}`
  );
  logAgentAction(null, 'routing', 'routed', `dept=${routing.department} sla=${routing.slaHours}h`);

  return {
    status: 'ready',
    description,
    category: classification.category,
    subcategory: classification.subcategory,
    severity_score: classification.severity_score,
    urgency_level: classification.urgency_level,
    citizen_friendly_summary: classification.citizen_friendly_summary,
    cluster_id: dedup.clusterId,
    is_duplicate: dedup.isDuplicate,
    consensus_message: dedup.message,
    unique_reporter_count: dedup.uniqueReporterCount,
    escalation_tier: dedup.escalationTier,
    department: routing.department,
    sla_hours: routing.slaHours,
    sla_deadline: routing.slaDeadline,
    estimated_resolution_time: routing.etaLabel,
  };
}

module.exports = { processNewComplaint, logAgentAction };
