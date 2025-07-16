/**
 * Analytics Service for ዜማ ቤት (Zema Bet)
 * Tracks user interactions and sends data to your backend
 */

class AnalyticsService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.apiBase = 'https://yaredbott.onrender.com' // Update with your backend URL
    this.isEnabled = true
    this.pageStartTime = Date.now()
    
    // Track initial page load
    this.trackPageView(window.location.pathname)
    
    // Track when user leaves page
    window.addEventListener('beforeunload', () => {
      this.trackPageDuration()
    })
  }

  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('yared_session_id')
    if (!sessionId) {
      sessionId = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('yared_session_id', sessionId)
    }
    return sessionId
  }

  async sendEvent(endpoint, data) {
    if (!this.isEnabled) return

    try {
      const response = await fetch(`${this.apiBase}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          session_id: this.sessionId,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          url: window.location.href,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      })
      
      if (!response.ok) {
        console.warn('Analytics event failed:', response.status)
      }
    } catch (error) {
      console.warn('Analytics error:', error)
    }
  }

  // Track page views
  trackPageView(page) {
    this.pageStartTime = Date.now()
    this.sendEvent('/analytics/pageview', {
      page: page,
      event_type: 'page_view'
    })
  }

  // Track page duration when leaving
  trackPageDuration() {
    const duration = Date.now() - this.pageStartTime
    this.sendEvent('/analytics/page_duration', {
      page: window.location.pathname,
      duration_ms: duration,
      event_type: 'page_duration'
    })
  }

  // Track chat interactions
  trackChatMessage(message, responseType = 'unknown') {
    this.sendEvent('/analytics/chat_message', {
      message_length: message.length,
      response_type: responseType,
      event_type: 'chat_message'
    })
  }

  // Track button clicks
  trackButtonClick(buttonName, context = '') {
    this.sendEvent('/analytics/button_click', {
      button_name: buttonName,
      context: context,
      event_type: 'button_click'
    })
  }

  // Track user engagement
  trackEngagement(action, details = {}) {
    this.sendEvent('/analytics/engagement', {
      action: action,
      details: details,
      event_type: 'engagement'
    })
  }

  // Track errors
  trackError(error, context = '') {
    this.sendEvent('/analytics/error', {
      error_message: error.toString(),
      context: context,
      event_type: 'error'
    })
  }

  // Get analytics data (for admin dashboard)
  async getAnalytics() {
    try {
      const response = await fetch(`${this.apiBase}/analytics/stats`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      return null
    }
  }

  // Get real-time stats
  async getRealtimeStats() {
    try {
      const response = await fetch(`${this.apiBase}/analytics/realtime`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch realtime stats:', error)
      return null
    }
  }

  // Disable analytics (privacy)
  disable() {
    this.isEnabled = false
    localStorage.setItem('yared_analytics_disabled', 'true')
  }

  // Enable analytics
  enable() {
    this.isEnabled = true
    localStorage.removeItem('yared_analytics_disabled')
  }

  // Check if user has disabled analytics
  isAnalyticsDisabled() {
    return localStorage.getItem('yared_analytics_disabled') === 'true'
  }
}

// Create singleton instance
const analytics = new AnalyticsService()

// Disable if user has opted out
if (analytics.isAnalyticsDisabled()) {
  analytics.disable()
}

export default analytics