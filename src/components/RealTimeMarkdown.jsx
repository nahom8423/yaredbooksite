import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import MarkdownVideo from './MarkdownVideo'

/**
 * Enhanced markdown renderer that supports real-time rendering during typing animation
 * Optimized for performance during character-by-character updates
 */
export default function RealTimeMarkdown({ text, isAnimating = false, style = {}, sources = [], onCitationClick }) {
  const [renderKey, setRenderKey] = useState(0)
  
  const processedText = useMemo(() => {
    if (!text) return text;
    
    // Handle inline citations with website name format - single pass processing
    let processed = text;
    if (sources && sources.length > 0) {
      console.log('🎨 Starting citation processing with', sources.length, 'sources');
      console.log('🎨 Available source domains:', sources.map(s => s.domain));
      
      // FIRST: Handle legacy [SOURCE_X] patterns
      processed = processed.replace(/\[SOURCE_(\d+)\]/g, (match, sourceId) => {
        const sourceIndex = sources.findIndex(s => s.id === parseInt(sourceId, 10));
        const displayName = sourceIndex !== -1 ? sources[sourceIndex].domain || sourceIndex + 1 : sourceId;
        console.log(`🔄 Legacy SOURCE_${sourceId} → CITE:${sourceIndex}:${displayName}`);
        return `**[CITE:${sourceIndex}:${displayName}]**`;
      });
      
      // SECOND: Handle direct numbered citations [1], [2]
      processed = processed.replace(/\[(\d+)\]/g, (match, n) => {
        const num = parseInt(n, 10);
        const sourceIndex = num - 1;
        if (sourceIndex >= 0 && sourceIndex < sources.length) {
          const displayName = sources[sourceIndex].domain || n;
          console.log(`🔄 Numbered [${n}] → CITE:${sourceIndex}:${displayName}`);
          return `**[CITE:${sourceIndex}:${displayName}]**`;
        }
        return match;
      });
      
      // THIRD: Handle bracketed domain citations [academia.edu] - do this BEFORE plain domains
      processed = processed.replace(/\[([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\]/g, (match, domain) => {
        // Skip if this is already a CITE pattern
        if (match.includes('CITE:')) return match;
        
        const sourceIndex = sources.findIndex(s => {
          const sourceDomain = s.domain;
          if (!sourceDomain) return false;
          
          // Normalize both domains for comparison
          const normalizeSource = sourceDomain.replace(/^www\./, '').toLowerCase();
          const normalizeDomain = domain.replace(/^www\./, '').toLowerCase();
          
          // Try exact match, with/without www, and substring matches
          return normalizeSource === normalizeDomain || 
                 sourceDomain.toLowerCase() === domain.toLowerCase() ||
                 sourceDomain.toLowerCase() === 'www.' + domain.toLowerCase() ||
                 normalizeSource.includes(normalizeDomain) ||
                 normalizeDomain.includes(normalizeSource);
        });
        
        if (sourceIndex !== -1) {
          const cleanDomain = domain.replace(/^www\./, '');
          console.log(`🔄 Bracketed [${domain}] → CITE:${sourceIndex}:${cleanDomain}`);
          return `**[CITE:${sourceIndex}:${cleanDomain}]**`;
        }
        console.log(`⚠️ No source found for bracketed domain: [${domain}]`);
        return match;
      });
      
      // FOURTH: Handle plain domains (only if not already processed)
      sources.forEach((source, index) => {
        const domain = source.domain;
        if (domain) {
          const cleanDomain = domain.replace(/^www\./, '');
          // Simple approach: split by CITE patterns, process each part, then rejoin
          const parts = processed.split(/(\*\*\[CITE:\d+:[^\]]+\]\*\*)/);
          
          for (let i = 0; i < parts.length; i += 2) { // Only process non-CITE parts (even indices)
            const part = parts[i];
            const regex = new RegExp(`\\b(${domain.replace('.', '\\.')}|${cleanDomain.replace('.', '\\.')})\\b`, 'g');
            
            const newPart = part.replace(regex, (match) => {
              console.log(`🔄 Plain domain ${match} → CITE:${index}:${cleanDomain}`);
              return `**[CITE:${index}:${cleanDomain}]**`;
            });
            
            parts[i] = newPart;
          }
          
          processed = parts.join('');
        }
      });
    }
    
    // FINAL: Convert CITE patterns directly to HTML pills (bypass markdown processing)
    const finalProcessed = processed.replace(/\*\*\[CITE:(\d+):([^\]]+)\]\*\*/g, (match, sourceIndex, domain) => {
      const idx = parseInt(sourceIndex);
      console.log(`🎯 Converting CITE pattern to HTML pill: ${domain} (index: ${idx})`);
      // Return HTML matching ChatGPT's exact styling
      return `<span class="citation-pill" data-source-index="${idx}" onmouseover="this.style.backgroundColor='#2a2a2a';" onmouseout="this.style.backgroundColor='#303030';" style="display: inline-flex; align-items: center; height: 18px; overflow: hidden; border-radius: 9px; padding: 0 8px; text-decoration: none; background-color: #303030; color: #8F8F8F; font-size: 9px; font-weight: 500; line-height: 1; margin-left: 1px; margin-right: 1px; cursor: pointer; transition: all 150ms ease-in-out; position: relative; top: -0.094rem;">${domain}</span>`;
    });
    
    return finalProcessed;
  }, [text, sources]);
  
  // Debug markdown text
  if (process.env.NODE_ENV === 'development' && text) {
    console.log('🎨 RealTimeMarkdown received text:', text.substring(0, 200) + '...')
    console.log('🎨 Text includes academia.edu?', text.includes('academia.edu'))
    console.log('🎨 Text includes dslabs.ucla.edu?', text.includes('dslabs.ucla.edu'))
    console.log('🎨 Text includes [academia.edu]?', text.includes('[academia.edu]'))
    console.log('🎨 Sources available:', sources?.length || 0)
    console.log('🎨 Source domains:', sources?.map(s => s.domain) || [])
    console.log('🎨 Processed text:', processedText.substring(0, 400) + '...')
    console.log('🎨 Processed includes CITE?', processedText.includes('CITE'))
  }
  
  // Citation pill component
  const CitationPill = ({ sourceIndex, num, sources, onSourceClick }) => (
    <span
      onClick={() => {
        if (onSourceClick) {
          onSourceClick(sourceIndex);
        } else if (onCitationClick) {
          // Use the source ID if available, otherwise fall back to the display number
          const source = sources[sourceIndex];
          const sourceId = source?.id || num;
          onCitationClick(sourceId);
        }
      }}
      style={{
        display: 'inline-block',
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        margin: '0 3px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        verticalAlign: 'baseline',
        lineHeight: '1.2',
        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#1d4ed8';
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#2563eb';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.3)';
      }}
    >
{num}
    </span>
  );
  
  // Force re-render periodically during animation to update markdown
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setRenderKey(prev => prev + 1)
      }, 50) // Update every 50ms during animation for smoother formatting
      
      return () => clearInterval(interval)
    }
  }, [isAnimating])

  // Handle citation pill clicks after render
  useEffect(() => {
    const pillClickHandler = (event) => {
      if (event.target.classList.contains('citation-pill')) {
        const sourceIndex = parseInt(event.target.getAttribute('data-source-index'));
        if (sources && sources[sourceIndex]) {
          const source = sources[sourceIndex];
          if (source.url) {
            window.open(source.url, '_blank', 'noopener,noreferrer');
          }
        }
      }
    };

    // Add event listener to the document
    document.addEventListener('click', pillClickHandler);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', pillClickHandler);
    };
  }, [sources])

  // Handle citation pill clicks
  const handleCitationClick = (sourceIndex) => {
    if (sources && sources[sourceIndex]) {
      const source = sources[sourceIndex];
      if (source.url) {
        window.open(source.url, '_blank', 'noopener,noreferrer');
      }
    }
  }

  // Memoize markdown components for performance
  const markdownComponents = useMemo(() => ({
    // Enhanced headers with ChatGPT-style visual hierarchy
    h1: ({node, ...props}) => (
      <h1 style={{
        color: 'white', 
        fontSize: '1.75rem', 
        fontWeight: 'bold', 
        marginBottom: '1.5rem', 
        marginTop: '2rem',
        lineHeight: '1.2',
        letterSpacing: '-0.025em'
      }} {...props} />
    ),
    h2: ({node, ...props}) => (
      <h2 style={{
        color: 'white', 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        marginBottom: '1.25rem', 
        marginTop: '2rem',
        lineHeight: '1.3'
      }} {...props} />
    ),
    h3: ({node, ...props}) => (
      <h3 style={{
        color: 'white', 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        marginBottom: '1rem', 
        marginTop: '1.75rem',
        lineHeight: '1.4',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }} {...props} />
    ),
    p: ({node, ...props}) => (
      <p style={{
        color: 'white', 
        marginBottom: '1rem', 
        lineHeight: '1.7',
        fontSize: '0.95rem'
      }} {...props} />
    ),
    strong: ({node, children}) => {
      const raw = children?.[0] ?? "";
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Strong component called with:', raw);
      }
      const m = /^\[CITE:(\d+):([^\]]+)\]$/.exec(raw);
      if (m) {
        console.log('🎯 Citation detected! Creating pill for domain:', m[2]);
        const idx = Number(m[1]);
        return (
          <CitationPill 
            sourceIndex={idx} 
            num={m[2]}
            sources={sources}
            onSourceClick={handleCitationClick}
          />
        );
      }
      return <strong style={{color: 'white', fontWeight: '600'}}>{children}</strong>;
    },
    em: ({node, ...props}) => <em style={{color: 'white', fontStyle: 'italic'}} {...props} />,
    a: ({node, ...props}) => <a style={{color: '#60a5fa', textDecoration: 'underline'}} target="_blank" rel="noopener noreferrer" {...props} />,
    ul: ({node, ...props}) => (
      <ul style={{
        marginBottom: '1.25rem', 
        paddingLeft: '1.5rem',
        listStyle: 'disc',
        listStylePosition: 'outside'
      }} {...props} />
    ),
    ol: ({node, ...props}) => (
      <ol style={{
        marginBottom: '1.25rem', 
        paddingLeft: '1.5rem',
        listStyle: 'decimal',
        listStylePosition: 'outside'
      }} {...props} />
    ),
    li: ({node, ...props}) => (
      <li style={{
        color: 'white', 
        marginBottom: '0.5rem',
        lineHeight: '1.6',
        paddingLeft: '0.25rem'
      }} {...props} />
    ),
    blockquote: ({node, ...props}) => <blockquote style={{color: 'white', borderLeft: '4px solid #60a5fa', paddingLeft: '1rem', marginBottom: '0.75rem', fontStyle: 'italic'}} {...props} />,
    code: ({node, inline, ...props}) => 
      inline 
        ? <code style={{backgroundColor: '#2A2A2A', padding: '2px 4px', borderRadius: '3px', fontSize: '0.9em', color: '#ffd700'}} {...props} />
        : <code style={{display: 'block', backgroundColor: '#1A1A1A', padding: '1rem', borderRadius: '6px', overflow: 'auto', fontSize: '0.9em', color: '#ffd700', marginBottom: '0.75rem'}} {...props} />,
    pre: ({node, ...props}) => <pre style={{backgroundColor: '#1A1A1A', padding: '1rem', borderRadius: '6px', overflow: 'auto', marginBottom: '0.75rem'}} {...props} />,
    table: ({node, ...props}) => (
      <table style={{
        borderCollapse: 'collapse', 
        width: '100%', 
        marginBottom: '1.5rem', 
        marginTop: '1.5rem', 
        border: '1px solid #404040', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }} {...props} />
    ),
    thead: ({node, ...props}) => (
      <thead style={{
        backgroundColor: '#2A2A2A', 
        borderBottom: '2px solid #404040'
      }} {...props} />
    ),
    th: ({node, ...props}) => (
      <th style={{
        color: 'white', 
        padding: '14px 16px', 
        textAlign: 'left', 
        borderRight: '1px solid #404040', 
        fontWeight: '600', 
        fontSize: '0.875rem',
        letterSpacing: '0.025em',
        textTransform: 'none'
      }} {...props} />
    ),
    td: ({node, ...props}) => (
      <td style={{
        color: 'white', 
        padding: '12px 16px', 
        borderRight: '1px solid #404040', 
        borderBottom: '1px solid #404040', 
        lineHeight: '1.6',
        fontSize: '0.875rem'
      }} {...props} />
    ),
    tbody: ({node, ...props}) => (
      <tbody style={{backgroundColor: '#1A1A1A'}} {...props} />
    ),
    hr: ({node, ...props}) => <hr style={{border: 'none', borderTop: '1px solid #404040', margin: '1.5rem 0'}} {...props} />,
    // Smart YouTube embed handling with fallback
    iframe: ({node, ...props}) => {
      const src = props.src || ''
      if (src.includes('youtube.com/embed/') || src.includes('youtu.be/')) {
        return <MarkdownVideo src={src} />
      }
      return <iframe style={{borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '1rem', marginTop: '1rem'}} {...props} />
    }
  }), [sources, handleCitationClick])

  const combinedStyle = {
    color: 'white',
    lineHeight: '1.6',
    ...style
  }

  return (
    <div className="markdown-realtime">
      <ReactMarkdown 
        key={renderKey}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
        style={combinedStyle}
      >
        {processedText || ''}
      </ReactMarkdown>
      {isAnimating && <span className="animate-pulse" style={{color: 'white'}}>|</span>}
    </div>
  )
}