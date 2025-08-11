import { useState, useRef, useEffect } from 'react'
import attachIcon from '../assets/icons/attach.png'
import sendIcon from '../assets/icons/send.png'

export default function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef(null)
  const hasText = message.trim().length > 0

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [message])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (hasText && !isLoading && onSendMessage) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div className="chat-input-surface w-full bg-[#2d2d2d] rounded-3xl min-h-[44px] px-2 py-1 flex items-end gap-2 focus-within:bg-[#272727] transition-colors">
      <button 
        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 relative group flex-shrink-0 mb-1"
        title="Attach file"
      >
        <img src={attachIcon} alt="" className="w-4 h-4" />
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Unavailable
        </div>
      </button>
      
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message ቅዱስ ያሬድ AI"
        disabled={isLoading}
        rows="1"
        className="flex-1 bg-transparent text-white placeholder-[#9f9f9f] outline-none disabled:opacity-50 text-base resize-none py-2 max-h-[120px] overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      />
      
      <button 
        onClick={handleSubmit}
        disabled={!hasText}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 mb-1 ${
          hasText
            ? 'bg-[#D4AF37] hover:bg-[#B8941F] cursor-pointer' 
            : 'hover:rotate-45 cursor-pointer'
        }`}
      >
        <img 
          src={sendIcon} 
          alt="" 
          className={`w-4 h-4 transition-all duration-200 ${
            hasText ? 'filter brightness-0' : ''
          }`} 
        />
      </button>
    </div>
  )
}
