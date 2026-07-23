const { categories } = require('./classificationAgent');

/**
 * Routing Agent — intentionally rule-based, NOT an LLM call.
 * Misrouting a complaint to the wrong department is worse than an imperfect
 * classification, so this stays deterministic against the config table.
 */
function runRoutingAgent({ category, escalationTier, severityScore }) {
  const cfg = categories[category] || categories['Roads & Infrastructure'];
  let slaHours = cfg.sla_hours;

  // Critical severity or high consensus tightens the SLA regardless of category default.
  if (escalationTier === 'High' || severityScore >= 9) {
    slaHours = Math.min(slaHours, 24);
  } else if (escalationTier === 'Elevated') {
    slaHours = Math.min(slaHours, Math.round(cfg.sla_hours * 0.6));
  }

  const deadline = new Date(Date.now() + slaHours * 3600 * 1000);

  return {
    department: cfg.department,
    slaHours,
    slaDeadline: deadline.toISOString(),
    etaLabel: slaHours <= 24 ? '24 hours' : `${Math.round(slaHours / 24)} days`,
  };
}

module.exports = { runRoutingAgent };
