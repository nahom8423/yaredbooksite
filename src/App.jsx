import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ThinkingIndicator from './components/ThinkingIndicator';
import saintYaredImage from './assets/images/saintyared.png';
import { yaredBotAPI } from './services/yaredBotAPI';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
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
  const [safeAreaBottom, setSafeAreaBottom] = useState(0)

  // Detect safe area for mobile bottom spacing
  useEffect(() => {
    const updateSafeArea = () => {
      // Get CSS env() value for safe area bottom
      const safeAreaBottomValue = getComputedStyle(document.documentElement)
        .getPropertyValue('env(safe-area-inset-bottom)') || '0px'
      const pixels = parseInt(safeAreaBottomValue) || 0
      setSafeAreaBottom(pixels)
    }

    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)
    window.addEventListener('orientationchange', updateSafeArea)
    
    return () => {
      window.removeEventListener('resize', updateSafeArea)
      window.removeEventListener('orientationchange', updateSafeArea)
    }
  }, [])

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
      setIsMobile(isMobileDevice)
      if (isMobileDevice) {
        setSidebarVisible(false)
        setMobileMenuOpen(false)
      } else {
        setSidebarVisible(true)
        setMobileMenuOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  // Handle sending messages to Yared Bot
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return

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
    
    // Determine if this requires searching through texts
    const needsTextSearch = (text) => {
      const searchKeywords = [
        'saint yared', 'liturgy', 'church', 'orthodox', 'tradition', 'history',
        'calendar', 'fasting', 'feast', 'prayer', 'scripture', 'theology',
        'monastery', 'priest', 'deacon', 'communion', 'baptism', 'chrismation',
        'ge\'ez', 'amharic', 'ethiopia', 'tewahedo', 'coptic', 'bible'
      ]
      const lowerText = text.toLowerCase()
      return searchKeywords.some(keyword => lowerText.includes(keyword)) || text.length > 50
    }

    const requiresSearch = needsTextSearch(messageText)
    
    if (requiresSearch) {
      // Add delay before thinking starts for more realistic timing
      setTimeout(() => {
        setIsThinking(true)
        setThinkingText('Looking through Ethiopian Orthodox texts...')

        // Simulate thinking process
        setTimeout(() => {
          setThinkingText('Analyzing liturgical knowledge...')
        }, 1000)

        setTimeout(() => {
          setThinkingText('Preparing response...')
        }, 2000)
      }, 600) // Initial delay before thinking starts
    }

    try {
      // Log current session status for debugging
      console.log('Sending message:', {
        chatId,
        message: messageText,
        existingSessionId: yaredBotAPI.getSessionId(chatId)
      });
      
      // Get AI response with session tracking
      const { response: aiResponse, sessionId } = await yaredBotAPI.sendMessage(messageText, chatId)
      
      // Save thinking indicator to history only if it was used
      if (requiresSearch && isThinking) {
        const thinkingRecord = {
          id: Date.now() - 1, // ID before the AI message
          text: 'Looking through Ethiopian Orthodox texts...',
          timestamp: new Date()
        }
        setThinkingHistory(prev => [...prev, thinkingRecord])
      }
      
      setIsThinking(false)
      
      // Add AI message with session ID tracking
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        sessionId: sessionId // Store session ID with message for debugging
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
      setIsThinking(false)
      setThinkingText('')
    }
  }

  // Handle new chat
  const handleNewChat = () => {
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
    
    // Ensure we have valid messages
    const chatMessages = Array.isArray(chat.messages) ? chat.messages : []
    setMessages(chatMessages)
    setCurrentChatId(chat.id)
    setNewMessageId(null) // Clear new message ID when loading old chat
    setIsLoading(false) // Ensure loading state is cleared
    
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
    handleSendMessage(suggestion)
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
    <div className="flex bg-[#171717] h-screen relative overflow-hidden touch-none">
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
          />
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <ChatHeader 
          isMobile={isMobile}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
        
        {/* Chat content */}
        <div className="flex-1 bg-[#171717] text-white flex flex-col h-full relative">
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
                <div className="flex-1 flex flex-col justify-center">
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
                    <div className="w-full max-w-2xl mx-auto">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {yaredBotAPI.getSuggestedQuestions().map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 text-sm rounded-full border border-[#2A2A2A] bg-[#1F1F1F] hover:bg-[#2A2A2A] hover:border-gray-500 cursor-pointer transition-all text-gray-300 hover:text-white whitespace-nowrap flex-shrink-0"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div className="pb-32">
                  {messages.map((message) => {
                    // Find thinking record that corresponds to this AI message
                    const thinkingRecord = thinkingHistory.find(
                      t => t.id === message.id - 1 && !message.isUser
                    )
                    
                    return (
                      <div key={message.id} style={{ marginBottom: '24px' }}>
                        {thinkingRecord && !message.isUser && (
                          <div style={{ marginBottom: '8px' }}>
                            <ThinkingIndicator 
                              text={thinkingRecord.text} 
                              isStatic={true}
                            />
                          </div>
                        )}
                        <ChatMessage
                          message={message}
                          avatar={saintYaredImage}
                          skipAnimation={message.id !== newMessageId}
                        />
                      </div>
                    )
                  })}
                  {isThinking && (
                    <ThinkingIndicator text={thinkingText} />
                  )}
                  {isLoading && !isThinking && (
                    <ChatMessage isTyping={true} />
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Scroll to bottom button - positioned above chat bar with gap */}
          {showScrollToBottom && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#2A2A2A] hover:bg-[#404040] rounded-full flex items-center justify-center shadow-lg border border-[#404040] transition-all z-10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M7 10l5 5 5-5"/>
              </svg>
            </button>
          )}
          
          {/* Sticky chat input */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#171717] via-[#171717] to-transparent"
            style={{ paddingBottom: `${Math.max(32, safeAreaBottom + 16)}px` }}
          >
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
        </div>
      </div>
    </div>
  );
}

export default App;