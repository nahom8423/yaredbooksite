import { useState } from 'react'
import saintYaredImage from '../assets/images/saintyared.png'

export default function ThinkingIndicator({ text, isStatic = false }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const searchSteps = [
    "Searching Ethiopian Orthodox Church texts",
    "Analyzing liturgical knowledge base",
    "Cross-referencing Ge'ez manuscripts",
    "Consulting Saint Yared's musical traditions",
    "Reviewing theological commentaries"
  ]

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
            marginTop: '8px'
          }}>
            <img 
              src={saintYaredImage} 
              alt="Kidus Yared" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            {/* Thinking indicator - minimalistic */}
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                color: '#a8a29e',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: isExpanded ? '8px' : '0',
                marginTop: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#a8a29e',
                  animation: isStatic ? 'none' : 'pulse 1.5s infinite'
                }}></div>
                <span>{text}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ 
                    marginLeft: 'auto',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    opacity: 0.6
                  }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>

            {/* Expanded search details */}
            {isExpanded && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#9ca3af',
                fontSize: '13px',
                animation: 'slideDown 0.3s ease-out'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '8px', color: '#d1d5db' }}>
                  Search Process:
                </div>
                {searchSteps.map((step, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                    opacity: index < 3 ? 1 : 0.6
                  }}>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: index < 3 ? '#4ade80' : '#6b7280'
                    }}></div>
                    <span>{step}</span>
                    {index < 3 && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
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