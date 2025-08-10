import { useState, useEffect } from 'react'

export default function ThinkingIndicator({ text = "Thinking", isStatic = false, thinkingProcess = null, duration = null }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Default thinking process if none provided
  const defaultThinkingProcess = [
    "Analyzing the question about Saint Yared and liturgical music...",
    "",
    "Searching through Ethiopian Orthodox Church historical records and manuscripts about Saint Yared's contributions to church music and liturgy.",
    "",
    "Cross-referencing information about the development of Ge'ez liturgical chanting, the three modes of church music (Ge'ez, Ezel, and Araray), and Saint Yared's role in systematizing Ethiopian Orthodox musical traditions.",
    "",
    "Reviewing sources on Saint Yared's legendary status as the father of Ethiopian church music, his divine inspiration, and the lasting impact of his musical innovations on Ethiopian Orthodox worship practices."
  ]

  const displayText = duration ? `Thought for ${duration}` : text
  const processToShow = thinkingProcess || defaultThinkingProcess

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Thinking header with pure CSS shimmer effect - clickable text only */}
      <span 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          fontSize: '16px', // Same size as chat text
          fontWeight: '400',
          fontFamily: 'inherit',
          background: (isStatic || duration) 
            ? 'transparent'
            : 'linear-gradient(90deg, #8e8e93 0%, #8e8e93 30%, #ffffff 50%, #8e8e93 70%, #8e8e93 100%)',
          backgroundSize: '400% 100%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: (isStatic || duration) ? '#8e8e93' : 'transparent',
          color: (isStatic || duration) ? '#8e8e93' : 'transparent',
          animation: (isStatic || duration) ? 'none' : 'shimmerMove 3s ease-in-out infinite'
        }}
      >
        {displayText}
      </span>

      {/* Expanded thinking process */}
      {isExpanded && (
        <div style={{
          marginTop: '8px',
          padding: '12px',
          backgroundColor: '#2A2A2A',
          borderRadius: '8px',
          border: '1px solid #404040',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#e0e0e0',
          animation: 'slideDown 0.2s ease-out'
        }}>
          {processToShow.map((line, index) => (
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
        
        @keyframes shimmerMove {
          0% {
            background-position: -100% 0;
          }
          50% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
      `}</style>
    </div>
  )
}