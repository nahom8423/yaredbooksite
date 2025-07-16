import { useState, useEffect } from 'react'

export default function DeviceDetector({ isVisible, onClose }) {
  const [deviceInfo, setDeviceInfo] = useState(null)

  useEffect(() => {
    if (isVisible) {
      const info = {
        userAgent: navigator.userAgent,
        screenWidth: screen.width,
        screenHeight: screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      }
      setDeviceInfo(info)
    }
  }, [isVisible])

  const copyToClipboard = () => {
    if (deviceInfo) {
      const text = JSON.stringify(deviceInfo, null, 2)
      navigator.clipboard.writeText(text).then(() => {
        alert('Device info copied to clipboard!')
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1F1F1F] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-semibold text-white">Device Information</h2>
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
        <div className="p-6">
          {deviceInfo ? (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm mb-4">
                Copy this device information and send it to enable analytics access:
              </p>
              
              <div className="bg-[#0f0f0f] rounded-lg p-4 border border-[#2A2A2A]">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap break-all">
                  {JSON.stringify(deviceInfo, null, 2)}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-400">Device Type: </span>
                  <span className="text-white">
                    {deviceInfo.userAgent.includes('iPhone') ? 'iPhone' : 
                     deviceInfo.userAgent.includes('iPad') ? 'iPad' :
                     deviceInfo.userAgent.includes('Macintosh') ? 'MacBook/Mac' : 
                     deviceInfo.userAgent.includes('Windows') ? 'Windows PC' : 'Unknown'}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Screen: </span>
                  <span className="text-white">{deviceInfo.screenWidth} × {deviceInfo.screenHeight}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Platform: </span>
                  <span className="text-white">{deviceInfo.platform}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  Copy Device Info
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg hover:bg-[#404040] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
              <p className="text-gray-400 mt-2">Detecting device...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}