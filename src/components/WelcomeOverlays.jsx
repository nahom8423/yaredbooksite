import { createPortal } from 'react-dom'

export default function WelcomeOverlays({ show = false, sidebarWidth = '256px' }) {
  console.log('🌟 WelcomeOverlays render:', { show, sidebarWidth })
  
  const overlay = (
    <>
      <div
        className="welcome-bg"
        aria-hidden="true"
        onLoad={() => console.log('📸 Welcome background image loaded')}
        onError={() => console.log('❌ Welcome background image failed to load')}
        ref={(el) => {
          if (el) {
            console.log('🎯 Welcome-bg element created:', el)
            console.log('🎯 Element computed styles:', window.getComputedStyle(el))
            console.log('🎯 Body children count:', document.body.children.length)
            console.log('🎯 Body has welcome-bg class:', document.body.querySelector('.welcome-bg') !== null)
          }
        }}
      />
      <div
        className="welcome-bg-sidebar"
        style={{ width: sidebarWidth }}
        aria-hidden="true"
      />
    </>
  )
  console.log('🚪 Creating portal to document.body')
  return createPortal(overlay, document.body)
}

