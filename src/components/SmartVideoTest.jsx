import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import MarkdownVideo from './MarkdownVideo'

export default function SmartVideoTest() {
  const testContent = `# 🎥 Smart YouTube Embed Test

This demonstrates the new ReactPlayer integration with intelligent fallback handling:

## Test Video 1: Embedding Disabled (Will Show Fallback)

**🎥 Video Source: ወረብ ዘዮሐንስ ክፍል 2**
This video has embedding disabled by the owner, so you'll see a clean "Watch on YouTube" button instead of the ugly error box.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/1vA2iBbRLzA" frameborder="0" allowfullscreen title="ወረብ ዘዮሐንስ ክፍል 2"></iframe>

## Test Video 2: Different Video (May Embed)

<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen title="Different Video"></iframe>

## ✨ What You Should See:

- **If embeddable**: A proper YouTube player that plays directly in your app
- **If blocked**: A polished red "Watch on YouTube" button with play icon
- **No more**: Ugly gray "Video unavailable" error boxes

## 🔧 How It Works:

ReactPlayer tries to embed the video. If the owner has disabled embedding, it gracefully falls back to a styled link button that opens YouTube in a new tab.`

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">🎥 Smart Video Fallback System</h1>
        <p className="text-gray-300 mb-6">
          Testing ReactPlayer integration with graceful fallback for blocked YouTube embeds:
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]}
          components={{
            // Style all elements to inherit white text color
            h1: ({node, ...props}) => <h1 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '1.5rem'}} {...props} />,
            h2: ({node, ...props}) => <h2 style={{color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', marginTop: '1.25rem'}} {...props} />,
            h3: ({node, ...props}) => <h3 style={{color: 'white', fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem'}} {...props} />,
            p: ({node, ...props}) => <p style={{color: 'white', marginBottom: '0.75rem', lineHeight: '1.6'}} {...props} />,
            strong: ({node, ...props}) => <strong style={{color: 'white', fontWeight: '600'}} {...props} />,
            a: ({node, ...props}) => <a style={{color: '#60a5fa', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer" {...props} />,
            ul: ({node, ...props}) => <ul style={{marginBottom: '0.75rem', paddingLeft: '1rem'}} {...props} />,
            li: ({node, ...props}) => <li style={{color: 'white', marginBottom: '0.25rem'}} {...props} />,
            // Smart YouTube embed handling with fallback
            iframe: ({node, ...props}) => {
              const src = props.src || ''
              if (src.includes('youtube.com/embed/') || src.includes('youtu.be/')) {
                return <MarkdownVideo src={src} />
              }
              return <iframe style={{borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '1rem', marginTop: '1rem'}} {...props} />
            }
          }}
          style={{
            color: 'white',
            lineHeight: '1.6'
          }}
        >
          {testContent}
        </ReactMarkdown>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-red-300 font-semibold mb-2">❌ Before (Raw iframe):</h3>
          <ul className="text-red-200 space-y-1 text-sm">
            <li>• Ugly "Video unavailable" gray boxes</li>
            <li>• Poor user experience</li>
            <li>• No fallback option</li>
            <li>• Broken-looking interface</li>
          </ul>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h3 className="text-green-300 font-semibold mb-2">✅ After (ReactPlayer + Fallback):</h3>
          <ul className="text-green-200 space-y-1 text-sm">
            <li>• Clean "Watch on YouTube" buttons</li>
            <li>• Polished red styling with icons</li>
            <li>• Graceful degradation</li>
            <li>• Professional appearance</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          🚀 Perfect! Your theological responses now handle YouTube embeds elegantly.
        </p>
      </div>
    </div>
  )
}