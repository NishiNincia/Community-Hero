const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { haversineMeters } = require('../services/geoUtils');

const PROXIMITY_METERS = 100;
const WINDOW_DAYS = 30;

function escalationTier(uniqueReporterCount) {
  if (uniqueReporterCount >= 15) return 'High';
  if (uniqueReporterCount >= 5) return 'Elevated';
  return 'Normal';
}

/**
 * Duplicate-Check / Consensus Agent.
 * Finds an existing cluster of the same category within PROXIMITY_METERS
 * created in the last WINDOW_DAYS. If found, attaches the new complaint to it
 * and recalculates the escalation tier off the UNIQUE reporter count (not raw
 * complaint count) to prevent one user inflating priority.
 * If no match, creates a new cluster.
 */
function runDuplicateCheckAgent({ userId, category, latitude, longitude, ward }) {
  const candidates = db
    .prepare(
      `SELECT * FROM clusters
       WHERE category = ?
       AND datetime(created_at) > datetime('now', '-${WINDOW_DAYS} days')`
    )
    .all(category);

  let match = null;
  for (const c of candidates) {
    const dist = haversineMeters(latitude, longitude, c.center_lat, c.center_lng);
    if (dist <= PROXIMITY_METERS) {
      match = c;
      break;
    }
  }

  if (match) {
    // Rate-limit: one complaint per user per cluster (checked by caller before
    // insert too, but we guard here defensively).
    const alreadyReported = db
      .prepare(`SELECT 1 FROM complaints WHERE cluster_id = ? AND user_id = ?`)
      .get(match.id, userId);

    const uniqueReporterCount = alreadyReported
      ? match.unique_reporter_count
      : match.unique_reporter_count + 1;

    const tier = escalationTier(uniqueReporterCount);

    db.prepare(
      `UPDATE clusters SET unique_reporter_count = ?, escalation_tier = ? WHERE id = ?`
    ).run(uniqueReporterCount, tier, match.id);

    return {
      isDuplicate: true,
      clusterId: match.id,
      uniqueReporterCount,
      escalationTier: tier,
      message: `${uniqueReporterCount - 1} other ${uniqueReporterCount - 1 === 1 ? 'person has' : 'people have'} already reported this nearby — your report has been added to the same case.`,
    };
  }

  const newClusterId = uuidv4();
  db.prepare(
    `INSERT INTO clusters (id, category, center_lat, center_lng, ward, unique_reporter_count, escalation_tier)
     VALUES (?, ?, ?, ?, ?, 1, 'Normal')`
  ).run(newClusterId, category, latitude, longitude, ward);

  return {
    isDuplicate: false,
    clusterId: newClusterId,
    uniqueReporterCount: 1,
    escalationTier: 'Normal',
    message: null,
  };
}

module.exports = { runDuplicateCheckAgent, escalationTier };
