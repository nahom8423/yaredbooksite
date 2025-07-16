import { useState, useEffect } from 'react'
import newMessageIcon from '../assets/icons/new-message.png'
import sidebarIcon from '../assets/icons/sidebar.png'
import ellipsisIcon from '../assets/icons/ellipsis.png'
import saintYaredImage from '../assets/images/saintyared.png'
import analytics from '../services/analytics'

export default function Sidebar({ isMobile, onClose, onNewChat, chatHistory, onChatSelect, currentChatId, onChatDelete, onChatRename, newChatCreated, onAnalyticsOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isRenaming, setIsRenaming] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [dropdownPosition, setDropdownPosition] = useState('bottom')
  const [animatingChatId, setAnimatingChatId] = useState(null)
  const [canAccessAnalytics, setCanAccessAnalytics] = useState(false)
  
  // Auto-close on mobile when clicking items
  const handleItemClick = (action) => {
    if (action) action()
    if (isMobile && onClose) onClose()
  }

  // Handle ellipsis click
  const handleEllipsisClick = (e, chatId) => {
    e.stopPropagation()
    
    // Calculate position based on element's position in viewport
    const rect = e.currentTarget.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom
    
    // If less than 150px space below, show dropdown above
    setDropdownPosition(spaceBelow < 150 ? 'top' : 'bottom')
    setOpenDropdown(openDropdown === chatId ? null : chatId)
  }

  // Handle rename
  const handleRenameStart = (chatId, currentTitle) => {
    setIsRenaming(chatId)
    setNewTitle(currentTitle)
    setOpenDropdown(null)
  }

  const handleRenameSubmit = (chatId) => {
    const trimmedTitle = newTitle.trim()
    if (trimmedTitle && trimmedTitle.length > 0) {
      onChatRename(chatId, trimmedTitle)
    }
    setIsRenaming(null)
    setNewTitle('')
  }

  const handleRenameCancel = () => {
    setIsRenaming(null)
    setNewTitle('')
  }

  // Handle delete
  const handleDeleteClick = (chatId) => {
    onChatDelete(chatId)
    setOpenDropdown(null)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  // Categorize chats by time
  const categorizeChats = (chats) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const categories = {
      today: [],
      previous7Days: [],
      previous30Days: [],
      older: []
    }

    chats.forEach(chat => {
      const chatDate = new Date(chat.timestamp)
      const chatDateOnly = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())
      
      if (chatDateOnly.getTime() === today.getTime()) {
        categories.today.push(chat)
      } else if (chatDate >= sevenDaysAgo) {
        categories.previous7Days.push(chat)
      } else if (chatDate >= thirtyDaysAgo) {
        categories.previous30Days.push(chat)
      } else {
        categories.older.push(chat)
      }
    })

    return categories
  }

  const categorizedChats = categorizeChats(chatHistory)

  // Watch for new chats to trigger animation
  useEffect(() => {
    if (newChatCreated) {
      setAnimatingChatId(newChatCreated)
      setTimeout(() => setAnimatingChatId(null), 3000) // Clear animation after 3 seconds
    }
  }, [newChatCreated])

  // Check if analytics access is available
  useEffect(() => {
    const checkAnalyticsAccess = async () => {
      try {
        const hasAccess = await analytics.canAccessAnalytics()
        setCanAccessAnalytics(hasAccess)
      } catch (error) {
        setCanAccessAnalytics(false)
      }
    }
    
    checkAnalyticsAccess()
  }, [])

  if (isCollapsed && !isMobile) {
    return (
      <div className="w-12 bg-[#0f0f0f] text-white h-screen flex flex-col items-center py-3 transition-all duration-300 ease-in-out">
        <button 
          onClick={() => setIsCollapsed(false)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#2A2A2A] transition-colors mb-4"
        >
          <img src={sidebarIcon} alt="Expand sidebar" className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className={`${isMobile ? 'w-full' : 'w-64'} bg-[#0f0f0f] text-white h-screen flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Top header with icons - Fixed at top */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        {/* Sidebar Toggle Icon - Left side */}
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#2A2A2A] transition-colors"
          >
            <img src={sidebarIcon} alt="Toggle sidebar" className="w-4 h-4" />
          </button>
        )}
        
        {/* Close button for mobile */}
        {isMobile && (
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#2A2A2A] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        
        {/* New Message Icon - Right side */}
        <button 
          onClick={() => handleItemClick(onNewChat)}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#2A2A2A] transition-colors"
        >
          <img src={newMessageIcon} alt="New message" className="w-4 h-4" />
        </button>
      </div>

      {/* Model Selection - Fixed at top */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#1A1A1A] transition-colors">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img src={saintYaredImage} alt="Kidus Yared" className="w-full h-full object-cover" />
          </div>
          <span className="text-gray-300 font-medium">Kidus Yared</span>
        </div>
      </div>

      {/* Chat History - Scrollable middle section */}
      <div className="flex-1 overflow-y-auto px-3 min-h-0">
        {chatHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No chats yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Today */}
            {categorizedChats.today.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-400 mb-2 px-2">Today</h3>
                <div className="space-y-1">
                  {categorizedChats.today.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isRenaming={isRenaming}
                      newTitle={newTitle}
                      setNewTitle={setNewTitle}
                      currentChatId={currentChatId}
                      openDropdown={openDropdown}
                      dropdownPosition={dropdownPosition}
                      animatingChatId={animatingChatId}
                      onChatSelect={onChatSelect}
                      onClose={onClose}
                      isMobile={isMobile}
                      handleEllipsisClick={handleEllipsisClick}
                      handleRenameSubmit={handleRenameSubmit}
                      handleRenameCancel={handleRenameCancel}
                      handleRenameStart={handleRenameStart}
                      handleDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Previous 7 Days */}
            {categorizedChats.previous7Days.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-400 mb-2 px-2">Previous 7 Days</h3>
                <div className="space-y-1">
                  {categorizedChats.previous7Days.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isRenaming={isRenaming}
                      newTitle={newTitle}
                      setNewTitle={setNewTitle}
                      currentChatId={currentChatId}
                      openDropdown={openDropdown}
                      dropdownPosition={dropdownPosition}
                      animatingChatId={animatingChatId}
                      onChatSelect={onChatSelect}
                      onClose={onClose}
                      isMobile={isMobile}
                      handleEllipsisClick={handleEllipsisClick}
                      handleRenameSubmit={handleRenameSubmit}
                      handleRenameCancel={handleRenameCancel}
                      handleRenameStart={handleRenameStart}
                      handleDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Previous 30 Days */}
            {categorizedChats.previous30Days.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-400 mb-2 px-2">Previous 30 Days</h3>
                <div className="space-y-1">
                  {categorizedChats.previous30Days.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isRenaming={isRenaming}
                      newTitle={newTitle}
                      setNewTitle={setNewTitle}
                      currentChatId={currentChatId}
                      openDropdown={openDropdown}
                      dropdownPosition={dropdownPosition}
                      animatingChatId={animatingChatId}
                      onChatSelect={onChatSelect}
                      onClose={onClose}
                      isMobile={isMobile}
                      handleEllipsisClick={handleEllipsisClick}
                      handleRenameSubmit={handleRenameSubmit}
                      handleRenameCancel={handleRenameCancel}
                      handleRenameStart={handleRenameStart}
                      handleDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older */}
            {categorizedChats.older.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-400 mb-2 px-2">Older</h3>
                <div className="space-y-1">
                  {categorizedChats.older.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isRenaming={isRenaming}
                      newTitle={newTitle}
                      setNewTitle={setNewTitle}
                      currentChatId={currentChatId}
                      openDropdown={openDropdown}
                      dropdownPosition={dropdownPosition}
                      animatingChatId={animatingChatId}
                      onChatSelect={onChatSelect}
                      onClose={onClose}
                      isMobile={isMobile}
                      handleEllipsisClick={handleEllipsisClick}
                      handleRenameSubmit={handleRenameSubmit}
                      handleRenameCancel={handleRenameCancel}
                      handleRenameStart={handleRenameStart}
                      handleDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom fixed section */}
      <div className="flex-shrink-0 border-t border-[#2A2A2A]/30">
        {/* Analytics Button (Only for authorized devices) */}
        {canAccessAnalytics && (
          <div className="px-3 pt-3 pb-2">
            <button 
              onClick={() => {
                onAnalyticsOpen?.()
                analytics.trackButtonClick('analytics_open', isMobile ? 'mobile_sidebar' : 'desktop_sidebar')
                if (isMobile && onClose) onClose()
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#2A2A2A] transition-colors text-left"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10"/>
                  <path d="M18 20V4"/>
                  <path d="M6 20v-6"/>
                </svg>
              </div>
              <span className="text-gray-300 text-sm">Analytics</span>
            </button>
          </div>
        )}

        {/* Bottom Donate Section */}
        <div className="p-3">
          <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-[#2A2A2A] cursor-pointer transition-colors">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span className="text-gray-300 text-sm">Donate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ChatItem Component with animation
function ChatItem({ 
  chat, 
  isRenaming, 
  newTitle, 
  setNewTitle, 
  currentChatId, 
  openDropdown, 
  dropdownPosition,
  animatingChatId,
  onChatSelect,
  onClose,
  isMobile,
  handleEllipsisClick,
  handleRenameSubmit,
  handleRenameCancel,
  handleRenameStart,
  handleDeleteClick
}) {
  const isAnimating = animatingChatId === chat.id

  return (
    <div className="relative group">
      {isRenaming === chat.id ? (
        <div className="px-3 py-2.5 rounded-lg bg-[#2A2A2A]">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit(chat.id)
              if (e.key === 'Escape') handleRenameCancel()
            }}
            onBlur={() => handleRenameSubmit(chat.id)}
            className="w-full bg-transparent text-white text-sm outline-none"
            autoFocus
          />
        </div>
      ) : (
        <button
          onClick={() => {
            onChatSelect(chat)
            if (isMobile && onClose) onClose()
          }}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors relative touch-manipulation ${
            currentChatId === chat.id 
              ? 'bg-[#2A2A2A] text-white' 
              : 'hover:bg-[#1A1A1A] text-gray-300'
          }`}
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        >
          <div className={`truncate text-sm pr-8 ${isAnimating ? 'animate-slide-in-words' : ''}`}>
            {isAnimating ? (
              <AnimatedText text={chat.title} />
            ) : (
              chat.title
            )}
          </div>
          
          {/* Ellipsis Button */}
          <button
            onClick={(e) => handleEllipsisClick(e, chat.id)}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-md hover:bg-[#404040] flex items-center justify-center transition-opacity ${
              isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </button>
      )}
      
      {/* Dropdown Menu */}
      {openDropdown === chat.id && (
        <div className={`absolute right-0 w-40 bg-[#2A2A2A] border border-[#404040] rounded-lg shadow-lg z-50 ${
          dropdownPosition === 'top' ? 'bottom-0 mb-2' : 'top-0 mt-2'
        }`}>
          <div className="py-1">
            <button
              onClick={() => handleRenameStart(chat.id, chat.title)}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#404040] flex items-center gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
              Rename
            </button>
            <button
              onClick={() => handleDeleteClick(chat.id)}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#404040] flex items-center gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Animated Text Component
function AnimatedText({ text }) {
  const [visibleChars, setVisibleChars] = useState(0)
  
  useEffect(() => {
    const words = text.split(' ')
    let currentWord = 0
    let currentChar = 0
    
    const timer = setInterval(() => {
      if (currentWord < words.length) {
        const word = words[currentWord]
        if (currentChar < word.length) {
          currentChar++
          // Calculate total characters up to current position
          let totalChars = 0
          for (let i = 0; i < currentWord; i++) {
            totalChars += words[i].length + 1 // +1 for space
          }
          totalChars += currentChar
          setVisibleChars(totalChars)
        } else {
          currentWord++
          currentChar = 0
          // Add space after word
          let totalChars = 0
          for (let i = 0; i <= currentWord - 1; i++) {
            totalChars += words[i].length + 1
          }
          setVisibleChars(totalChars)
        }
      } else {
        clearInterval(timer)
      }
    }, 80) // Slower for word-by-word effect
    
    return () => clearInterval(timer)
  }, [text])
  
  return (
    <span>
      {text.slice(0, visibleChars)}
      <span className="animate-pulse">|</span>
    </span>
  )
}