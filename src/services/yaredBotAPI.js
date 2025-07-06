/**
 * Yared Bot API Service
 * Connects to the Discord AI API for Ethiopian Orthodox knowledge
 */

// Use environment variable or fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
   * Send a message to Kidus Yared AI
   * @param {string} message - User's message
   * @param {string} chatId - Chat ID for conversation context
   * @returns {Promise<{response: string, sessionId: string}>} - AI response and session ID
   */
  async sendMessage(message, chatId = null) {
    try {
      // Get existing session ID for this chat, or null for new chat
      const currentSessionId = chatId ? this.chatSessions.get(chatId) : null;
      
      // Debug logging to ensure session_id is being sent
      console.log('API Request:', {
        chatId,
        currentSessionId,
        message: message.trim(),
        hasSession: !!currentSessionId
      });
      
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          user_id: 'web_user', // Default user ID for web interface
          session_id: currentSessionId, // Include session for conversation memory
          channel_type: 'web' // Specify this is from web interface
        }),
        // Add timeout for mobile networks
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      let responseText = data.response || 'I apologize, but I cannot provide a response at this time.';
      
      // Clean up response by removing search indicators
      responseText = responseText.replace(/Found in [^:]+:\s*/g, '');
      responseText = responseText.replace(/^(Looking through|Searching|Analyzing)[^\n]*\n*/gm, '');
      responseText = responseText.trim();

      // Store session ID for this chat if provided
      if (data.session_id && chatId) {
        this.chatSessions.set(chatId, data.session_id);
        this.saveSessionsToStorage(); // Persist to localStorage
        console.log('Session stored:', { chatId, sessionId: data.session_id });
      }

      console.log('API Response:', {
        response: responseText.substring(0, 100) + '...',
        sessionId: data.session_id,
        storedSession: chatId ? this.chatSessions.get(chatId) : null
      });

      return {
        response: responseText,
        sessionId: data.session_id
      };
    } catch (error) {
      console.error('Error calling Yared Bot API:', error);
      
      // Fallback response
      let fallbackMessage;
      if (error.message.includes('fetch')) {
        fallbackMessage = 'I cannot connect to the server right now. Please make sure the Yared Bot API is running on localhost:5000.';
      } else {
        fallbackMessage = 'I apologize, but I encountered an error while processing your request. Please try again.';
      }
      
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