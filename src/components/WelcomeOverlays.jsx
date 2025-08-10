import { createPortal } from 'react-dom'

export default function WelcomeOverlays({ show = false, sidebarWidth = '256px' }) {
  console.log('🌟 WelcomeOverlays render:', { show, sidebarWidth })
  
  const overlay = (
    <>
      <div
        className="welcome-bg"
        style={{ opacity: show ? 1 : 0, zIndex: -1 }}
        aria-hidden="true"
        onLoad={() => console.log('📸 Welcome background image loaded')}
        onError={() => console.log('❌ Welcome background image failed to load')}
      />
      <div
        className="welcome-bg-sidebar"
        style={{ width: sidebarWidth, opacity: show ? 1 : 0, zIndex: -1 }}
        aria-hidden="true"
      />
    </>
  )
  console.log('🚪 Creating portal to document.body')
  return createPortal(overlay, document.body)
}

