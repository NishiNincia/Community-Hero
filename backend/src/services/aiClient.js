// Thin wrapper around the Anthropic Messages API.
// Every agent in this codebase calls callClaude() and has a heuristic fallback
// path if no API key is configured, so the backend is fully runnable and
// testable without any external AI dependency — set ANTHROPIC_API_KEY in .env
// to switch each agent from heuristic mode to real model calls.

function isAIEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

async function callClaude(prompt, { maxTokens = 500 } = {}) {
  if (!isAIEnabled()) throw new Error('AI not configured');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const textBlock = data.content.find((b) => b.type === 'text');
  if (!textBlock) throw new Error('No text response from Claude');
  return textBlock.text.replace(/```json|```/g, '').trim();
}

module.exports = { callClaude, isAIEnabled };
