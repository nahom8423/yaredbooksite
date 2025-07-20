import { Link } from 'react-router-dom'
import { ChatApp } from '../App'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#171717]">
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </Link>
      </div>
      
      {/* Existing Chat App */}
      <ChatApp />
    </div>
  )
}