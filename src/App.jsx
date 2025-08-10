import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ThinkingIndicator from './components/ThinkingIndicator';
import SearchingIndicator from './components/SearchingIndicator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DeviceDetector from './components/DeviceDetector';
import DebugAuth from './components/DebugAuth';
import saintYaredImage from './assets/images/saintyared.png';
import { yaredBotAPI } from './services/yaredBotAPI';
import analytics from './services/analytics';

// Dynamic test components loader (only in development)
function DevTestComponents() {
  const [TestComponents, setTestComponents] = useState(null);

  useEffect(() => {
    // Only load test components in development mode
    if (import.meta.env.DEV) {
      Promise.all([
        import('./components/DebugTestComponent').catch(() => null),
        import('./components/SearchingTest').catch(() => null)
      ]).then(([DebugTest, SearchTest]) => {
        setTestComponents({
          DebugTestComponent: DebugTest?.default,
          SearchingTest: SearchTest?.default
        });
      });
    }
  }, []);

  // Don't render anything in production
  if (!import.meta.env.DEV || !TestComponents) {
    return null;
  }

  return (
    <>
      {TestComponents.DebugTestComponent && <TestComponents.DebugTestComponent />}
      {TestComponents.SearchingTest && <TestComponents.SearchingTest />}
    </>
  );
}

