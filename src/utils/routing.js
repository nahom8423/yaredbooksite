export function needsDetailedKnowledge(message) {
  if (!message) return false;
  const m = message.trim().toLowerCase();

  const triggerKeywords = [
    'source', 'sources', 'detailed', 'in detail', 'compare', 'comparison',
    'list', 'differences', 'difference between', 'versus', 'vs', 'timeline',
    'chronology', 'history of', 'summarize with sources'
  ];
  if (triggerKeywords.some(k => m.includes(k))) return true;

  const definitionalRe = /^(what is|who is|define|meaning of|explain (the )?term) /;
  const simpleTokens = new Set(['eotc', 'tewahedo']);

  if (simpleTokens.has(m)) return false;

  if (definitionalRe.test(m) && m.split(/\s+/).length <= 12) return false;

  if (m.split(/\s+/).length > 18) return true;
  if ((m.match(/\?/g) || []).length > 1) return true;

  return true; // conservative default
}

