import { useState } from 'react'
import ChatMessage from './ChatMessage'

/**
 * Debug component to test markdown rendering and sources display
 */
export default function DebugTest() {
  const [showTest, setShowTest] = useState(false)

  const testMessage = {
    id: 1,
    text: `# Test Heading

This is a **bold** text with *italic* and [a link](https://example.com).

## Subheading

- List item 1
- List item 2
- List item 3

> This is a blockquote with important information.

\`\`\`javascript
console.log("Code block test");
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

Final paragraph with more content.`,
    isUser: false,
    timestamp: new Date(),
    sources: [
      {
        title: "Test Source 1",
        url: "https://example.com/1",
        favicon: "https://example.com/favicon.ico",
        snippet: "This is a test source"
      },
      {
        title: "Test Source 2", 
        url: "https://eotcmk.org/test",
        favicon: "https://eotcmk.org/favicon.ico",
        snippet: "Another test source"
      }
    ]
  }

  if (!showTest) {
    return (
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
        <button 
          onClick={() => setShowTest(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2A2A2A',
            color: 'white',
            border: '1px solid #404040',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Test Markdown & Sources
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#171717',
        borderRadius: '12px',
        padding: '20px',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid #404040'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', margin: 0 }}>Debug Test</h2>
          <button 
            onClick={() => setShowTest(false)}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: '#888',
              border: '1px solid #404040',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
        
        <ChatMessage 
          message={testMessage}
          skipAnimation={false}
          onSourcesOpen={(sources) => console.log('Sources opened:', sources)}
        />
      </div>
    </div>
  )
}