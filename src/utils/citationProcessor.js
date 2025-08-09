/**
 * Processes message text to convert [SOURCE_X] placeholders into inline citations
 * @param {string} text - The message text with source placeholders
 * @param {Array} sources - Array of source objects with id property
 * @returns {string} - HTML string with clickable citations
 */
export function processInlineCitations(text, sources = []) {
  if (!text || !sources.length) {
    return text;
  }

  // Create a mapping of source IDs to display numbers
  const sourceMap = new Map();
  sources.forEach((source, index) => {
    sourceMap.set(source.id || (index + 1), index + 1);
  });

  // Replace [SOURCE_X] placeholders with clickable citations
  const processedText = text.replace(/\[SOURCE_(\d+)\]/g, (match, sourceId) => {
    const displayNumber = sourceMap.get(parseInt(sourceId, 10));
    if (displayNumber) {
      return `<span class="inline-citation" data-source-id="${sourceId}" data-display-number="${displayNumber}">[${displayNumber}]</span>`;
    }
    return match; // Return original if source not found
  });

  return processedText;
}

/**
 * Converts processed HTML string back to React elements with click handlers
 * @param {string} htmlString - HTML string with citation spans
 * @param {Function} onCitationClick - Callback when citation is clicked
 * @returns {React.ReactElement} - React element with interactive citations
 */
export function renderWithCitations(htmlString, onCitationClick) {
  // This would be used in React component - we'll handle it in the component directly
  return htmlString;
}