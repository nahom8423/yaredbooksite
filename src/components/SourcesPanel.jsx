import { useState, useEffect } from 'react'

export default function SourcesPanel({ isOpen, onClose, sources = [] }) {
  const [animationClass, setAnimationClass] = useState('')

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('translate-x-0')
    } else {
      setAnimationClass('translate-x-full')
    }
  }, [isOpen])

  // Mock sources data for testing (replace with actual sources from message)
  const mockSources = [
    {
      title: "What LLM is everyone using in June 2025? : r/LocalLLaMA - Reddit",
      url: "https://reddit.com",
      favicon: "https://www.reddit.com/favicon.ico",
      date: "June 13, 2025",
      snippet: "Qwen3 has been the best overall. When I'm in the field and have CPU only, it shines. I..."
    },
    {
      title: "Evaluating an LLM for your use case - Paul Simmering",
      url: "https://simmering.dev",
      favicon: "https://simmering.dev/favicon.ico",
      date: "April 27, 2024",
      snippet: "This article is a deep dive into evaluations, covering accuracy, speed, cost,..."
    },
    {
      title: "Evaluating LLM systems: Metrics, challenges, and best practices",
      url: "https://medium.com",
      favicon: "https://medium.com/favicon.ico",
      date: "March 4, 2024",
      snippet: "This article focuses on the evaluation of LLM systems, it is crucial to discern th..."
    },
    {
      title: "LLM Evaluation Metrics: The Ultimate LLM Evaluation Guide",
      url: "https://confident-ai.com",
      favicon: "https://confident-ai.com/favicon.ico",
      date: "June 17, 2025",
      snippet: "LLM-as-a-judge is the most reliable method—using an LLM to evaluate with natural..."
    },
    {
      title: "How to Choose the Best Open Source LLM (2025 Guide)",
      url: "https://imaginarycloud.com",
      favicon: "https://imaginarycloud.com/favicon.ico",
      date: "May 29, 2025",
      snippet: "This article compares the top open source LLMs available today, examines their real-..."
    },
    {
      title: "Ask HN: What is the best LLM for consumer grade",
      url: "https://ycombinator.com",
      favicon: "https://news.ycombinator.com/favicon.ico",
      date: "Recent",
      snippet: "Discussion about the best consumer-grade LLMs available..."
    }
  ]

  const hasRealSources = sources && sources.length > 0;
  const displaySources = hasRealSources ? sources : [];

  return (
    <>
      {/* Sources Panel */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-[#171717] border-l border-[#333] z-50 transform transition-transform duration-300 ease-in-out ${animationClass} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-[10px]">🔴</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-[10px]">💻</span>
              </div>
            </div>
            <h2 className="text-white font-medium text-sm">Sources</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#2A2A2A] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Citations text */}
        <div className="p-4 text-sm text-gray-400">
          Citations
        </div>

        {/* Sources list */}
        <div className="flex-1 overflow-y-auto">
          {hasRealSources ? (
            displaySources.map((source, index) => (
              <div key={index}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 hover:bg-[#1F1F1F] transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    {/* Favicon */}
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      <img 
                        src={source.favicon} 
                        alt=""
                        className="w-4 h-4 rounded-sm"
                        style={{ backgroundColor: 'transparent' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] text-[#8e8e8e] bg-[#444]" style={{display: 'none'}}>
                        🌐
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-white text-sm font-medium mb-1 group-hover:text-blue-400 transition-colors line-clamp-2 leading-5">
                        {source.title}
                      </h3>
                      
                      {/* Date */}
                      <div className="text-xs text-gray-500 mb-2">
                        {source.date}
                      </div>
                      
                      {/* Snippet */}
                      <p className="text-xs text-gray-400 line-clamp-3 leading-4">
                        {source.snippet}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              <div className="text-sm mb-2">🔍 No web sources found</div>
              <div className="text-xs text-gray-500">
                This response was generated using internal knowledge without web search results.
              </div>
            </div>
          )}
        </div>

        {/* More button at bottom */}
        <div className="p-4 border-t border-[#333]">
          <button className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors">
            More
          </button>
        </div>
      </div>
    </>
  )
}