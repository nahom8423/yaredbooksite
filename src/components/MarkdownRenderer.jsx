import { useState, useEffect } from 'react'

/**
 * Simple markdown renderer for theological responses
 * Handles the most common markdown elements without external dependencies
 */
export default function MarkdownRenderer({ content, className = '', style = {} }) {
  const [renderedContent, setRenderedContent] = useState('')

  useEffect(() => {
    if (!content) {
      setRenderedContent('')
      return
    }

    // Simple markdown parsing
    let html = content
    
    // Convert headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mb-3 mt-5">$1</h2>')
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>')
    
    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    
    // Convert links with special handling for different link types
    html = html.replace(/🔗 \[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      let linkClass = 'text-blue-400 hover:text-blue-300 underline'
      let icon = '🔗'
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        icon = '🎥'
        linkClass = 'text-red-400 hover:text-red-300 underline'
      } else if (url.includes('.pdf')) {
        icon = '📄'
        linkClass = 'text-green-400 hover:text-green-300 underline'
      } else if (url.includes('instagram.com')) {
        icon = '📸'
        linkClass = 'text-purple-400 hover:text-purple-300 underline'
      }
      
      return `${icon} <a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${text}</a>`
    })
    
    // Convert regular markdown links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
    
    // Convert bullet points
    html = html.replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
    html = html.replace(/^• (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
    
    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li[^>]*>.*<\/li>\s*)+/gs, '<ul class="mb-3">$&</ul>')
    
    // Handle iframe embeds (YouTube videos)
    html = html.replace(/<iframe([^>]*)>/g, '<iframe$1 class="rounded-lg shadow-lg mb-4">')
    
    // Convert line breaks to paragraphs
    const paragraphs = html.split('\n\n').filter(p => p.trim())
    html = paragraphs.map(p => {
      p = p.trim()
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<li') || p.startsWith('<iframe')) {
        return p
      }
      return `<p class="mb-3 leading-relaxed">${p}</p>`
    }).join('')
    
    // Clean up extra whitespace but preserve iframe structure
    html = html.replace(/\n(?!<iframe)/g, '<br />')
    
    setRenderedContent(html)
  }, [content])

  return (
    <div 
      className={`markdown-content ${className}`}
      style={{
        userSelect: 'text',
        WebkitUserSelect: 'text',
        cursor: 'text',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}