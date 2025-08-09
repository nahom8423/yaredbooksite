import { useState } from 'react'
import SearchingIndicator from './SearchingIndicator'

// Add fade animation style
const fadeInStyle = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

// Inject styles if they don't exist
if (!document.querySelector('#fade-animation-styles')) {
  const style = document.createElement('style')
  style.id = 'fade-animation-styles'
  style.textContent = fadeInStyle
  document.head.appendChild(style)
}

/**
 * Test component for the liquid glass searching animation
 * Use this to preview the animation without API calls
 */
export default function SearchingTest() {
  const [isSearching, setIsSearching] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      padding: isMinimized ? '8px 12px' : '20px',
      borderRadius: '8px',
      border: '1px solid #333',
      zIndex: 1000,
      minWidth: isMinimized ? 'auto' : '250px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMinimized ? '0' : '16px'
      }}>
        <h3 style={{ 
          color: 'white', 
          margin: '0', 
          fontSize: '14px',
          fontWeight: '600'
        }}>
          🧪 {isMinimized ? '' : 'Animation Tester'}
        </h3>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '2px 4px',
            borderRadius: '4px'
          }}
          title={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? '▢' : '−'}
        </button>
      </div>
      
      {!isMinimized && (
        <div style={{ animation: isMinimized ? 'none' : 'fadeIn 0.3s ease' }}>
      
      
      <button
        onClick={() => setIsSearching(!isSearching)}
        style={{
          background: isSearching ? '#dc2626' : '#2563eb',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          marginBottom: '16px',
          width: '100%'
        }}
      >
        {isSearching ? 'Stop Animation' : 'Start Animation'}
      </button>

      {/* Preview Area */}
      <div style={{
        background: '#111',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #333',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <SearchingIndicator isSearching={isSearching} />
        {!isSearching && (
          <span style={{ color: '#666', fontSize: '12px' }}>
            Click "Start Animation" to preview
          </span>
        )}
      </div>

      <p style={{ 
        color: '#888', 
        fontSize: '11px', 
        margin: '12px 0 0 0',
        lineHeight: '1.4'
      }}>
        This tester lets you preview the liquid glass animation without using API credits.
      </p>
        </div>
      )}
    </div>
  )
}