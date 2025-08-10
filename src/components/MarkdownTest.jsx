import MarkdownRenderer from './MarkdownRenderer'

export default function MarkdownTest() {
  const sampleTheologicalResponse = `## 🎓 Who Is Yeneta Kibur Tilahun?

**መጋቤ አእላፍ የኔታ ክቡር ጥላሁን** (Megabe A'elaf Yeneta Kibur Tilahun) is a distinguished figure in Ethiopian Orthodox Tewahedo Church liturgical education, serving as the universal certifier of **Aquaquam** - a structured liturgical practice combining sacred chant, movement, and percussion.

### 📍 Position & Authority

- **Universal Certifier** of Aquaquam liturgical practice
- **Senior Instructor** at traditional zema institutions in Gondar
- **Lineage Holder** in the ecclesiastical tradition

### 🎥 Educational Resources

**🎥 Video Source: ወረብ ዘዮሐንስ ክፍል 2**
This instructional video shows Yeneta Megabae A'elaf Kibur Tilahun teaching colleagues from 2022-2023.
🔗 [Watch Video](https://www.youtube.com/watch?v=1vA2iBbRLzA)

**⛪ Church Resource: The Orthodox Church (@orthodoxyinlife)**  
Demonstrates the universal certifier of Aququam teaching proper techniques for aregaget and kebero percussion.
🔗 [Visit Source](https://www.instagram.com/orthodoxyinlife/)

### 📚 Cultural Context

The **Aquaquam** tradition represents a sophisticated integration of:
- Sacred chant (**ዜማ**)  
- Liturgical movement (**አረጋገት**)
- Percussion instruments (**ከበሮ**)

This practice maintains the ancient liturgical heritage while providing structured education for new generations of Ethiopian Orthodox practitioners.

### 🔗 Sources
Based on instructional videos and church documentation from traditional Ethiopian Orthodox institutions.`

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">🧪 Markdown Rendering Test</h1>
        <p className="text-gray-300 mb-6">
          This is how your enhanced theological responses will look with proper markdown rendering:
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">📝 Raw Markdown (What Claude generates):</h2>
        <pre className="bg-gray-900 p-4 rounded text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
          {sampleTheologicalResponse}
        </pre>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🎨 Rendered Output (What users will see):</h2>
        <div className="bg-gray-700 p-4 rounded">
          <MarkdownRenderer content={sampleTheologicalResponse} />
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <h3 className="text-blue-300 font-semibold mb-2">✅ Features Demonstrated:</h3>
        <ul className="text-blue-200 space-y-1 text-sm">
          <li>• **Bold text** rendering</li>
          <li>• Headers with proper hierarchy</li>
          <li>• Clickable links with external target</li>
          <li>• Source-specific link styling (YouTube = red, Instagram = purple)</li>
          <li>• Bullet points and lists</li>
          <li>• Emoji and Unicode support</li>
          <li>• Proper paragraph spacing</li>
        </ul>
      </div>
    </div>
  )
}