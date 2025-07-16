import { useState, useEffect } from 'react'
import analytics from '../services/analytics'

export default function AnalyticsDashboard({ isVisible, onClose }) {
  const [stats, setStats] = useState(null)
  const [realtimeStats, setRealtimeStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isVisible) {
      loadAnalytics()
      
      // Set up real-time updates every 30 seconds
      const interval = setInterval(loadRealtimeStats, 30000)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const [analyticsData, realtimeData] = await Promise.all([
        analytics.getAnalytics(),
        analytics.getRealtimeStats()
      ])
      
      setStats(analyticsData)
      setRealtimeStats(realtimeData)
      setError(null)
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Analytics error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadRealtimeStats = async () => {
    try {
      const realtimeData = await analytics.getRealtimeStats()
      setRealtimeStats(realtimeData)
    } catch (err) {
      console.error('Realtime stats error:', err)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1F1F1F] rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
          <h2 className="text-2xl font-semibold text-white">ዜማ ቤት Analytics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#2A2A2A] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
              <span className="ml-3 text-gray-400">Loading analytics...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">{error}</div>
              <button
                onClick={loadAnalytics}
                className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Real-time Stats */}
              {realtimeStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#2A2A2A] rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Active Users</div>
                    <div className="text-2xl font-bold text-[#D4AF37]">{realtimeStats.active_users}</div>
                    <div className="text-xs text-gray-500">Currently online</div>
                  </div>
                  <div className="bg-[#2A2A2A] rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Recent Messages</div>
                    <div className="text-2xl font-bold text-green-400">{realtimeStats.recent_messages}</div>
                    <div className="text-xs text-gray-500">Last hour</div>
                  </div>
                  <div className="bg-[#2A2A2A] rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Page Views</div>
                    <div className="text-2xl font-bold text-blue-400">{realtimeStats.recent_page_views}</div>
                    <div className="text-xs text-gray-500">Last hour</div>
                  </div>
                </div>
              )}

              {/* Overall Stats */}
              {stats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Total Sessions</div>
                      <div className="text-2xl font-bold text-white">{stats.total_sessions}</div>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Page Views</div>
                      <div className="text-2xl font-bold text-white">{stats.total_page_views}</div>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Chat Messages</div>
                      <div className="text-2xl font-bold text-white">{stats.total_messages}</div>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Avg Session</div>
                      <div className="text-2xl font-bold text-white">{stats.session_duration_avg}m</div>
                    </div>
                  </div>

                  {/* Popular Pages */}
                  {stats.popular_pages && stats.popular_pages.length > 0 && (
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Popular Pages</h3>
                      <div className="space-y-2">
                        {stats.popular_pages.slice(0, 5).map((page, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-300">{page.page}</span>
                            <span className="text-[#D4AF37] font-semibold">{page.views} views</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Daily Active Users */}
                  {stats.daily_active_users && (
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Daily Active Users (Last 7 Days)</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {Object.entries(stats.daily_active_users).map(([date, users]) => (
                          <div key={date} className="text-center">
                            <div className="text-xs text-gray-400 mb-1">
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-sm font-semibold text-white">{users}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Countries */}
                  {stats.top_countries && stats.top_countries.length > 0 && (
                    <div className="bg-[#2A2A2A] rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Top Countries</h3>
                      <div className="space-y-2">
                        {stats.top_countries.slice(0, 5).map((country, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-300">{country.country}</span>
                            <span className="text-[#D4AF37] font-semibold">{country.users} users</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Refresh Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadAnalytics}
                  className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}