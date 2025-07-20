import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') !== 'false'
  })
  const [showStickyNav, setShowStickyNav] = useState(false)

  // Watch dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // Setup scroll listener for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const heroHeight = 600 // Approximate hero height
      
      if (currentScrollY > heroHeight * 0.8) {
        setShowStickyNav(true)
      } else {
        setShowStickyNav(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const saintYaredSVG = (
    <svg className="w-20 h-20 text-current" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <circle cx="50" cy="30" r="8" fill="currentColor"/>
      <rect x="46" y="38" width="8" height="35" fill="currentColor" rx="2"/>
      <rect x="35" y="45" width="30" height="4" fill="currentColor" rx="2"/>
      <circle cx="35" cy="47" r="3" fill="currentColor"/>
      <circle cx="65" cy="47" r="3" fill="currentColor"/>
      <path d="M42 60 Q50 65 58 60" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="30" cy="35" r="2" fill="currentColor" opacity="0.7"/>
      <circle cx="70" cy="35" r="2" fill="currentColor" opacity="0.7"/>
      <circle cx="25" cy="55" r="2" fill="currentColor" opacity="0.7"/>
      <circle cx="75" cy="55" r="2" fill="currentColor" opacity="0.7"/>
      <path d="M20 70 Q30 75 40 70" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M60 70 Q70 75 80 70" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
    </svg>
  )

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}
         style={darkMode ? 
           {background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)', color: '#e5e5e5'} :
           {background: 'linear-gradient(135deg, #fdf6e3 0%, #f8f4e6 50%, #fdf6e3 100%)', color: '#333333'}
         }>
      
      {/* Sticky Navigation */}
      {showStickyNav && (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl"
             style={darkMode ? 
               {background: 'rgba(15, 15, 15, 0.9)'} : 
               {background: 'rgba(253, 246, 227, 0.9)'}
             }>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className={darkMode ? 'text-yellow-400' : 'text-yellow-700'}>
                  {saintYaredSVG}
                </div>
                <div>
                  <h2 className={`ethiopic text-lg font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    ዜማ ቤት
                  </h2>
                  <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Orthodox Hub
                  </p>
                </div>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link to="/books" className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  Books
                </Link>
                <Link to="/audio" className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                  </svg>
                  Audio
                </Link>
                
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                  title="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      {/* Main Header */}
      <header className="relative z-10 pt-8">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4">
              <div className={darkMode ? 'text-yellow-400' : 'text-yellow-700'}>
                {saintYaredSVG}
              </div>
              <div>
                <h1 className={`ethiopic text-2xl sm:text-3xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  ዜማ ቤት
                </h1>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ethiopian Orthodox Hub
                </p>
              </div>
            </Link>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30' : 'bg-gray-800/10 text-gray-700 hover:bg-gray-800/20'}`}
            >
              {darkMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
              <span className={`ethiopic block mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                የቅዱስ ያሬድ ቤት
              </span>
              <span className={`block text-2xl sm:text-3xl lg:text-4xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Saint Yared's Digital Sanctuary
              </span>
            </h2>
            
            <p className={`text-lg sm:text-xl lg:text-2xl mb-12 max-w-4xl mx-auto font-light leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your complete Ethiopian Orthodox hub for sacred texts, liturgical music, and spiritual guidance. 
              Experience the richness of our tradition through modern digital tools.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/books" className="btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
                    color: '#1f2937',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                  }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Explore Sacred Books
            </Link>
            
            <Link to="/audio" className="btn-secondary inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
              </svg>
              Listen to Zema
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Discover Our Digital Sanctuary
            </h3>
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Immerse yourself in the beauty of Ethiopian Orthodox tradition through our comprehensive digital platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sacred Books */}
            <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'}`}>
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h4 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Sacred Books Library
              </h4>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Access ancient manuscripts and religious texts with advanced reading features including zoom, bookmarks, and mobile optimization.
              </p>
              <Link to="/books" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium">
                <span>Explore Books</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* Audio */}
            <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'}`}>
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                </svg>
              </div>
              <h4 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Liturgical Recordings
              </h4>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Listen to authentic Ethiopian Orthodox chants organized by calendar months with ቁም, አቋቋም, and ወረብ recording types.
              </p>
              <Link to="/audio" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                <span>Listen Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            {/* AI Assistant */}
            <div className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'}`}>
              <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h4 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                AI Assistant
              </h4>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get personalized guidance on Ethiopian Orthodox tradition, liturgy, and theology from our knowledgeable AI assistant.
              </p>
              <Link to="/chat" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                <span>Chat Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className={`py-20 lg:py-32 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Join Our Growing Community
          </h3>
          <p className={`text-lg sm:text-xl mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Connect with fellow believers, scholars, and anyone interested in Ethiopian Orthodox tradition. 
            Share insights, ask questions, and help grow our digital sanctuary.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="https://discord.gg/AT8C5Jwyez" 
               target="_blank"
               rel="noopener noreferrer"
               className="btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
               style={{
                 background: 'linear-gradient(135deg, #D4AF37, #B8941F)',
                 color: '#1f2937',
                 boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
               }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z"/>
              </svg>
              Join Discord Community
            </a>
            
            <a href="mailto:contact@zemabet.org" 
               className="btn-secondary inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Contact Us
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`py-12 border-t ${darkMode ? 'border-gray-800 bg-gray-900/30' : 'border-gray-200 bg-white/30'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className={`opacity-60 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                <svg className="w-10 h-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                  <circle cx="50" cy="30" r="8" fill="currentColor"/>
                  <rect x="46" y="38" width="8" height="35" fill="currentColor" rx="2"/>
                  <rect x="35" y="45" width="30" height="4" fill="currentColor" rx="2"/>
                  <circle cx="35" cy="47" r="3" fill="currentColor"/>
                  <circle cx="65" cy="47" r="3" fill="currentColor"/>
                  <path d="M42 60 Q50 65 58 60" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="30" cy="35" r="2" fill="currentColor" opacity="0.7"/>
                  <circle cx="70" cy="35" r="2" fill="currentColor" opacity="0.7"/>
                  <circle cx="25" cy="55" r="2" fill="currentColor" opacity="0.7"/>
                  <circle cx="75" cy="55" r="2" fill="currentColor" opacity="0.7"/>
                  <path d="M20 70 Q30 75 40 70" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <path d="M60 70 Q70 75 80 70" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
                </svg>
              </div>
              <div>
                <h4 className={`ethiopic font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  ዜማ ቤት
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ethiopian Orthodox Digital Hub
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2024 ዜማ ቤት - Preserving tradition through technology
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Built with love for the Ethiopian Orthodox community
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}