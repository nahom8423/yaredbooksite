// Debug ingestion viewer service
// Attempts multiple backend endpoints to fetch retrieved contexts/chunks

class DebugIngestionService {
  constructor() {
    this.apiBase = localStorage.getItem('yared_api_base') || 'https://web-production-28e35.up.railway.app'
  }

  async inspect(query) {
    const results = { ok: false, chunks: [], meta: {} }
    if (!query || !query.trim()) return results

    // 1) Try a dedicated inspect endpoint (recommended for backend to implement)
    try {
      const resp = await fetch(`${this.apiBase}/rag/inspect?query=${encodeURIComponent(query)}`)
      if (resp.ok) {
        const data = await resp.json()
        if (Array.isArray(data?.chunks)) {
          results.ok = true
          results.chunks = data.chunks
          results.meta.source_count = data.chunks.length
          return results
        }
      }
    } catch (_) {}

    // 2) Try a debug flag on chat endpoint to return contexts
    try {
      const resp = await fetch(`${this.apiBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, debug_context: true })
      })
      if (resp.ok) {
        const data = await resp.json()
        // Expect data.debug_contexts: [{ text, source, page, score }]
        if (Array.isArray(data?.debug_contexts)) {
          results.ok = true
          results.chunks = data.debug_contexts.map((c) => ({
            text: c.text || c.chunk || c.context || '',
            source: c.source || c.doc || c.file || 'unknown',
            page: c.page || null,
            score: c.score || null
          }))
          return results
        }
      }
    } catch (_) {}

    // 3) No endpoint available
    results.ok = false
    results.error = 'No ingestion debug endpoint available. Please add /rag/inspect or return debug_contexts from /chat when debug_context=true.'
    return results
  }
}

const debugIngestion = new DebugIngestionService()
export default debugIngestion

