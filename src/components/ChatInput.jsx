import { useState } from 'react'
import attachIcon from '../assets/icons/attach.png'
import sendIcon from '../assets/icons/send.png'

export default function ChatInput({ onSendMessage, isLoading, saintYaredMode }) {
  const [message, setMessage] = useState('')
  const hasText = message.trim().length > 0

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

  return (
    <div className={`w-full rounded-full h-11 px-2 flex items-center gap-2 transition-colors ${saintYaredMode ? 'bg-[rgba(52,32,22,0.9)] focus-within:bg-[rgba(61,37,26,0.95)] backdrop-blur-sm border border-[rgba(61,37,26,0.4)]' : 'bg-[#342016] focus-within:bg-[#3D251A]'}`}>
      <button 
        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 relative group"
        title="Attach file"
      >
        <img src={attachIcon} alt="" className="w-4 h-4" />
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Unavailable
        </div>
      </button>
      
      <input 
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message Kidus Yared AI"
        disabled={isLoading}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className="flex-1 bg-transparent text-white placeholder-[#9f9f9f] outline-none disabled:opacity-50 text-base"
      />
      
      <button 
        onClick={handleSubmit}
        disabled={!hasText}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
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