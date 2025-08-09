import ReactPlayer from 'react-player'

export default function MarkdownVideo({ src }) {
  // Extract YouTube URL from iframe src
  let videoUrl = src
  
  // Convert embed URL back to watch URL for ReactPlayer
  if (src.includes('youtube.com/embed/')) {
    const videoId = src.split('embed/')[1].split('?')[0]
    videoUrl = `https://www.youtube.com/watch?v=${videoId}`
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="315"
        controls
        style={{
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}
        fallback={
          <div style={{
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#1f2937',
            margin: '1rem 0'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2"
                style={{ margin: '0 auto' }}
              >
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>
            <p style={{ color: '#d1d5db', marginBottom: '1rem', fontSize: '0.875rem' }}>
              Video embedding disabled by owner
            </p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a2.993 2.993 0 0 0-2.108-2.119C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.39.522A2.993 2.993 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814c.277 1.017 1.092 1.833 2.108 2.119C4.495 20.455 12 20.455 12 20.455s7.505 0 9.39-.522a2.993 2.993 0 0 0 2.108-2.119C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                <path fill="white" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch on YouTube
            </a>
          </div>
        }
      />
    </div>
  )
}