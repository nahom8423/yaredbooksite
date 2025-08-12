import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function WelcomeBg({ show }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <div className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-[#171717]" />
      <img
        src="/saintyared.png"
        alt=""
        className="welcome-mask absolute left-1/2 top-1/2 h-[min(90vh,90vw)] -translate-x-1/2 -translate-y-1/2 w-auto blur-2xl opacity-70"
      />
      <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-b from-transparent to-[#171717]" />
    </div>,
    document.body
  )
}

