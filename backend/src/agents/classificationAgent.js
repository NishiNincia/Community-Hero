const fs = require('fs');
const path = require('path');
const { callClaude, isAIEnabled } = require('../services/aiClient');

const categories = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'config', 'categories.json'), 'utf-8')
);

function urgencyFromScore(score) {
  if (score >= 8.5) return 'Critical';
  if (score >= 6.5) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
}

// Heuristic classifier: keyword match against the category config, with a
// severity bump for words implying immediate danger. This runs when no AI key
// is configured, and is also used as a safety-net if the AI call fails or
// returns a category outside the known taxonomy.
function heuristicClassify(text) {
  const lower = text.toLowerCase();
  let best = { category: 'Roads & Infrastructure', score: 0 };

  for (const [cat, cfg] of Object.entries(categories)) {
    const hits = cfg.keywords.filter((k) => lower.includes(k)).length;
    if (hits > best.score) best = { category: cat, score: hits };
  }

  const dangerWords = ['danger', 'urgent', 'exposed wire', 'burst', 'flooding', 'collapse', 'sewage'];
  const dangerHits = dangerWords.filter((w) => lower.includes(w)).length;

  const cfg = categories[best.category];
  const baseSeverity = 4 + best.score * 0.8 + dangerHits * 1.5;
  const severity = Math.min(10, Math.round(baseSeverity * cfg.severity_weight * 10) / 10);

  return {
    category: best.category,
    subcategory: cfg.subcategories[0],
    severity_score: severity,
    urgency_level: urgencyFromScore(severity),
    citizen_friendly_summary: `${best.category} issue logged and routed to ${cfg.department}.`,
  };
}

async function runClassificationAgent({ description, photoProvided }) {
  if (isAIEnabled()) {
    const catList = Object.keys(categories).join(', ');
    const prompt = `Classify this Indian civic complaint. Valid categories are exactly: ${catList}.
Complaint: "${description}". Photo attached: ${photoProvided ? 'yes' : 'no'}.
Respond ONLY with JSON, no prose:
{"category": "one of the valid categories exactly", "subcategory": "specific subtype", "severity_score": number between 0-10, "urgency_level": "Low|Medium|High|Critical", "citizen_friendly_summary": "one sentence, reassuring, plain language"}`;
    try {
      const raw = await callClaude(prompt);
      const parsed = JSON.parse(raw);
      if (categories[parsed.category]) return parsed;
    } catch (e) {
      // fall through to heuristic
    }
  }
  return heuristicClassify(description);
}

module.exports = { runClassificationAgent, categories };
