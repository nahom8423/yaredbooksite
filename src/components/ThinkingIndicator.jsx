import { useState, useEffect } from 'react'
import saintYaredImage from '../assets/images/saintyared.png'

export default function ThinkingIndicator({ text = "thinking", isStatic = false }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentLetter, setCurrentLetter] = useState(0)

  const searchSteps = [
    "Searching Ethiopian Orthodox Church texts",
    "Analyzing liturgical knowledge base",
    "Cross-referencing Ge'ez manuscripts",
    "Consulting Saint Yared's musical traditions",
    "Reviewing theological commentaries"
  ]

  // Letter-by-letter lighting animation
  useEffect(() => {
    if (isStatic) return
    
    const interval = setInterval(() => {
      setCurrentLetter((prev) => (prev + 1) % text.length)
    }, 300)
    
    return () => clearInterval(interval)
  }, [text, isStatic])

  // CSS-in-JS styles for liquid glass effect
  const liquidGlassStyles = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    @keyframes glow {
      0%, 100% { 
        text-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3), 0 0 15px rgba(59, 130, 246, 0.2);
        filter: brightness(1);
      }
      50% { 
        text-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
        filter: brightness(1.2);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .liquid-glass-text {
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1),
        rgba(255, 255, 255, 0.3),
        rgba(59, 130, 246, 0.2),
        rgba(139, 92, 246, 0.2),
        rgba(255, 255, 255, 0.1)
      );
      background-size: 200% 200%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 2s linear infinite;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  `

  // Inject styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = liquidGlassStyles
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-start'
    }}>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            marginTop: '8px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <img 
              src={saintYaredImage} 
              alt="Kidus Yared" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            {/* Liquid glass thinking indicator */}
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: isExpanded ? '8px' : '0',
                marginTop: '12px',
                padding: '8px 12px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                display: 'inline-block'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Letter-by-letter animated text */}
                <div style={{ display: 'flex', gap: '1px' }}>
                  {text.split('').map((letter, index) => (
                    <span
                      key={index}
                      className={currentLetter === index && !isStatic ? 'liquid-glass-text' : ''}
                      style={{
                        color: currentLetter === index && !isStatic 
                          ? 'transparent' 
                          : '#e5e7eb',
                        transition: 'all 0.3s ease',
                        fontWeight: currentLetter === index && !isStatic ? '600' : '500',
                        animation: currentLetter === index && !isStatic ? 'glow 0.6s ease-in-out' : 'none',
                        transform: currentLetter === index && !isStatic ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </div>
                
                {/* Expandable arrow with glass effect */}
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ 
                    marginLeft: '4px',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    opacity: 0.7,
                    color: '#e5e7eb',
                    filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.3))'
                  }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>

            {/* Expanded search details with glass morphism */}
            {isExpanded && (
              <div style={{
                padding: '16px 20px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#9ca3af',
                fontSize: '13px',
                animation: 'slideDown 0.3s ease-out',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ 
                  fontWeight: '600', 
                  marginBottom: '12px', 
                  color: '#e5e7eb',
                  fontSize: '14px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  🔍 Search Process:
                </div>
                {searchSteps.map((step, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '6px',
                    opacity: index < 3 ? 1 : 0.6,
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: index < 3 ? '#10b981' : '#6b7280',
                      boxShadow: index < 3 ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
                      animation: index < 3 ? 'pulse 2s infinite' : 'none'
                    }}></div>
                    <span style={{ flex: 1 }}>{step}</span>
                    {index < 3 && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}