function App() {
  // Initialize with proper mobile detection to prevent FOUC
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  })
  const [sidebarVisible, setSidebarVisible] = useState(() => !isMobile)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const loadChatHistory = () => {
      try {
        const storedHistory = localStorage.getItem('yared_chat_history');
        const storedCurrentChat = localStorage.getItem('yared_current_chat_id');
        
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          // Validate that the parsed history is an array
          if (Array.isArray(parsedHistory)) {
            setChatHistory(parsedHistory);
            console.log(`Loaded ${parsedHistory.length} chats from localStorage`);
          }
        }
        
        // Restore current chat if it exists
        if (storedCurrentChat) {
          const currentChatId = parseInt(storedCurrentChat);
          const storedHistory = localStorage.getItem('yared_chat_history');
          if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);
            const currentChat = parsedHistory.find(chat => chat.id === currentChatId);
            if (currentChat) {
              setCurrentChatId(currentChatId);
              setMessages(currentChat.messages || []);
              console.log(`Restored current chat: ${currentChatId}`);
            }
          }
        }
      } catch (error) {
        console.error('Error loading chat history from localStorage:', error);
        // Initialize with empty array if there's an error
        setChatHistory([]);
      }
    };
    loadChatHistory();
  }, []);

  // Save chat history to localStorage whenever it changes (with debouncing)
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      try {
        if (chatHistory.length > 0) {
          localStorage.setItem('yared_chat_history', JSON.stringify(chatHistory));
          console.log(`Saved ${chatHistory.length} chats to localStorage`);
        }
      } catch (error) {
        console.error('Error saving chat history to localStorage:', error);
        // Try to clear space and save again
        try {
          localStorage.removeItem('yared_chat_history_backup');
          localStorage.setItem('yared_chat_history', JSON.stringify(chatHistory));
        } catch (retryError) {
          console.error('Failed to save chat history after retry:', retryError);
        }
      }
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(saveTimeout);
  }, [chatHistory]);

  // Save current chat ID to localStorage
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('yared_current_chat_id', currentChatId.toString());
    } else {
      localStorage.removeItem('yared_current_chat_id');
    }
  }, [currentChatId]);
  const [newMessageId, setNewMessageId] = useState(null)
  const [newChatCreated, setNewChatCreated] = useState(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [scrollRef, setScrollRef] = useState(null)
  const [isThinking, setIsThinking] = useState(false)
  const [thinkingText, setThinkingText] = useState('')
  const [thinkingHistory, setThinkingHistory] = useState([])
  const [thinkingStartTime, setThinkingStartTime] = useState(null)
  const [thinkingDuration, setThinkingDuration] = useState(null)
  // Refs for reliable timing and shimmer delay handling
  const thinkingStartRef = useRef(null)
  const shimmerTimeoutRef = useRef(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showDeviceDetector, setShowDeviceDetector] = useState(false)
  const [showDebugAuth, setShowDebugAuth] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)


  // Modern viewport offset handling for mobile browsers
  useEffect(() => {
    let timeoutId = null
    
    function setOffset() {
      // Clear any pending timeout to debounce rapid changes
      if (timeoutId) clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        const vv = window.visualViewport
        if (vv) {
          // Calculate how much the keyboard has reduced the viewport
          const keyboardHeight = Math.max(0, window.innerHeight - vv.height)
          // Only apply offset if keyboard height is significant (> 50px)
          const offset = keyboardHeight > 50 ? -keyboardHeight : 0
          document.documentElement.style.setProperty('--kb-offset', offset + 'px')
        }
      }, 10) // Small debounce to prevent rapid jumping
    }
    
    setOffset()
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setOffset)
      return () => {
        window.visualViewport.removeEventListener('resize', setOffset)
        if (timeoutId) clearTimeout(timeoutId)
      }
    }
  }, [])

  // Handle sidebar offset for input bar positioning (desktop only)
  useEffect(() => {
    let sidebarOffset = '0px'
    if (!isMobile && sidebarVisible) {
      sidebarOffset = '256px' // Full sidebar width
    }
    document.documentElement.style.setProperty('--sidebar-offset', sidebarOffset)
  }, [isMobile, sidebarVisible])


  // Set initial CSS variables synchronously to prevent FOUC
  useEffect(() => {
    // Only override if sidebar is not visible on desktop
    if (!isMobile && !sidebarVisible) {
      document.documentElement.style.setProperty('--sidebar-offset', '0px')
    }
    document.documentElement.style.setProperty('--kb-offset', '0px')
    
    // Mark as initialized after CSS variables are set
    setIsInitialized(true)
  }, []) // Run once on mount

  // Recovery function for lost data
  const recoverChatHistory = () => {
    try {
      const backup = localStorage.getItem('yared_chat_history_backup');
      if (backup) {
        const parsedBackup = JSON.parse(backup);
        if (Array.isArray(parsedBackup) && parsedBackup.length > 0) {
          setChatHistory(parsedBackup);
          console.log('Chat history recovered from backup');
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to recover chat history:', error);
    }
    return false;
  };

  // Add periodic data integrity check
  useEffect(() => {
    const checkDataIntegrity = () => {
      // Ensure chat history has valid structure
      setChatHistory(prev => {
        const validChats = prev.filter(chat => 
          chat && 
          chat.id && 
          chat.title && 
          Array.isArray(chat.messages)
        );
        
        if (validChats.length !== prev.length) {
          console.log('Cleaned up invalid chat entries');
        }
        
        return validChats;
      });
    };

    // Check every 30 seconds
    const interval = setInterval(checkDataIntegrity, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Only update state if it actually changed to prevent unnecessary re-renders
      if (isMobileDevice !== isMobile) {
        setIsMobile(isMobileDevice)
        if (isMobileDevice) {
          setSidebarVisible(false)
          setMobileMenuOpen(false)
        } else {
          setSidebarVisible(true)
          setMobileMenuOpen(false)
        }
      }
    }
    
    // Only add listeners, don't run checkMobile since state is already initialized correctly
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [isMobile])

  // Analytics keyboard shortcut (Ctrl+Shift+A) and Device detector (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setShowAnalytics(true)
        analytics.trackEngagement('analytics_opened', { method: 'keyboard_shortcut' })
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setShowDeviceDetector(true)
        analytics.trackEngagement('device_detector_opened', { method: 'keyboard_shortcut' })
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        e.preventDefault()
        setShowDebugAuth(true)
        analytics.trackEngagement('debug_auth_opened', { method: 'keyboard_shortcut' })
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  // Handle sending messages to Yared Bot
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return

    // Track chat message analytics
    analytics.trackChatMessage(messageText)

    // Create new chat if this is the first message
    let chatId = currentChatId
    if (!chatId) {
      chatId = Date.now()
      setCurrentChatId(chatId)
      const newChat = {
        id: chatId,
        title: messageText.slice(0, 50) + (messageText.length > 50 ? '...' : ''),
        messages: [],
        timestamp: new Date()
      }
      setChatHistory(prev => [newChat, ...prev])
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    }
    
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    
    // Update chat history with user message
    setChatHistory(prevHistory => 
      prevHistory.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: updatedMessages }
          : chat
      )
    )
    
    setIsLoading(true)
    
    // Determine if this needs WEB SEARCH (current events) vs KNOWLEDGE BASE (theological questions)
    const needsWebSearch = (text) => {
      const webSearchKeywords = [
        'news', 'current', 'today', 'recent', 'latest', '2024', '2025', 'now', 
        'breaking', 'update', 'happening', 'trending', 'politics', 'weather',
        'covid', 'pandemic', 'election', 'war', 'ukraine', 'israel', 'economy'
      ]
      const lowerText = text.toLowerCase()
      return webSearchKeywords.some(keyword => lowerText.includes(keyword))
    }

    const requiresWebSearch = needsWebSearch(messageText)
    
    if (requiresWebSearch) {
      // Show web search indicator for current events
      setIsSearching(true)
    } else {
      // Start timing immediately; delay shimmer for visual pacing
      thinkingStartRef.current = Date.now()
      if (shimmerTimeoutRef.current) {
        clearTimeout(shimmerTimeoutRef.current)
      }
      shimmerTimeoutRef.current = setTimeout(() => {
        setIsThinking(true)
        setThinkingText('Thinking')
      }, 300)
    }

    try {
      // Log current session status for debugging
      console.log('Sending message:', {
        chatId,
        message: messageText,
        existingSessionId: yaredBotAPI.getSessionId(chatId),
        requiresWebSearch
      });
      
      // Get AI response with session tracking
      const { response: aiResponse, sessionId, sources } = await yaredBotAPI.sendMessage(messageText, chatId)
      
      // Hide indicators
      setIsSearching(false)
      
      // Debug: Log sources data
      console.log('Received sources from API:', sources);
      console.log('Sources type:', typeof sources, 'Length:', sources?.length);
      
      // Track successful AI response
      analytics.trackEngagement('ai_response_received', { 
        response_length: aiResponse.length,
        response_type: requiresWebSearch ? 'ai_response_with_web_search' : 'ai_response_with_knowledge'
      })
      
      // Compute and store thinking duration if applicable (independent of isThinking)
      let computedDuration = null
      if (!requiresWebSearch && thinkingStartRef.current != null) {
        const endTime = Date.now()
        const durationMs = endTime - thinkingStartRef.current
        const seconds = Math.max(0, durationMs / 1000)
        const formatted = `${seconds.toFixed(1)} seconds`
        computedDuration = formatted
        const thinkingRecord = {
          id: Date.now() - 1, // Best-effort association before AI message
          text: thinkingText || 'thinking',
          timestamp: new Date(),
          duration: formatted
        }
        setThinkingHistory(prev => [...prev, thinkingRecord])
        setThinkingDuration(formatted)
      }
      
      // Clear shimmer delay if pending; ensure shimmer doesn't flip on late
      if (shimmerTimeoutRef.current) {
        clearTimeout(shimmerTimeoutRef.current)
        shimmerTimeoutRef.current = null
      }
      setIsThinking(false)
      setThinkingText('')
      thinkingStartRef.current = null
      setThinkingStartTime(null)
      
      // Add AI message with session ID tracking, sources, and thinking duration
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        sessionId: sessionId, // Store session ID with message for debugging
        sources: sources || [],
        thinkingDuration: computedDuration
      }
      setNewMessageId(aiMessage.id) // Mark this as the new message for animation
      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)
      
      // Trigger sidebar animation when AI responds
      if (!newChatCreated) {
        setNewChatCreated(chatId)
        setTimeout(() => setNewChatCreated(null), 3000)
      }
      
      // Update chat history with AI response
      setChatHistory(prevHistory => 
        prevHistory.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages: finalMessages }
            : chat
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
      setIsSearching(false)
      setIsThinking(false)
      setThinkingText('')
      
      // Determine error message based on error type
      let errorText = 'Sorry, I encountered an error. Please try again.'
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        errorText = 'Request timed out. Please check your connection and try again.'
      } else if (error.message.includes('fetch') || error.message.includes('network')) {
        errorText = 'Unable to connect to the server. Please check your internet connection.'
      }
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        isError: true
      }
      const errorMessages = [...updatedMessages, errorMessage]
      setMessages(errorMessages)
      
      // Update chat history with error message
      setChatHistory(prevHistory => 
        prevHistory.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages: errorMessages }
            : chat
        )
      )
    } finally {
      setIsLoading(false)
      // Clear shimmer timeout and reset thinking state
      if (shimmerTimeoutRef.current) {
        clearTimeout(shimmerTimeoutRef.current)
        shimmerTimeoutRef.current = null
      }
      setIsThinking(false)
      setThinkingText('')
      thinkingStartRef.current = null
      setThinkingStartTime(null)
      setThinkingDuration(null)
    }
  }

  // Handle new chat
  const handleNewChat = () => {
    analytics.trackButtonClick('new_chat')
    
    // Clear all states immediately to prevent visual artifacts
    setIsLoading(false)
    setIsThinking(false)
    setThinkingText('')
    
    setMessages([])
    setCurrentChatId(null)
    setNewMessageId(null)
    
    if (isMobile) {
      setMobileMenuOpen(false)
    }
  }

  // Handle chat selection
  const handleChatSelect = (chat) => {
    console.log('Selecting chat:', chat.id, 'with', chat.messages?.length || 0, 'messages')
    console.log('Chat messages:', chat.messages)
    
    // Clear all loading and thinking states FIRST to prevent visual artifacts
    setIsLoading(false)
    setIsThinking(false)
    setThinkingText('')
    setNewMessageId(null) // Clear new message ID when loading old chat
    
    // Then load the new chat data
    const chatMessages = Array.isArray(chat.messages) ? chat.messages : []
    setMessages(chatMessages)
    setCurrentChatId(chat.id)
    
    if (isMobile) {
      setMobileMenuOpen(false)
    }
  }

  // Handle chat deletion with backup
  const handleChatDelete = (chatId) => {
    console.log('Deleting chat:', chatId)
    
    // Create backup before deletion
    try {
      const currentHistory = JSON.stringify(chatHistory);
      localStorage.setItem('yared_chat_history_backup', currentHistory);
    } catch (error) {
      console.error('Failed to create backup before deletion:', error);
    }
    
    // Clear the session for this chat
    yaredBotAPI.clearConversation(chatId)
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      setMessages([])
      setCurrentChatId(null)
      setNewMessageId(null)
      setIsLoading(false)
    }
  }

  // Handle chat rename
  const handleChatRename = (chatId, newTitle) => {
    console.log('Renaming chat:', chatId, 'to:', newTitle)
    setChatHistory(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: newTitle }
          : chat
      )
    )
  }

  // Debug: Log chat history changes
  useEffect(() => {
    console.log('Chat history updated:', chatHistory.length, 'chats')
    chatHistory.forEach(chat => {
      console.log(`Chat ${chat.id}: "${chat.title}" with ${chat.messages?.length || 0} messages`)
    })
  }, [chatHistory])

  // Debug: Log messages changes
  useEffect(() => {
    console.log('Messages updated:', messages.length, 'messages for chat:', currentChatId)
  }, [messages, currentChatId])

  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion) => {
    analytics.trackButtonClick('suggestion_click', suggestion)
    handleSendMessage(suggestion)
  }


  // Handle message regeneration
  const handleRegenerateMessage = async (messageToRegenerate) => {
    if (!currentChatId || isLoading) return

    // Find the message index and get the user message that preceded this AI response
    const messageIndex = messages.findIndex(msg => msg.id === messageToRegenerate.id)
    if (messageIndex <= 0) return // No preceding message or message not found

    const userMessage = messages[messageIndex - 1]
    if (!userMessage.isUser) return // Previous message wasn't from user

    // Remove the AI message we're regenerating
    const messagesWithoutRegenerated = messages.slice(0, messageIndex)
    setMessages(messagesWithoutRegenerated)

    // Update chat history to remove the regenerated message
    setChatHistory(prevHistory => 
      prevHistory.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: messagesWithoutRegenerated }
          : chat
      )
    )

    // Resend the user's message to get a new AI response
    setIsLoading(true)

    // Determine if this needs WEB SEARCH (current events) vs KNOWLEDGE BASE (theological questions)
    const needsWebSearch = (text) => {
      const webSearchKeywords = [
        'news', 'current', 'today', 'recent', 'latest', '2024', '2025', 'now', 
        'breaking', 'update', 'happening', 'trending', 'politics', 'weather',
        'covid', 'pandemic', 'election', 'war', 'ukraine', 'israel', 'economy'
      ]
      const lowerText = text.toLowerCase()
      return webSearchKeywords.some(keyword => lowerText.includes(keyword))
    }

    const requiresWebSearch = needsWebSearch(userMessage.text)
    
    if (requiresWebSearch) {
      // Show web search indicator for current events
      setIsSearching(true)
    } else {
      // Start timing immediately; delay shimmer for visual pacing
      thinkingStartRef.current = Date.now()
      if (shimmerTimeoutRef.current) {
        clearTimeout(shimmerTimeoutRef.current)
      }
      shimmerTimeoutRef.current = setTimeout(() => {
        setIsThinking(true)
        setThinkingText('Thinking')
      }, 300)
    }

    try {
      
      // Get new AI response
      const { response: aiResponse, sessionId, sources } = await yaredBotAPI.sendMessage(userMessage.text, currentChatId)
      
      // Hide indicators
      setIsSearching(false)
      
      // Debug: Log sources data for regeneration
      console.log('Regenerate - Received sources from API:', sources);
      console.log('Regenerate - Sources type:', typeof sources, 'Length:', sources?.length);
      
      // Compute and store thinking duration if applicable (independent of isThinking)
      let regenComputedDuration = null
      if (!requiresWebSearch && thinkingStartRef.current != null) {
        const endTime = Date.now()
        const durationMs = endTime - thinkingStartRef.current
        const seconds = Math.max(0, durationMs / 1000)
        const formatted = `${seconds.toFixed(1)} seconds`
        regenComputedDuration = formatted
        const thinkingRecord = {
          id: Date.now() - 1,
          text: thinkingText || 'thinking',
          timestamp: new Date(),
          duration: formatted
        }
        setThinkingHistory(prev => [...prev, thinkingRecord])
        setThinkingDuration(formatted)
      }
      
      if (shimmerTimeoutRef.current) {
        clearTimeout(shimmerTimeoutRef.current)
        shimmerTimeoutRef.current = null
      }
      setIsThinking(false)
      setThinkingText('')
      thinkingStartRef.current = null
      setThinkingStartTime(null)
      
      // Add new AI message with real sources and thinking duration
      const newAiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        sessionId: sessionId,
        sources: sources || [],
        thinkingDuration: regenComputedDuration
      }
      setNewMessageId(newAiMessage.id) // Mark this as the new message for animation
      const finalMessages = [...messagesWithoutRegenerated, newAiMessage]
      setMessages(finalMessages)
      
      // Update chat history with new AI response
      setChatHistory(prevHistory => 
        prevHistory.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: finalMessages }
            : chat
        )
      )
    } catch (error) {
      console.error('Error regenerating message:', error)
      setIsSearching(false)
      if (shimmerTimeoutRef.current) {
        clearTimeout(shimmerTimeoutRef.current)
        shimmerTimeoutRef.current = null
      }
      setIsThinking(false)
      setThinkingText('')
      thinkingStartRef.current = null
      setThinkingStartTime(null)
      setThinkingDuration(null)
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error while regenerating. Please try again.',
        isUser: false,
        timestamp: new Date(),
        isError: true
      }
      const errorMessages = [...messagesWithoutRegenerated, errorMessage]
      setMessages(errorMessages)
      
      // Update chat history with error message
      setChatHistory(prevHistory => 
        prevHistory.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: errorMessages }
            : chat
        )
      )
    } finally {
      setIsLoading(false)
      if (shimmerTimeoutRef.current) {
        clearTimeout(shimmerTimeoutRef.current)
        shimmerTimeoutRef.current = null
      }
      setIsThinking(false)
      setThinkingText('')
      thinkingStartRef.current = null
      setThinkingStartTime(null)
      setThinkingDuration(null)
    }
  }


  // Handle scroll events
  const handleScroll = (e) => {
    const container = e.target
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100
    setShowScrollToBottom(!isAtBottom)
  }

  // Scroll to bottom function with smooth animation
  const scrollToBottom = () => {
    if (scrollRef) {
      scrollRef.scrollTo({
        top: scrollRef.scrollHeight,
        behavior: 'smooth'
      })
      setShowScrollToBottom(false)
    }
  }

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef && !showScrollToBottom) {
      scrollRef.scrollTop = scrollRef.scrollHeight
    }
  }, [messages, isLoading])
  return (
    <div className={`app-container flex h-screen bg-[#171717] relative overflow-hidden touch-none ${isInitialized ? 'initialized' : ''}`}>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            mobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      {(sidebarVisible || isMobile) && (
        <div className={`${
          isMobile 
            ? `fixed left-0 top-0 h-full w-3/4 z-50 transform transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }` 
            : 'relative'
        }`}>
          <Sidebar 
            isMobile={isMobile}
            onClose={() => setMobileMenuOpen(false)}
            onNewChat={handleNewChat}
            chatHistory={chatHistory}
            onChatSelect={handleChatSelect}
            currentChatId={currentChatId}
            onChatDelete={handleChatDelete}
            onChatRename={handleChatRename}
            newChatCreated={newChatCreated}
            onAnalyticsOpen={() => setShowAnalytics(true)}
          />
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          isMobile={isMobile}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        
        {/* Chat content */}
        <div className="flex-1 bg-[#171717] text-white flex flex-col h-full relative chat-scroll">
          {/* Scrollable content area */}
          <div 
            className="flex-1 overflow-y-auto px-6 overscroll-behavior-none"
            onScroll={handleScroll}
            ref={setScrollRef}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="max-w-3xl mx-auto py-8">
              {messages.length === 0 ? (
                /* Welcome Screen */
                <div className="flex-1 flex flex-col justify-center pb-32">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden">
                      <img src={saintYaredImage} alt="Kidus Yared" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-2xl font-semibold mb-3 text-white">
                      How can I help you today?
                    </h1>
                    <div className="text-base mb-8 text-gray-400">
                      Ask me about Ethiopian Orthodox tradition, liturgy, history, and theology
                    </div>
                    
                    {/* Suggestions - Pills */}
                    <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                      {yaredBotAPI.getSuggestedQuestions().map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-4 py-2 text-sm rounded-full border border-[#2A2A2A] bg-[#1F1F1F] hover:bg-[#2A2A2A] hover:border-gray-500 cursor-pointer transition-all text-gray-300 hover:text-white"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div className="pb-40">
                  {messages.map((message) => {
                    // Prefer duration attached to the message; fall back to best-effort history match
                    const hasMsgDuration = !!message.thinkingDuration
                    const thinkingRecord = (!message.isUser) ? (
                      hasMsgDuration
                        ? { text: 'Thinking', duration: message.thinkingDuration }
                        : thinkingHistory.find(t => t.id === message.id - 1 && !message.isUser)
                    ) : null
                    
                    return (
                      <div key={message.id} style={{ marginBottom: '24px' }}>
                        {/* Static thinking label above this AI message, aligned to bubble's x-axis with avatar */}
                        {thinkingRecord && (
                          <div style={{ position: 'relative', marginBottom: '6px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              position: 'absolute',
                              left: '-44px',
                              top: '0px'
                            }}>
                              <img src={saintYaredImage} alt="Kidus Yared" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <ThinkingIndicator 
                              text={thinkingRecord.text}
                              isStatic={true}
                              duration={thinkingRecord.duration}
                            />
                          </div>
                        )}
                        <ChatMessage
                          message={message}
                          avatar={saintYaredImage}
                          skipAnimation={message.id !== newMessageId}
                          onRegenerate={!message.isUser ? handleRegenerateMessage : undefined}
                        />
                      </div>
                    )
                  })}
                  {isSearching && (
                    <SearchingIndicator isSearching={isSearching} />
                  )}
                  {/* Active thinking row with avatar, aligned with message column */}
                  {isThinking && !isSearching && (
                    <div style={{ position: 'relative', marginTop: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        position: 'absolute',
                        left: '-44px',
                        top: '0px'
                      }}>
                        <img src={saintYaredImage} alt="Kidus Yared" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <ThinkingIndicator text={thinkingText} />
                    </div>
                  )}
                  {/* OLD TYPING BUBBLES - COMMENTED OUT
                  {isLoading && !isThinking && !isSearching && (
                    <ChatMessage isTyping={true} />
                  )}
                  */}
                </div>
              )}
            </div>
          </div>
          
          {/* Scroll to bottom button - dynamically positioned above chat bar */}
          {showScrollToBottom && (
            <button
              onClick={scrollToBottom}
              className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#2A2A2A] hover:bg-[#404040] rounded-full flex items-center justify-center shadow-lg border border-[#404040] transition-all z-10"
              style={{ 
                bottom: '120px' // Position above message input
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M7 10l5 5 5-5"/>
              </svg>
            </button>
          )}
          
        </div>
      </div>
      
      {/* Modern viewport-aware chat input */}
      <div className="input-bar bg-gradient-to-t from-[#171717] via-[#171717] to-transparent z-20">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
          {/* Disclaimer */}
          <p className="text-center text-xs text-gray-500 mt-3 mb-2">
            Kidus Yared AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard 
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />

      {/* Device Detector */}
      <DeviceDetector 
        isVisible={showDeviceDetector}
        onClose={() => setShowDeviceDetector(false)}
      />

      {/* Debug Authorization */}
      <DebugAuth 
        isVisible={showDebugAuth}
        onClose={() => setShowDebugAuth(false)}
      />


      {/* Debug Test Components (only in development with dynamic imports) */}
      <DevTestComponents />
    </div>
  );
}

export default App;
