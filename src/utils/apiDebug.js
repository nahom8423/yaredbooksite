/**
 * API debugging utilities for YaredBot system
 */

export const debugAPI = {
  /**
   * Log API request details
   */
  logRequest: (endpoint, data) => {
    console.group(`🚀 API Request: ${endpoint}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request data:', data);
    console.log('Session ID:', data?.session_id || 'None');
    console.groupEnd();
  },

  /**
   * Log API response details with sources analysis
   */
  logResponse: (endpoint, response) => {
    console.group(`📨 API Response: ${endpoint}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Response length:', response?.response?.length || 0);
    console.log('Session ID:', response?.sessionId || 'None');
    
    // Detailed sources analysis
    if (response?.sources) {
      console.log('Sources found:', response.sources.length);
      console.table(response.sources.map(source => ({
        title: source.title?.substring(0, 30) + '...',
        domain: new URL(source.url).hostname,
        hasIcon: !!source.favicon,
        snippetLength: source.snippet?.length || 0
      })));
    } else {
      console.warn('⚠️ No sources in response');
    }
    
    console.groupEnd();
  },

  /**
   * Log sources rendering in UI
   */
  logUIRender: (messageId, sources) => {
    console.group(`🎨 UI Render: Message ${messageId}`);
    console.log('Sources to render:', sources?.length || 0);
    
    if (sources && sources.length > 0) {
      console.log('Valid sources:', sources.filter(s => s.title && s.url).length);
      console.log('Sources with favicons:', sources.filter(s => s.favicon).length);
    } else {
      console.warn('⚠️ No sources to render in UI');
    }
    
    console.groupEnd();
  },

  /**
   * Test sources display with mock data
   */
  getMockSources: () => [
    {
      title: "Brief History of Tekle Aquaquam",
      url: "https://eotcmk.org/e/brief-history-of-tekle-aquaquam/",
      favicon: "https://eotcmk.org/favicon.ico",
      snippet: "Tekle Aquaquam is a unique style of chant and spiritual skip by church choir using sistra and prayer sticks...",
      date: "Recent"
    },
    {
      title: "Ethiopian Orthodox Tewahedo Church",
      url: "https://www.ethiopianorthodox.org/english/tradition",
      favicon: "https://www.ethiopianorthodox.org/favicon.ico", 
      snippet: "The Ethiopian Orthodox Tewahedo Church is one of the oldest Christian churches in the world...",
      date: "Recent"
    },
    {
      title: "Saint Yared and Liturgical Music",
      url: "https://example.org/saint-yared",
      favicon: "https://example.org/favicon.ico",
      snippet: "Saint Yared is credited with developing the musical notation system for Ethiopian Orthodox liturgy...",
      date: "Recent"
    }
  ],

  /**
   * Monitor localStorage for debugging
   */
  monitorLocalStorage: () => {
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    
    localStorage.setItem = function(key, value) {
      if (key.includes('yared')) {
        console.log(`💾 localStorage SET: ${key}`, value?.length || 0, 'characters');
      }
      originalSetItem.apply(this, arguments);
    };
    
    localStorage.getItem = function(key) {
      const result = originalGetItem.apply(this, arguments);
      if (key.includes('yared') && result) {
        console.log(`💾 localStorage GET: ${key}`, result?.length || 0, 'characters');
      }
      return result;
    };
  }
};

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  debugAPI.monitorLocalStorage();
}