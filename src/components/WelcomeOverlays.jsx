import { createPortal } from 'react-dom'

export default function WelcomeOverlays({ show = false, sidebarWidth = '256px' }) {
  if (!show) return null
  
  const overlay = (
    <>
      <div className="welcome-bg" aria-hidden="true" />
      <div className="welcome-bg-sidebar" style={{ width: sidebarWidth }} aria-hidden="true" />
    </>
  )
  
  return createPortal(overlay, document.body)
}

