import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import MarkdownVideo from './MarkdownVideo'

/**
 * Improved markdown renderer with simplified citation processing
 * Focuses on clean, consistent rendering without over-processing
 */
export default function ImprovedRealTimeMarkdown({ text, isAnimating = false, style = {}, sources = [], onCitationClick }) {
  const [renderKey, setRenderKey] = useState(0)
  
  const processedText = useMemo(() => {
    if (!text) return text;
    
    let processed = text;
    
    // Sanitize markdown tables - remove list bullets and ensure blank lines
    processed = processed
      .replace(/^[*\-•]\s+\|/gm, '|')     // strip leading bullets on table rows
      .replace(/\n\s*\n\|/g, '\n\n|')     // force blank line before table
      .replace(/^\s*\|?[-\s|]+\|?\s*$/gm, '|---|---|'); // fix malformed separator rows
    
    // Simple citation processing - only if we have sources
    if (sources && sources.length > 0) {
      console.log('🎨 Processing citations with', sources.length, 'sources');
      
      // Handle [SOURCE_X] patterns
      processed = processed.replace(/\[SOURCE_(\d+)\]/g, (match, sourceId) => {
        const sourceIndex = parseInt(sourceId, 10) - 1;
        if (sourceIndex >= 0 && sourceIndex < sources.length) {
          const displayName = sources[sourceIndex].domain || `${sourceIndex + 1}`;
          return `**[CITE:${sourceIndex}:${displayName}]**`;
        }
        return match;
      });
      
      // Handle numbered citations [1], [2], etc.
      processed = processed.replace(/\[(\d+)\]/g, (match, n) => {
        const num = parseInt(n, 10);
        const sourceIndex = num - 1;
        if (sourceIndex >= 0 && sourceIndex < sources.length) {
          const displayName = sources[sourceIndex].domain || n;
          return `**[CITE:${sourceIndex}:${displayName}]**`;
        }
        return match;
      });
      
      // Handle domain citations [example.com] - only if we can match to a source
      processed = processed.replace(/\[([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\]/g, (match, domain) => {
        const sourceIndex = sources.findIndex(s => {
          const sourceDomain = s.domain;
          if (!sourceDomain) return false;
          return sourceDomain.toLowerCase().includes(domain.toLowerCase()) ||
                 domain.toLowerCase().includes(sourceDomain.toLowerCase());
        });
        
        if (sourceIndex !== -1) {
          const cleanDomain = domain.replace(/^www\./, '');
          return `**[CITE:${sourceIndex}:${cleanDomain}]**`;
        }
        return match; // Keep original if no source found
      });
    }
    
    return processed;
  }, [text, sources]);
  
  // Citation pill component with consistent styling
  const CitationPill = ({ sourceIndex, displayName }) => (
    <span
      onClick={() => {
        if (onCitationClick) {
          const source = sources[sourceIndex];
          const sourceId = source?.id || sourceIndex + 1;
          onCitationClick(sourceId);
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '20px',
        padding: '2px 8px',
        margin: '0 2px',
        backgroundColor: '#2563eb',
        color: 'white',
        borderRadius: '10px',
        fontSize: '11px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        lineHeight: '1',
        boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#1d4ed8';
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#2563eb';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 1px 3px rgba(37, 99, 235, 0.3)';
      }}
    >
      {displayName}
    </span>
  );
  
  // Force re-render during animation for smooth typing effect
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setRenderKey(prev => prev + 1)
      }, 100) // Update every 100ms for smoother performance
      
      return () => clearInterval(interval)
    }
  }, [isAnimating])

  // Auto-scroll during typing animation to keep content visible
  useEffect(() => {
    if (isAnimating) {
      const autoScroll = () => {
        // Scroll to keep the typing content in view
        const markdownElement = document.querySelector('.improved-markdown-realtime');
        if (markdownElement) {
          const rect = markdownElement.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // If the bottom of the content is below the viewport, scroll down
          if (rect.bottom > windowHeight - 100) {
            window.scrollBy({
              top: 50,
              behavior: 'smooth'
            });
          }
        }
      };

      // Auto-scroll periodically during animation
      const scrollInterval = setInterval(autoScroll, 200);
      
      return () => clearInterval(scrollInterval);
    }
  }, [isAnimating, text])

  // Simplified markdown components with consistent styling
  const markdownComponents = useMemo(() => ({
    // Headers with proper hierarchy and spacing
    h1: ({node, ...props}) => (
      <h1 style={{
        color: 'white', 
        fontSize: '1.75rem', 
        fontWeight: 'bold', 
        marginBottom: '1.5rem', 
        marginTop: '2rem',
        lineHeight: '1.2',
        borderBottom: '2px solid #333',
        paddingBottom: '0.5rem'
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
    h4: ({node, ...props}) => (
      <h4 style={{
        color: 'white', 
        fontSize: '1.125rem', 
        fontWeight: '600', 
        marginBottom: '0.75rem', 
        marginTop: '1.5rem',
        lineHeight: '1.4'
      }} {...props} />
    ),
    
    // Paragraphs with proper spacing
    p: ({node, ...props}) => (
      <p style={{
        color: 'white', 
        marginBottom: '1rem', 
        lineHeight: '1.7',
        fontSize: '0.95rem',
        userSelect: 'text',
        WebkitUserSelect: 'text',
        MozUserSelect: 'text',
        msUserSelect: 'text',
        cursor: 'text'
      }} {...props} />
    ),
    
    // Enhanced strong text with citation handling
    strong: ({node, children}) => {
      const text = children?.[0] ?? "";
      
      // Check for citation pattern
      const citationMatch = /^\[CITE:(\d+):([^\]]+)\]$/.exec(text);
      if (citationMatch) {
        const sourceIndex = parseInt(citationMatch[1], 10);
        const displayName = citationMatch[2];
        return <CitationPill sourceIndex={sourceIndex} displayName={displayName} />;
      }
      
      return <strong style={{color: 'white', fontWeight: '600'}}>{children}</strong>;
    },
    
    // Consistent text styling
    em: ({node, ...props}) => <em style={{color: 'white', fontStyle: 'italic'}} {...props} />,
    a: ({node, ...props}) => (
      <a style={{
        color: '#60a5fa', 
        textDecoration: 'underline',
        transition: 'color 0.2s ease'
      }} 
      target="_blank" 
      rel="noopener noreferrer" 
      {...props} 
      onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
      onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
      />
    ),
    
    // Improved list styling
    ul: ({node, ...props}) => (
      <ul style={{
        marginBottom: '1.25rem', 
        paddingLeft: '1.5rem',
        listStyle: 'disc',
        listStylePosition: 'outside',
        color: 'white'
      }} {...props} />
    ),
    ol: ({node, ...props}) => (
      <ol style={{
        marginBottom: '1.25rem', 
        paddingLeft: '1.5rem',
        listStyle: 'decimal',
        listStylePosition: 'outside',
        color: 'white'
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
    
    // Enhanced blockquote
    blockquote: ({node, ...props}) => (
      <blockquote style={{
        color: '#d1d5db', 
        borderLeft: '4px solid #60a5fa', 
        paddingLeft: '1rem', 
        margin: '1.5rem 0',
        fontStyle: 'italic',
        backgroundColor: '#1f2937',
        padding: '1rem',
        borderRadius: '0 8px 8px 0'
      }} {...props} />
    ),
    
    // Code blocks with better styling
    code: ({node, inline, ...props}) => 
      inline 
        ? <code style={{
            backgroundColor: '#374151', 
            padding: '2px 6px', 
            borderRadius: '4px', 
            fontSize: '0.9em', 
            color: '#fcd34d',
            border: '1px solid #4b5563'
          }} {...props} />
        : <code style={{
            display: 'block', 
            backgroundColor: '#1f2937', 
            padding: '1rem', 
            borderRadius: '8px', 
            overflow: 'auto', 
            fontSize: '0.9em', 
            color: '#fcd34d', 
            marginBottom: '1rem',
            border: '1px solid #374151'
          }} {...props} />,
    
    pre: ({node, ...props}) => (
      <pre style={{
        backgroundColor: '#1f2937', 
        padding: '1rem', 
        borderRadius: '8px', 
        overflow: 'auto', 
        marginBottom: '1rem',
        border: '1px solid #374151'
      }} {...props} />
    ),
    
    // Enhanced table styling with Tailwind-like CSS classes applied via style
    table: ({node, ...props}) => (
      <div style={{ 
        overflowX: 'auto', 
        marginBottom: '1.5rem',
        marginTop: '1.5rem'
      }}>
        <table style={{
          minWidth: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #4b5563',
          borderRadius: '8px',
          backgroundColor: '#1f2937'
        }} {...props} />
      </div>
    ),
    thead: ({node, ...props}) => (
      <thead style={{
        backgroundColor: '#374151'
      }} {...props} />
    ),
    tbody: ({node, ...props}) => (
      <tbody style={{
        backgroundColor: '#1f2937'
      }} {...props} />
    ),
    tr: ({node, ...props}) => (
      <tr style={{
        transition: 'background-color 0.2s ease'
      }} 
      onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      {...props} />
    ),
    th: ({node, ...props}) => (
      <th style={{
        color: '#e5e7eb', 
        padding: '12px 16px', 
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '2px solid #4b5563',
        borderRight: '1px solid #4b5563',
        backgroundColor: '#374151'
      }} {...props} />
    ),
    td: ({node, ...props}) => (
      <td style={{
        color: '#d1d5db', 
        padding: '12px 16px', 
        fontSize: '0.875rem',
        lineHeight: '1.6',
        borderBottom: '1px solid #4b5563',
        borderRight: '1px solid #4b5563',
        verticalAlign: 'top',
        whiteSpace: 'nowrap'
      }} {...props} />
    ),
    
    // Horizontal rule
    hr: ({node, ...props}) => (
      <hr style={{
        border: 'none', 
        borderTop: '2px solid #4b5563', 
        margin: '2rem 0',
        borderRadius: '1px'
      }} {...props} />
    ),
    
    // Video embeds
    iframe: ({node, ...props}) => {
      const src = props.src || ''
      if (src.includes('youtube.com/embed/') || src.includes('youtu.be/')) {
        return <MarkdownVideo src={src} />
      }
      return (
        <iframe 
          style={{
            borderRadius: '8px', 
            border: '1px solid #4b5563',
            marginBottom: '1rem', 
            marginTop: '1rem'
          }} 
          {...props} 
        />
      )
    }
  }), [sources, onCitationClick])

  const combinedStyle = {
    color: 'white',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    ...style
  }

  return (
    <div 
      className="improved-markdown-realtime"
      style={{
        userSelect: 'text',
        WebkitUserSelect: 'text',
        MozUserSelect: 'text',
        msUserSelect: 'text',
        cursor: 'text'
      }}
    >
      <ReactMarkdown 
        key={renderKey}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
        style={{
          ...combinedStyle,
          userSelect: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text'
        }}
      >
        {processedText || ''}
      </ReactMarkdown>
      {isAnimating && (
        <span 
          className="typing-cursor" 
          style={{
            color: 'white',
            animation: 'blink 1s infinite',
            marginLeft: '2px'
          }}
        >
          |
        </span>
      )}
      
      {/* Add CSS for cursor animation and table styling */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        /* Remove right border from last column in tables */
        .improved-markdown-realtime table th:last-child,
        .improved-markdown-realtime table td:last-child {
          border-right: none !important;
        }
      `}</style>
    </div>
  )
}