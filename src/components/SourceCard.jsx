import { useState } from 'react'

/**
 * Rich source card component with thumbnail support
 * Displays sources with visual previews like ChatGPT
 */
export default function SourceCard({ source, index }) {
  const [imageError, setImageError] = useState(false)
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)

  // Extract domain for favicon
  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return 'unknown'
    }
  }

  // Check if source is a video (YouTube, Vimeo, etc.)
  const isVideo = (url) => {
    return url && (
      url.includes('youtube.com') || 
      url.includes('youtu.be') || 
      url.includes('vimeo.com')
    )
  }

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    if (!url) return null
    
    // Extract video ID from various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    
    if (match) {
      const videoId = match[1]
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
    return null
  }

  // Get generic thumbnail for other sites
  const getGenericThumbnail = (url) => {
    if (!url) return null
    const domain = getDomain(url)
    
    // Some sites provide meta images via services
    return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
  }

  const domain = getDomain(source.url || '')
  const thumbnail = isVideo(source.url) ? getYouTubeThumbnail(source.url) : getGenericThumbnail(source.url)
  const showThumbnail = thumbnail && !imageError

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px',
      backgroundColor: '#1A1A1A',
      border: '1px solid #333',
      borderRadius: '8px',
      marginBottom: '8px',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#222'
      e.currentTarget.style.borderColor = '#444'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#1A1A1A'
      e.currentTarget.style.borderColor = '#333'
    }}
    onClick={() => source.url && window.open(source.url, '_blank', 'noopener,noreferrer')}
    >
      {/* Source number */}
      <div style={{
        minWidth: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '600',
        marginTop: '2px'
      }}>
        {index + 1}
      </div>

      {/* Thumbnail */}
      {showThumbnail && (
        <div style={{
          width: '80px',
          height: '60px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#333',
          flexShrink: 0,
          position: 'relative'
        }}>
          <img
            src={thumbnail}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: thumbnailLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
            onLoad={() => setThumbnailLoaded(true)}
            onError={() => setImageError(true)}
          />
          
          {/* Video play icon overlay */}
          {isVideo(source.url) && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid white',
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                marginLeft: '1px'
              }} />
            </div>
          )}
          
          {/* Loading state */}
          {!thumbnailLoaded && !imageError && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '10px',
              color: '#666'
            }}>
              📷
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <div style={{
          color: '#60a5fa',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {source.title || 'Untitled'}
        </div>
        
        {/* Domain */}
        <div style={{
          color: '#888',
          fontSize: '12px',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <img
            src={`https://${domain}/favicon.ico`}
            alt=""
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px'
            }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          {domain}
        </div>
        
        {/* Snippet */}
        {source.snippet && (
          <div style={{
            color: '#aaa',
            fontSize: '12px',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {source.snippet}
          </div>
        )}
      </div>
    </div>
  )
}