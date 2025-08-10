import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default function YouTubeEmbedTestUpdated() {
  const sampleResponseWithVideo = `## 🎓 Who Is Yeneta Kibur Tilahun?

**መጋቤ አእላፍ የኔታ ክቡር ጥላሁን** (Megabe A'elaf Yeneta Kibur Tilahun) is a distinguished figure in Ethiopian Orthodox Tewahedo Church liturgical education.

### 📍 Position & Authority

- **Universal Certifier** of Aquaquam liturgical practice
- **Senior Instructor** at traditional zema institutions

### 📖 Research Sources:

**🎥 Video Source: ወረብ ዘዮሐንስ ክፍል 2**

This instructional video shows Yeneta Megabae A'elaf Kibur Tilahun teaching colleagues from 2022-2023.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/1vA2iBbRLzA" frameborder="0" allowfullscreen title="ወረብ ዘዮሐንስ ክፍል 2"></iframe>

🔗 [Direct Link](https://www.youtube.com/watch?v=1vA2iBbRLzA)

**⛪ Church Resource: The Orthodox Church (@orthodoxyinlife)**

In this video we see the universal certifier of Aququam Yeneta Kibur teaching how to CORRECTLY do aregaget and in addition how to properly hit kebero.

🔗 [Visit Source](https://www.instagram.com/orthodoxyinlife/)

### 🔗 Sources
Based on instructional videos and church documentation from traditional Ethiopian Orthodox institutions.`

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">🎥 Updated YouTube Embed Test</h1>
        <p className="text-gray-300 mb-6">
          This tests the new ReactMarkdown + rehype-raw implementation that should properly render YouTube iframes:
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">📺 ReactMarkdown with rehype-raw:</h2>
        <div className="bg-gray-700 p-4 rounded">
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
              iframe: ({node, ...props}) => <iframe style={{borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '1rem', marginTop: '1rem'}} {...props} />
            }}
            style={{
              color: 'white',
              lineHeight: '1.6'
            }}
          >
            {sampleResponseWithVideo}
          </ReactMarkdown>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-red-300 font-semibold mb-2">❌ Before (Custom Renderer):</h3>
          <ul className="text-red-200 space-y-1 text-sm">
            <li>• Iframes showed as raw HTML text</li>
            <li>• No video embedding</li>
            <li>• Manual HTML parsing</li>
            <li>• Limited markdown support</li>
          </ul>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h3 className="text-green-300 font-semibold mb-2">✅ After (ReactMarkdown + rehype-raw):</h3>
          <ul className="text-green-200 space-y-1 text-sm">
            <li>• Iframes render as actual embedded videos</li>
            <li>• Full HTML support in markdown</li>
            <li>• Proper markdown parsing</li>
            <li>• Professional styling with components</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
        <h3 className="text-purple-300 font-semibold mb-2">🔧 Technical Implementation:</h3>
        <ul className="text-purple-200 space-y-1 text-sm">
          <li>• <code>npm install react-markdown rehype-raw</code></li>
          <li>• Import: <code>import ReactMarkdown from 'react-markdown'</code></li>
          <li>• Import: <code>import rehypeRaw from 'rehype-raw'</code></li>
          <li>• Usage: <code>&lt;ReactMarkdown rehypePlugins={[rehypeRaw]}&gt;</code></li>
          <li>• Custom component styling for consistent appearance</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          🚀 If you can see an embedded YouTube video above, the upgrade is working perfectly!
        </p>
      </div>
    </div>
  )
}