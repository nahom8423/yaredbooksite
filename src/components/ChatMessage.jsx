import { useState, useEffect } from 'react'
import saintYaredImage from '../assets/images/saintyared.png'

export default function ChatMessage({ message, isTyping = false, skipAnimation = false }) {
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'like' or 'dislike'
  const [isMobile, setIsMobile] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [buttonsVisible, setButtonsVisible] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle feedback (like/dislike)
  const handleFeedback = (type) => {
    setFeedback(feedback === type ? null : type)
  }

  // Handle copy message
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text || displayText)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  // Typing animation for AI responses
  useEffect(() => {
    if (!message) return
    
    if (message.isUser) {
      setDisplayText(message.text || '')
      setIsAnimating(false)
      return
    }
    
    if (isTyping) return
    
    // Skip animation for old chats
    if (skipAnimation) {
      setDisplayText(message.text || '')
      setIsAnimating(false)
      return
    }
    
    // Start typing animation for new AI messages
    setIsAnimating(true)
    setDisplayText('')
    
    const text = message.text || ''
    if (!text) {
      setIsAnimating(false)
      return
    }
    
    let startTime = Date.now()
    let animationId = null
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const targetIndex = Math.floor(elapsed / 3) // 3ms per character for even faster typing
      
      if (targetIndex < text.length) {
        setDisplayText(text.slice(0, targetIndex + 1))
        animationId = requestAnimationFrame(animate)
      } else {
        setDisplayText(text)
        setIsAnimating(false)
        // Show buttons after animation completes
        setTimeout(() => setButtonsVisible(true), 200)
      }
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [message, isTyping, skipAnimation])

  // For non-animated messages, show buttons immediately
  useEffect(() => {
    if (message && !message.isUser && !isAnimating && skipAnimation) {
      setButtonsVisible(true)
    }
  }, [message, isAnimating, skipAnimation])

  if (isTyping) {
    return (
      <div className="message-enter" style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        marginBottom: '24px'
      }}>
        <div style={{ maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              marginTop: '4px'
            }}>
              <img 
                src={saintYaredImage} 
                alt="Kidus Yared" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: '#1f1f1f',
                color: '#b4b4b4'
              }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'currentColor',
                    borderRadius: '50%',
                    animation: 'pulse 1.4s infinite'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'currentColor',
                    borderRadius: '50%',
                    animation: 'pulse 1.4s infinite 0.2s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'currentColor',
                    borderRadius: '50%',
                    animation: 'pulse 1.4s infinite 0.4s'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.isUser) {
    return (
      <div className="message-user" style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '24px'
      }}>
        <div style={{ maxWidth: '70%' }}>
          <div style={{
            padding: '12px 20px',
            borderRadius: '24px',
            backgroundColor: '#2f2f2f',
            color: 'white'
          }}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{displayText}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="message-ai group" 
      style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        marginBottom: '24px'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            marginTop: '8px'
          }}>
            <img 
              src={saintYaredImage} 
              alt="Kidus Yared" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              color: 'white'
            }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{displayText}{isAnimating && <span className="animate-pulse">|</span>}</div>
            </div>
            
            {/* Action buttons - only show for completed AI messages */}
            {!isAnimating && buttonsVisible && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px'
              }}>
                {/* Like button */}
                <button
                  onClick={() => handleFeedback('like')}
                  style={{
                    padding: '4px',
                    backgroundColor: feedback === 'like' ? '#2A2A2A' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    animation: 'slideInLeft 0.8s ease-out 0.1s forwards'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={feedback === 'like' ? '#4CAF50' : '#8e8e8e'} strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                </button>

                {/* Dislike button */}
                <button
                  onClick={() => handleFeedback('dislike')}
                  style={{
                    padding: '4px',
                    backgroundColor: feedback === 'dislike' ? '#2A2A2A' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    animation: 'slideInLeft 0.8s ease-out 0.3s forwards'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={feedback === 'dislike' ? '#f44336' : '#8e8e8e'} strokeWidth="2" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                </button>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '4px',
                    backgroundColor: showCopied ? '#2A2A2A' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    opacity: 0,
                    animation: 'slideInLeft 0.8s ease-out 0.5s forwards'
                  }}
                >
                  {showCopied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}