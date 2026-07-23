const { callClaude, isAIEnabled } = require('../services/aiClient');

/**
 * Intake Agent
 * Takes raw citizen input (free text, or a transcript if voice was used upstream)
 * and normalizes it into a clean description + extracts location hints.
 * In production this sits behind a speech-to-text step (e.g. Whisper) for voice notes
 * arriving over WhatsApp; this module assumes text has already been transcribed.
 */
async function runIntakeAgent({ rawText, photoProvided, landmarkHint }) {
  const trimmed = (rawText || '').trim();

  if (!trimmed) {
    return {
      clean_description: '',
      needs_clarification: true,
      clarification_question: 'Could you describe the issue in a sentence or two?',
    };
  }

  if (isAIEnabled()) {
    const prompt = `You are an intake assistant for a civic complaint system in India. A citizen submitted this report: "${trimmed}". ${landmarkHint ? `They mentioned this landmark: ${landmarkHint}.` : ''} ${photoProvided ? 'A photo was attached.' : 'No photo was attached.'}
Respond ONLY with JSON, no prose, no markdown fences:
{"clean_description": "a clear one-to-two sentence rewrite of the complaint in English", "needs_clarification": boolean, "clarification_question": "string or null", "extracted_landmark": "string or null"}`;
    try {
      const result = await callClaude(prompt);
      return JSON.parse(result);
    } catch (e) {
      // fall through to heuristic fallback below
    }
  }

  // Heuristic fallback (no AI key configured) — still fully functional, just simpler.
  const needsClarification = !photoProvided && trimmed.length < 15;
  return {
    clean_description: trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
    needs_clarification: needsClarification,
    clarification_question: needsClarification
      ? 'Can you share a photo or a nearby landmark so we can locate the issue?'
      : null,
    extracted_landmark: landmarkHint || null,
  };
}

module.exports = { runIntakeAgent };
