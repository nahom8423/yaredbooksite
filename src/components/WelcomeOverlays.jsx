import { createPortal } from 'react-dom'

export default function WelcomeOverlays({ show = false, sidebarWidth = '256px' }) {
  const overlay = (
    <>
      <div
        className="welcome-bg"
        style={{ opacity: show ? 1 : 0, zIndex: -1 }}
        aria-hidden="true"
      />
      <div
        className="welcome-bg-sidebar"
        style={{ width: sidebarWidth, opacity: show ? 1 : 0, zIndex: -1 }}
        aria-hidden="true"
      />
    </>
  )
  return createPortal(overlay, document.body)
}

