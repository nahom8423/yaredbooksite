import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ViewerPage() {
  const [darkMode] = useState(() => localStorage.getItem('darkMode') !== 'false')

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/books" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Books
          </Link>
          <h1 className="text-3xl font-bold mb-2">PDF Viewer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced PDF reader with bookmark and navigation features
          </p>
        </div>
        
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We're working on migrating the PDF viewer functionality to this new React interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/chat"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try AI Assistant
            </Link>
            <Link 
              to="/books"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}