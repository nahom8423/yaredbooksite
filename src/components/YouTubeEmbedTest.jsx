import MarkdownRenderer from './MarkdownRenderer'

export default function YouTubeEmbedTest() {
  const sampleResponseWithVideo = `## 🎓 Who Is Yeneta Kibur Tilahun?

**መጋቤ አእላፍ የኔታ ክቡር ጥላሁን** (Megabe A'elaf Yeneta Kibur Tilahun) is a distinguished figure in Ethiopian Orthodox Tewahedo Church liturgical education.

### 📍 Position & Authority

- **Universal Certifier** of Aquaquam liturgical practice
- **Senior Instructor** at traditional zema institutions

### 🎥 Educational Video

**🎥 Video Source: ወረብ ዘዮሐንስ ክፍል 2**
This instructional video shows Yeneta Megabae A'elaf Kibur Tilahun teaching colleagues from 2022-2023.
<iframe width="100%" height="315" src="https://www.youtube.com/embed/1vA2iBbRLzA" frameborder="0" allowfullscreen title="ወረብ ዘዮሐንስ ክፍል 2"></iframe>
🔗 [Direct Link](https://www.youtube.com/watch?v=1vA2iBbRLzA)

### 📚 Cultural Context

The **Aquaquam** tradition represents a sophisticated integration of sacred chant, liturgical movement, and percussion instruments, maintaining ancient heritage while providing structured education.

### 🔗 Sources
Based on instructional videos and church documentation from traditional Ethiopian Orthodox institutions.`

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">🎥 YouTube Embed Test</h1>
        <p className="text-gray-300 mb-6">
          This demonstrates how theological responses will now include embedded YouTube videos:
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">📺 Live Embedded Video Response:</h2>
        <div className="bg-gray-700 p-4 rounded">
          <MarkdownRenderer content={sampleResponseWithVideo} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h3 className="text-green-300 font-semibold mb-2">✅ Before (Just Links):</h3>
          <ul className="text-green-200 space-y-1 text-sm">
            <li>• Users had to click external links</li>
            <li>• Left your website to watch videos</li>
            <li>• Less engaging experience</li>
            <li>• No video previews</li>
          </ul>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-blue-300 font-semibold mb-2">🎥 After (Embedded Videos):</h3>
          <ul className="text-blue-200 space-y-1 text-sm">
            <li>• Videos play directly in chat</li>
            <li>• Users stay on your website</li>
            <li>• Much more engaging</li>
            <li>• Visual thumbnails and previews</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
        <h3 className="text-purple-300 font-semibold mb-2">🔧 Technical Implementation:</h3>
        <ul className="text-purple-200 space-y-1 text-sm">
          <li>• Backend detects YouTube URLs automatically</li>
          <li>• Converts them to iframe embeds with proper video IDs</li>
          <li>• Frontend MarkdownRenderer handles iframe display</li>
          <li>• Videos are responsive and styled consistently</li>
          <li>• Direct links still provided as backup</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          🚀 Ready to test live! Ask "Who is Yeneta Kibur Tilahun?" in your chat interface.
        </p>
      </div>
    </div>
  )
}