import { useState, useEffect } from 'react'
import saintYaredImage from '../assets/images/saintyared.png'
import ImprovedRealTimeMarkdown from './ImprovedRealTimeMarkdown'
import ThinkingIndicator from './ThinkingIndicator'
import SourceCard from './SourceCard'
import { debugAPI } from '../utils/apiDebug'
import { processInlineCitations } from '../utils/citationProcessor'

export default function ChatMessage({ message, isTyping = false, skipAnimation = false, onRegenerate, onExpand, onSourcesOpen, thinkingRecord = null }) {
  const [displayText, setDisplayText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'like' or 'dislike'
  const [isMobile, setIsMobile] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const [buttonsVisible, setButtonsVisible] = useState(false)
  const [showSources, setShowSources] = useState(false)
  const [highlightedSourceId, setHighlightedSourceId] = useState(null)

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
    navigator.clipboard.writeText(message?.text || displayText)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  // Handle citation click
  const handleCitationClick = (sourceId) => {
    setShowSources(true)
    setHighlightedSourceId(parseInt(sourceId, 10))
    // Auto-hide highlight after 3 seconds
    setTimeout(() => setHighlightedSourceId(null), 3000)
  }

  // Process text with inline citations
  const processTextWithCitations = (text) => {
    if (!message?.sources || !Array.isArray(message.sources) || message.sources.length === 0) {
      return text;
    }
    
    return processInlineCitations(text, message.sources);
  }

  // Auto-scroll during typing animation
  useEffect(() => {
    if (isAnimating && !message?.isUser) {
      const scrollToBottom = () => {
        // Find the current message element and scroll it into view
        const messageElements = document.querySelectorAll('.message-ai');
        const currentMessage = messageElements[messageElements.length - 1];
        if (currentMessage) {
          currentMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          });
        }
      };

      // Scroll immediately and then periodically during animation
      scrollToBottom();
      const scrollInterval = setInterval(scrollToBottom, 100);

      return () => clearInterval(scrollInterval);
    }
  }, [isAnimating, message?.isUser, displayText]);

  // Typing animation for AI responses
  useEffect(() => {
    if (!message) return
    
    if (message?.isUser) {
      setDisplayText(message?.text || '')
      setIsAnimating(false)
      return
    }
    
    if (isTyping) return
    
    // Skip animation for old chats
    if (skipAnimation) {
      setDisplayText(message?.text || '')
      setIsAnimating(false)
      return
    }
    
    // Start typing animation for new AI messages
    setIsAnimating(true)
    setDisplayText('')
    
    const text = message?.text || ''
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
    if (message && !message?.isUser && !isAnimating && skipAnimation) {
      setButtonsVisible(true)
    }
  }, [message, isAnimating, skipAnimation])

  // Debug sources when message changes
  useEffect(() => {
    if (message && !message?.isUser) {
      console.group(`🎨 SOURCES DEBUG - Message ${message?.id}`);
      console.log('Raw message.sources:', message?.sources);
      console.log('Sources type:', typeof message?.sources);
      console.log('Is array?', Array.isArray(message?.sources));
      console.log('Sources length:', message?.sources?.length || 0);
      console.log('Will show sources section?', !isAnimating && message?.sources && Array.isArray(message.sources) && message.sources.length > 0);
      
      if (message?.sources) {
        message.sources.forEach((source, index) => {
          console.log(`Source ${index}:`, {
            title: source?.title,
            url: source?.url,
            snippet: source?.snippet?.substring(0, 50),
            hasTitle: !!source?.title,
            hasUrl: !!source?.url,
            fullSource: source
          });
        });
      }
      console.groupEnd();
      
      if (process.env.NODE_ENV === 'development') {
        debugAPI.logUIRender(message?.id, message?.sources);
      }
    }
  }, [message, isAnimating])

  // OLD TYPING BUBBLES - COMMENTED OUT FOR LATER USE
  // if (isTyping) {
  //   return (
  //     <div className="message-enter" style={{ 
  //       display: 'flex', 
  //       justifyContent: 'flex-start', 
  //       marginBottom: '24px'
  //     }}>
  //       <div style={{ maxWidth: '100%' }}>
  //         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
  //           <div style={{
  //             width: '32px',
  //             height: '32px',
  //             borderRadius: '50%',
  //             overflow: 'hidden',
  //             flexShrink: 0,
  //             marginTop: '4px'
  //           }}>
  //             <img 
  //               src={saintYaredImage} 
  //               alt="Kidus Yared" 
  //               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  //             />
  //           </div>
  //           <div style={{ flex: 1 }}>
  //             <div style={{
  //               padding: '16px',
  //               borderRadius: '16px',
  //               backgroundColor: '#1f1f1f',
  //               color: '#b4b4b4'
  //             }}>
  //               <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
  //                 <div style={{
  //                   width: '8px',
  //                   height: '8px',
  //                   backgroundColor: 'currentColor',
  //                   borderRadius: '50%',
  //                   animation: 'pulse 1.4s infinite'
  //                 }}></div>
  //                 <div style={{
  //                   width: '8px',
  //                   height: '8px',
  //                   backgroundColor: 'currentColor',
  //                   borderRadius: '50%',
  //                   animation: 'pulse 1.4s infinite 0.2s'
  //                 }}></div>
  //                 <div style={{
  //                   width: '8px',
  //                   height: '8px',
  //                   backgroundColor: 'currentColor',
  //                   borderRadius: '50%',
  //                   animation: 'pulse 1.4s infinite 0.4s'
  //                 }}></div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (message?.isUser) {
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
            <div style={{ whiteSpace: 'pre-wrap', userSelect: 'text', WebkitUserSelect: 'text', cursor: 'text' }}>{displayText}</div>
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
        <div style={{ position: 'relative' }}>
          <div style={{ flex: 1 }}>
            <div style={{
              color: 'white'
            }}>
              <ImprovedRealTimeMarkdown 
                text={displayText}
                isAnimating={isAnimating}
                sources={message?.sources ?? []}
                onCitationClick={handleCitationClick}
              />
            </div>
            
            {/* Expandable Sources Section */}
            {!isAnimating && message?.sources && Array.isArray(message.sources) && message.sources.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                {/* Sources Toggle Button */}
                <button
                  onClick={() => setShowSources(!showSources)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#888',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    width: 'auto',
                    transition: 'all 0.2s ease',
                    opacity: 0,
                    animation: 'slideInLeft 0.8s ease-out 0.8s forwards'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#555';
                    e.target.style.color = '#aaa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#333';
                    e.target.style.color = '#888';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <span>Sources ({message?.sources?.length || 0})</span>
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{
                      transform: showSources ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </button>

                {/* Expandable Sources Cards */}
                {showSources && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    animation: 'slideInDown 0.3s ease-out'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {message?.sources?.map((source, index) => {
                        if (!source || (!source.title && !source.url)) return null;
                        const isHighlighted = highlightedSourceId === (source.id || index + 1);
                        return (
                          <div
                            key={index}
                            style={{
                              padding: isHighlighted ? '12px' : '8px',
                              backgroundColor: isHighlighted ? '#2A2A2A' : '#242424',
                              border: isHighlighted ? '2px solid #4A90E2' : '1px solid #333',
                              borderRadius: '6px',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <SourceCard 
                              source={source} 
                              index={index}
                              isHighlighted={isHighlighted}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Badges + actions - only show for completed AI messages */}
            {!isAnimating && buttonsVisible && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px'
              }}>
                {/* Response type badge */}
                {message?.responseType && (
                  (() => {
                    const rt = message.responseType;
                    const isQuick = rt === 'quick';
                    const isWeb = rt === 'web_search';
                    const label = isQuick ? 'Fast' : (isWeb ? 'Web' : 'Detailed');
                    const bg = isQuick ? '#e0f7ff' : (isWeb ? '#e8f5e9' : '#f2ecff');
                    const fg = isQuick ? '#034' : (isWeb ? '#1b5e20' : '#402080');
                    return (
                      <span style={{
                        backgroundColor: bg,
                        color: fg,
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginRight: '4px'
                      }}>
                        {label}
                      </span>
                    );
                  })()
                )}
                {/* Model badge */}
                {message?.model && (
                  <div style={{
                    padding: '2px 6px',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    fontSize: '10px',
                    color: '#888',
                    fontWeight: '500',
                    opacity: 0,
                    animation: 'slideInLeft 0.8s ease-out 0.0s forwards'
                  }}>
                    {message?.model}
                    {message?.cost && (message.cost > 0) && (
                      <span style={{ color: '#666', marginLeft: '4px' }}>
                        ${message?.cost?.toFixed(4)}
                      </span>
                    )}
                  </div>
                )}
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

                {/* Get Detailed Sources button (for quick responses that can be expanded) */}
                {onExpand && message?.responseType === 'quick' && message?.canExpand && (
                  <button
                    onClick={() => onExpand(message)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#1A4ED8',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: 'white',
                      opacity: 0,
                      animation: 'slideInLeft 0.8s ease-out 0.6s forwards',
                      transition: 'all 0.2s ease'
                    }}
                    title="Get detailed answer with sources"
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1e5ce8';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#1A4ED8';
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    <span>Get Sources</span>
                  </button>
                )}

                {/* Regenerate button */}
                {onRegenerate && (
                  <button
                    onClick={() => onRegenerate(message)}
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      animation: 'slideInLeft 0.8s ease-out 0.7s forwards'
                    }}
                    title="Regenerate response"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" strokeWidth="2">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                      <path d="M21 3v5h-5"/>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                      <path d="M3 21v-5h5"/>
                    </svg>
                  </button>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
