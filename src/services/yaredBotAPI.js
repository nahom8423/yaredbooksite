/**
 * Yared Bot API Service
 * Connects to the Discord AI API for Ethiopian Orthodox knowledge
 */

import { debugAPI } from '../utils/apiDebug';

// Use environment variable or fallback to Railway production URL
// Production site: https://nahom8423.github.io/yaredbooksite/
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-28e35.up.railway.app';

class YaredBotAPI {
  constructor() {
    this.apiUrl = API_BASE_URL;
    this.chatSessions = new Map(); // Track session IDs per chat
    this.loadSessionsFromStorage(); // Load persisted sessions on initialization
    this.validateSessions(); // Clean up any invalid sessions
  }

  /**
   * Load session data from localStorage
   */
  loadSessionsFromStorage() {
    try {
      const storedSessions = localStorage.getItem('yared_chat_sessions');
      if (storedSessions) {
        const sessionsData = JSON.parse(storedSessions);
        this.chatSessions = new Map(Object.entries(sessionsData));
      }
    } catch (error) {
      console.error('Error loading sessions from localStorage:', error);
    }
  }

  /**
   * Save session data to localStorage
   */
  saveSessionsToStorage() {
    try {
      const sessionsData = Object.fromEntries(this.chatSessions);
      localStorage.setItem('yared_chat_sessions', JSON.stringify(sessionsData));
    } catch (error) {
      console.error('Error saving sessions to localStorage:', error);
    }
  }

  /**
   * Send a quick message for fast response (2-3s)
   * @param {string} message - User's message  
   * @param {string} chatId - Chat ID for conversation context
   * @returns {Promise<{response: string, responseType: string, canExpand: boolean}>}
   */
  async sendQuickMessage(message, chatId = null) {
    try {
      const requestData = {
        message: message.trim()
      };

      debugAPI('📞 Quick API Request: /chat/quick', `Timestamp: ${new Date().toISOString()}`, `Request data: ${JSON.stringify(requestData)}`, `Session ID: ${chatId || 'None'}`);

      const response = await fetch(`${this.apiUrl}/chat/quick`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        // Quick timeout for fast responses - simplified
        signal: AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Quick response failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        response: data.answer,
        responseType: data.response_type || 'quick',
        canExpand: data.can_expand || false,
        modelUsed: data.model_used,
        sources: data.sources || []
      };

    } catch (error) {
      console.error('Quick response error:', error);
      throw error;
    }
  }

  /**
   * Send a message to Kidus Yared AI (detailed response with RAG)
   * @param {string} message - User's message
   * @param {string} chatId - Chat ID for conversation context
   * @returns {Promise<{response: string, sessionId: string}>} - AI response and session ID
   */
  async sendMessage(message, chatId = null) {
    try {
      // Get existing session ID for this chat, or null for new chat
      const currentSessionId = chatId ? this.chatSessions.get(chatId) : null;
      
      const requestData = {
        message: message.trim()
      };

      // Debug logging to ensure session_id is being sent
      debugAPI.logRequest('/chat', requestData);
      
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        // Add timeout for mobile networks - simplified
        signal: AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(60000) : undefined
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      let responseText = data.answer || data.response || 'I apologize, but I cannot provide a response at this time.';
      
      // Clean up response by removing search indicators
      responseText = responseText.replace(/Found in [^:]+:\s*/g, '');
      responseText = responseText.replace(/^(Looking through|Searching|Analyzing)[^\n]*\n*/gm, '');
      // Remove FEAST_ID placeholders
      responseText = responseText.replace(/\[FEAST_ID:\s*([^\]]+)\]/g, '$1');
      responseText = responseText.trim();

      // Note: New API doesn't support sessions yet, but keeping structure for compatibility
      const sessionId = data.session_id || null;
      
      const apiResult = {
        response: responseText,
        sessionId: sessionId,
        sources: data.sources || [],
        model_used: data.model_used
      };

      // Enhanced debugging with sources analysis
      debugAPI.logResponse('/chat', apiResult);

      return apiResult;
    } catch (error) {
      console.error('Error calling Yared Bot API:', error);
      
      // Enhanced error handling for mobile
      let fallbackMessage;
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        fallbackMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        fallbackMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('AI service not configured')) {
        fallbackMessage = 'AI service is temporarily unavailable. Please try again in a moment.';
      } else {
        fallbackMessage = 'I apologize, but I encountered an error while processing your request. Please try again.';
      }
      
      // Log additional debug info for mobile
      console.error('Mobile debug info:', {
        errorName: error.name,
        errorMessage: error.message,
        apiUrl: this.apiUrl,
        userAgent: navigator.userAgent,
        online: navigator.onLine
      });
      
      return {
        response: fallbackMessage,
        sessionId: null
      };
    }
  }

  /**
   * Check if the API is available
   * @returns {Promise<boolean>} - True if API is accessible
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  /**
   * Clear conversation memory for a specific chat
   * @param {string} chatId - Chat ID to clear session for
   */
  clearConversation(chatId) {
    if (chatId) {
      this.chatSessions.delete(chatId);
      this.saveSessionsToStorage(); // Persist changes to localStorage
    }
  }

  /**
   * Clear all conversation sessions
   */
  clearAllConversations() {
    this.chatSessions.clear();
    this.saveSessionsToStorage(); // Persist changes to localStorage
  }

  /**
   * Get current session ID for a chat
   * @param {string} chatId - Chat ID to get session for
   * @returns {string|null} - Current session ID
   */
  getSessionId(chatId) {
    return chatId ? this.chatSessions.get(chatId) : null;
  }

  /**
   * Validate and clean up stored sessions
   */
  validateSessions() {
    const invalidSessions = [];
    for (const [chatId, sessionId] of this.chatSessions) {
      if (!sessionId || sessionId.trim() === '') {
        invalidSessions.push(chatId);
      }
    }
    
    // Remove invalid sessions
    for (const chatId of invalidSessions) {
      this.chatSessions.delete(chatId);
    }
    
    if (invalidSessions.length > 0) {
      this.saveSessionsToStorage();
      console.log('Cleaned up invalid sessions:', invalidSessions);
    }
  }

  /**
   * Get all active sessions for debugging
   */
  getActiveSessions() {
    return Array.from(this.chatSessions.entries());
  }

  /**
   * Get suggested questions for Ethiopian Orthodox topics
   * @returns {Array<string>} - Array of suggested questions
   */
  getSuggestedQuestions() {
    return [
      "Tell me about Saint Yared and his contributions to liturgical music",
      "What are the major fasting periods in Ethiopian Orthodox faith?",
      "Explain the Ethiopian calendar and its significance",
      "Describe the significance and traditions of Timkat (Epiphany)",
      "What is the role of the Ark of the Covenant in Ethiopian Orthodox belief?",
      "Explain the importance of Ge'ez language in Ethiopian Orthodox liturgy"
    ];
  }
}

// Export singleton instance
export const yaredBotAPI = new YaredBotAPI();
export default yaredBotAPI;