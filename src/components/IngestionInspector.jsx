import { useState } from 'react'
import debugIngestion from '../services/debugIngestion'

export default function IngestionInspector() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chunks, setChunks] = useState([])

  const handleInspect = async (e) => {
    e?.preventDefault?.()
    setLoading(true)
    setError(null)
    setChunks([])
    try {
      const res = await debugIngestion.inspect(query)
      if (!res.ok) {
        setError(res.error || 'Failed to load ingestion data')
      } else {
        setChunks(res.chunks || [])
      }
    } catch (err) {
      setError('Failed to load ingestion data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#2A2A2A] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Knowledge Ingestion Inspector</h3>
      </div>
      <form onSubmit={handleInspect} className="flex gap-2 mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a query to retrieve indexed chunks (e.g., required fasts)"
          className="flex-1 bg-[#1F1F1F] text-white placeholder-gray-500 rounded px-3 py-2 border border-[#3a3a3a] focus:outline-none focus:border-[#D4AF37]"
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="px-3 py-2 bg-[#D4AF37] text-black rounded hover:bg-[#B8941F] disabled:opacity-50"
        >
          {loading ? 'Inspecting…' : 'Inspect'}
        </button>
      </form>

      {error && (
        <div className="text-red-400 text-sm mb-2">{error}</div>
      )}

      {chunks.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {chunks.map((c, i) => (
            <div key={i} className="p-3 bg-[#1A1A1A] rounded border border-[#333]">
              <div className="text-xs text-gray-400 mb-2">
                <span className="mr-3">Source: {c.source || 'unknown'}</span>
                {c.page != null && <span className="mr-3">Page: {c.page}</span>}
                {c.score != null && <span>Score: {typeof c.score === 'number' ? c.score.toFixed(3) : String(c.score)}</span>}
              </div>
              <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-snug">{c.text}</pre>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <div className="text-gray-400 text-sm">No chunks yet. Enter a query and click Inspect.</div>
        )
      )}
    </div>
  )
}

