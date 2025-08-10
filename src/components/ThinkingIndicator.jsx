import { useState, useEffect } from 'react'

export default function ThinkingIndicator({ text = "Thinking", isStatic = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const thinkingDetails = [
    "The user is asking for code to create an animation, like ChatGPT's \"thinking\" indicator. They want a UI design that mimics ChatGPT's thought process animation but aren't requesting detailed chain-of-thought content. I can suggest using common indicators like the typing animation, skeleton loaders, or \"thinking\" bubbles with animated dots to convey processing states.",
    "",
    "For the user's request, they want a sleek, modern animation for a \"thinking\" indicator. I'll provide HTML/CSS/JS code with no comments (per their request) showing effects like pulsing dots, shimmer skeleton loading, and token streaming. The code will avoid verbosity, include accessibility attributes (like ARIA), and offer neat transitions into the final answer. I'll skip unnecessary tools like web.run.",
    "",
    "The user needs a frontend animation with exceptional attention to detail. I'll provide a \"Thought panel UI\" with \"Thinking...\" text, shimmering skeleton lines, and a \"Why this answer\" section that avoids sensitive chain-of-thought content. I'll give two blocks for the animation: one minimal with typing dots and another enhanced with skeleton loading and token streaming. I'll provide HTML, CSS, and JS without comments or excessive explanation, while ensuring integration with a backend simulation.",
    "",
    "I'll provide the user with a polished HTML snippet that contains everything in one file — HTML, CSS, and JavaScript. This will include a chat container, user and assistant messages, a \"thinking\" indicator, and token streaming. The \"thinking\" badge will stay visible until the answer completes, and I'll add a button for toggling a reasoning summary. Code will be free of comments and will support dark mode with system fonts and CSS variables, keeping it simple and clean."
  ]

  // Left-to-right lighting animation at 360fps smoothness
  useEffect(() => {
    if (isStatic) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % text.length)
    }, 120) // Much faster for 360fps smoothness

    return () => clearInterval(interval)
  }, [isStatic, text])

  return (
    <div style={{ marginBottom: '16px', fontSize: '14px' }}>
      {/* Thinking header - clickable like ChatGPT */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '13px',
          fontWeight: '400',
          fontFamily: 'inherit', // Use same font as chat text
          padding: '4px 0',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex' }}>
          {text.split('').map((letter, index) => {
            let opacity = 0.5 // Base muted opacity
            let brightness = '#8e8e93'
            let glow = 'none'
            
            if (!isStatic) {
              const distance = Math.abs(index - currentIndex)
              if (distance === 0) {
                // Current letter - brightest
                opacity = 1
                brightness = '#ffffff'
                glow = '0 0 12px rgba(255, 255, 255, 0.8)'
              } else if (distance === 1) {
                // Adjacent letters - medium bright
                opacity = 0.85
                brightness = '#d1d5db'
                glow = '0 0 6px rgba(255, 255, 255, 0.4)'
              } else if (distance === 2) {
                // Two letters away - slightly bright
                opacity = 0.7
                brightness = '#9ca3af'
                glow = '0 0 3px rgba(255, 255, 255, 0.2)'
              }
            }
            
            return (
              <span
                key={index}
                style={{
                  color: brightness,
                  opacity: opacity,
                  transition: 'all 0.08s ease', // Ultra smooth transitions
                  textShadow: glow
                }}
              >
                {letter}
              </span>
            )
          })}
        </div>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{
            color: '#8e8e93',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.6
          }}
        >
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </div>

      {/* Expanded thinking content */}
      {isExpanded && (
        <div style={{
          marginTop: '8px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e3e3e3',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#1a1a1a',
          animation: 'slideDown 0.2s ease-out'
        }}>
          {thinkingDetails.map((line, index) => (
            <div key={index} style={{ 
              marginBottom: line === '' ? '8px' : '0',
              minHeight: line === '' ? '8px' : 'auto'
            }}>
              {line}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}