import { useState, useEffect } from 'react'
import { debugAPI } from '../utils/apiDebug'
import ChatMessage from './ChatMessage'

/**
 * Debug component for testing markdown formatting and sources display
 * Only visible in development mode
 */
export default function DebugTestComponent() {
  const [testMessage, setTestMessage] = useState(null)
  const [showDebug, setShowDebug] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const createTestMessage = () => {
    const mockMessage = {
      id: Date.now(),
      text: `## 🕊️ What Is Tekle Aquaquam?

- **Definition**: Tekle Aquaquam is a distinctive style of Ethiopian Orthodox liturgical chant and movement tradition
- **Purpose**: Spiritual chant performed with sistra and prayer sticks
- **Significance**: Emerged in the 19th century, created by Aleqa Gebre Hanna

---

## 🎶 How It Fits in Ethiopian Liturgical Practice

| **Feature** | **Description** |
|-------------|-----------------|
| **Occasion** | Major feasts and liturgical celebrations |
| **Instruments** | Sistra (tsinatseil) and prayer sticks |
| **Movement** | Choreographed aquaquam movements |

---

## 📜 Historical Context

**Origins**: Created by **Aleqa Gebre Hanna** and **Tse'adha Gebre Meskel** in the 19th century

**Development**: Inspired by bamboo trees along Lake Tana

**Key Figures**: 
- **Saint Yared** (6th century) - Foundation of Zema tradition
- **Aleqa Gebre Hanna** - Founder of Tekle Aquaquam

---

## ✅ Bottom Line

Tekle Aquaquam represents the synthesis of ancient liturgical tradition with innovative artistic expression within the Ethiopian Orthodox Tewahedo Church.`,
      isUser: false,
      timestamp: new Date(),
      sources: debugAPI.getMockSources()
    }
    
    setTestMessage(mockMessage)
    console.log('🧪 Created test message with sources:', mockMessage.sources)
  }

  const testWithoutSources = () => {
    const mockMessage = {
      id: Date.now(),
      text: `## 🔍 Test Message Without Sources

This is a test message to verify that the UI handles messages without sources correctly.

**No sources should be displayed** for this message.`,
      isUser: false,
      timestamp: new Date(),
      sources: []
    }
    
    setTestMessage(mockMessage)
    console.log('🧪 Created test message without sources')
  }

  const testEmptyMessage = () => {
    const mockMessage = {
      id: Date.now(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      sources: null
    }
    
    setTestMessage(mockMessage)
    console.log('🧪 Created empty test message')
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: '#1A1A1A',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: isMinimized ? '8px 12px' : '12px',
      maxWidth: isMinimized ? 'auto' : '300px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMinimized ? '0' : '8px'
      }}>
        <div style={{ color: 'white', fontSize: '14px' }}>
          🧪 {isMinimized ? '' : 'Debug Test Panel'}
        </div>
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
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => setShowDebug(!showDebug)}
          style={{
            padding: '6px 12px',
            backgroundColor: showDebug ? '#333' : '#2A2A2A',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
        
        <button
          onClick={createTestMessage}
          style={{
            padding: '6px 12px',
            backgroundColor: '#2A2A2A',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Test Markdown & Sources
        </button>
        
        <button
          onClick={testWithoutSources}
          style={{
            padding: '6px 12px',
            backgroundColor: '#2A2A2A',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Test Without Sources
        </button>
        
        <button
          onClick={testEmptyMessage}
          style={{
            padding: '6px 12px',
            backgroundColor: '#2A2A2A',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Test Empty Message
        </button>
      </div>

      {showDebug && (
        <div style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#0A0A0A',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#888',
          fontFamily: 'monospace'
        }}>
          <div>API URL: {import.meta.env.VITE_API_URL || 'localhost:8080'}</div>
          <div>Sources Debug: Active</div>
          <div>Markdown Render: 50ms intervals</div>
          <div>Console: Check for sources logs</div>
        </div>
      )}

      {testMessage && (
        <div style={{
          marginTop: '12px',
          maxHeight: '300px',
          overflow: 'auto',
          backgroundColor: '#171717',
          padding: '8px',
          borderRadius: '4px'
        }}>
          <ChatMessage
            message={testMessage}
            skipAnimation={false}
            onSourcesOpen={(sources) => {
              console.log('🎯 Sources button clicked:', sources)
              alert(`Sources panel would open with ${sources.length} sources`)
            }}
          />
        </div>
      )}
        </div>
      )}
    </div>
  )
}