import { useState, useEffect } from 'react'

/**
 * Animated searching indicator for web search
 * Shows professional loading state like ChatGPT
 */
export default function SearchingIndicator({ isSearching }) {
  const [dots, setDots] = useState('')
  const [searchStage, setSearchStage] = useState(0)
  const [stageChangeCount, setStageChangeCount] = useState(0)

  const searchStages = [
    'Looking that up for you',
    'Finding current information', 
    'Thinking about your question',
    'Checking latest sources',
    'Gathering relevant details'
  ]

  useEffect(() => {
    if (!isSearching) {
      setDots('')
      setSearchStage(0)
      setStageChangeCount(0)
      return
    }

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    // Change search stage with randomized timing (1.2s to 3.5s)
    // Limit to max 8 changes to avoid infinite cycling
    const stageInterval = setInterval(() => {
      setStageChangeCount(prev => {
        if (prev >= 8) return prev // Stop cycling after 8 changes
        
        setSearchStage(prevStage => (prevStage + 1) % searchStages.length)
        return prev + 1
      })
    }, 1200 + Math.random() * 2300)

    return () => {
      clearInterval(dotsInterval)
      clearInterval(stageInterval)
    }
  }, [isSearching])

  if (!isSearching) return null

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '24px',
      animation: 'slideInLeft 0.3s ease-out'
    }}>
      <span className="liquid-glass-text" style={{
        fontSize: '16px',
        fontWeight: '500'
      }}>
        {searchStages[searchStage]}{dots}
      </span>
    </div>
  )
}