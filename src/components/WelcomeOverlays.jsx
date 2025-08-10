import { createPortal } from 'react-dom'

export default function WelcomeOverlays({ show = false, sidebarWidth = '256px' }) {
  console.log('🌟 WelcomeOverlays render:', { show, sidebarWidth })
  
  if (!show) {
    console.log('❌ WelcomeOverlays: show=false, not rendering')
    return null
  }
  
  console.log('✅ WelcomeOverlays: show=true, rendering portal')
  
  const overlay = (
    <>
      <div className="welcome-bg" aria-hidden="true" style={{background: 'blue', opacity: 1, zIndex: 999999}} />
      <div className="welcome-bg-sidebar" style={{ width: sidebarWidth }} aria-hidden="true" />
    </>
  )
  
  return createPortal(overlay, document.body)
}

