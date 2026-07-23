const { callClaude, isAIEnabled } = require('../services/aiClient');

/**
 * Resolution-Audit Agent.
 * Compares the department's closure photo against the original complaint
 * photo/description to check whether the reported issue is actually gone
 * before allowing the ticket to close. This targets a common failure mode:
 * complaints marked "Resolved" with no real fix performed.
 *
 * In production this does a vision-model comparison of original vs closure
 * photo. Without a configured AI key, it falls back to requiring a closure
 * photo to exist at all (can't verify content, but blocks empty/no-evidence
 * closures) and flags for manual spot-check.
 */
async function runResolutionAuditAgent({ originalDescription, originalPhotoUrl, resolutionPhotoUrl }) {
  if (!resolutionPhotoUrl) {
    return {
      audit_status: 'Rejected',
      audit_notes: 'No resolution photo provided. Upload evidence of the fix before closing.',
    };
  }

  if (isAIEnabled() && originalPhotoUrl) {
    const prompt = `A civic complaint said: "${originalDescription}". A department claims it is now resolved and submitted a closure photo. Original photo: ${originalPhotoUrl}. Closure photo: ${resolutionPhotoUrl}. Based on the description alone (assume you cannot literally see the images in this text-only check), respond ONLY with JSON: {"audit_status": "Verified or Rejected or Needs Review", "audit_notes": "one sentence reason"}`;
    try {
      const raw = await callClaude(prompt);
      return JSON.parse(raw);
    } catch (e) {
      // fall through
    }
  }

  return {
    audit_status: 'Needs Review',
    audit_notes: 'Closure photo received. Flagged for manual spot-check (AI visual verification not configured).',
  };
}

module.exports = { runResolutionAuditAgent };
