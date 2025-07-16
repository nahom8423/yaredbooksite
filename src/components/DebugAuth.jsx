import { useState } from 'react'
import analytics from '../services/analytics'

export default function DebugAuth({ isVisible, onClose }) {
  const [authResult, setAuthResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testAuthorization = async () => {
    setLoading(true)
    try {
      const deviceInfo = {
        user_agent: navigator.userAgent,
        screen_width: screen.width,
        screen_height: screen.height
      }

      const response = await fetch(`${analytics.apiBase}/analytics/check_device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceInfo)
      })
      
      const result = await response.json()
      setAuthResult(result)
    } catch (error) {
      setAuthResult({
        authorized: false,
        message: 'Error checking authorization',
        debug_info: {
          error: error.toString()
        }
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1F1F1F] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-semibold text-white">Debug Authorization</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#2A2A2A] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <button
            onClick={testAuthorization}
            disabled={loading}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Device Authorization'}
          </button>

          {authResult && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${authResult.authorized ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
                <div className="text-lg font-semibold mb-2">
                  {authResult.authorized ? '✅ AUTHORIZED' : '❌ NOT AUTHORIZED'}
                </div>
                <div className="text-sm text-gray-300">
                  {authResult.message}
                </div>
              </div>

              {authResult.debug_info && (
                <div className="bg-[#0f0f0f] rounded-lg p-4 border border-[#2A2A2A]">
                  <h3 className="text-sm font-semibold text-white mb-2">Debug Information:</h3>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">
                    {JSON.stringify(authResult.debug_info, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-gray-400">
            This tool helps debug why analytics access might not be working.
            Share the debug information if you're still having issues.
          </div>
        </div>
      </div>
    </div>
  )
}