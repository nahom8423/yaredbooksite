import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function BooksPage() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') !== 'false')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const navigate = useNavigate()

  // Watch dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // Load books data
  useEffect(() => {
    const loadBooks = () => {
      setTimeout(() => {
        const booksData = [
          {
            id: 1,
            titleAmharic: 'ይትባሃል ዘቅድስት ቤተልሔም',
            titleEnglish: 'Celebration of Saint Bethlehem',
            description: 'A sacred text celebrating the holy place of Bethlehem and its significance in Ethiopian Orthodox tradition. Contains prayers, hymns, and spiritual reflections.',
            pages: 120,
            language: 'Amharic/Ge\'ez',
            available: true,
            fileName: 'yitbehalzekidistbetelehem.pdf'
          },
          {
            id: 2,
            titleAmharic: 'መጽሐፈ ቅዱሳን',
            titleEnglish: 'Book of Saints',
            description: 'A comprehensive collection of the lives and miracles of Ethiopian Orthodox saints. Essential reading for understanding the spiritual heritage of the church.',
            pages: 200,
            language: 'Amharic/Ge\'ez',
            available: false,
            fileName: null
          },
          {
            id: 3,
            titleAmharic: 'መዝሙረ ዳዊት',
            titleEnglish: 'Psalms of David',
            description: 'The complete Psalms as used in Ethiopian Orthodox liturgy, with traditional commentaries and musical notations for proper chanting.',
            pages: 150,
            language: 'Ge\'ez',
            available: false,
            fileName: null
          },
          {
            id: 4,
            titleAmharic: 'ድርሳነ ሚካኤል',
            titleEnglish: 'Homily of Michael',
            description: 'Sacred homilies and teachings attributed to the Archangel Michael, including liturgical texts and spiritual guidance.',
            pages: 180,
            language: 'Amharic',
            available: false,
            fileName: null
          },
          {
            id: 5,
            titleAmharic: 'ሰላሳዊት መጽሐፍ',
            titleEnglish: 'Book of Hours',
            description: 'Daily prayers and liturgical hours as prescribed by the Ethiopian Orthodox Church. Includes morning, evening, and night prayers.',
            pages: 80,
            language: 'Amharic/Ge\'ez',
            available: false,
            fileName: null
          },
          {
            id: 6,
            titleAmharic: 'መጽሐፈ ሄኖክ',
            titleEnglish: 'Book of Enoch',
            description: 'The Ethiopian version of the Book of Enoch, preserved in Ge\'ez. One of the most important non-canonical texts in Ethiopian Christianity.',
            pages: 250,
            language: 'Ge\'ez',
            available: false,
            fileName: null
          },
          {
            id: 7,
            titleAmharic: 'ዜማ ዘዳዊት',
            titleEnglish: 'Chants of David',
            description: 'Traditional Ethiopian Orthodox chants and musical notations for the Psalms of David, essential for liturgical music training.',
            pages: 95,
            language: 'Ge\'ez/Amharic',
            available: false,
            fileName: null
          },
          {
            id: 8,
            titleAmharic: 'ትምህርተ ኪዳን',
            titleEnglish: 'Covenant Teachings',
            description: 'Fundamental teachings about the Old and New Covenant in Ethiopian Orthodox theology, with commentaries from church fathers.',
            pages: 165,
            language: 'Amharic',
            available: false,
            fileName: null
          }
        ]
        
        setBooks(booksData)
        setFilteredBooks(booksData)
        setLoading(false)
      }, 1000)
    }
    
    loadBooks()
  }, [])

  // Filter books based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books)
      return
    }
    
    const query = searchQuery.toLowerCase()
    const filtered = books.filter(book => 
      book.titleAmharic.toLowerCase().includes(query) ||
      book.titleEnglish.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query) ||
      book.language.toLowerCase().includes(query)
    )
    setFilteredBooks(filtered)
  }, [searchQuery, books])

  const openBook = (book) => {
    if (!book.available) {
      alert(`"${book.titleEnglish}" is coming soon! Join our Discord community to stay updated.`)
      return
    }
    
    // For now, only the first book works
    if (book.id === 1) {
      navigate('/viewer')
    } else {
      alert(`"${book.titleEnglish}" is coming soon! Join our Discord community to stay updated.`)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}
         style={darkMode ? 
           {background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)', color: '#f3f4f6'} :
           {background: 'linear-gradient(135deg, #fdf6e3 0%, #f8f4e6 50%, #fdf6e3 100%)', color: '#333333'}
         }>
      
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-900/95 border-gray-800 backdrop-blur-sm' : 'bg-white/95 border-gray-200 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Back to Home */}
            <div className="flex items-center gap-4">
              <Link to="/" className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </div>
            
            {/* Center - Title */}
            <div className="flex-1 text-center px-4">
              <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                <span className="ethiopic">ዜማ ቤት</span> Library
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredBooks.length} sacred books available
              </p>
            </div>
            
            {/* Right - Dark Mode Toggle */}
            <div className="flex items-center">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-md transition-colors duration-200 ${darkMode ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
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
      </header>
      
      {/* Search Section */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text" 
              placeholder="Search sacred books and manuscripts..."
              className={`block w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20'}`}
            />
          </div>
          
          {/* Search Results Info */}
          {searchQuery.length > 0 && (
            <div className="mt-4 text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredBooks.length > 0 ? (
                  <>
                    Found <strong>{filteredBooks.length}</strong> book{filteredBooks.length !== 1 ? 's' : ''} 
                    matching "<strong>{searchQuery}</strong>"
                  </>
                ) : (
                  <>
                    No books found matching "<strong>{searchQuery}</strong>"
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Books Grid */}
      <main className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-yellow-400' : 'border-yellow-600'}`}></div>
            </div>
          )}
          
          {/* Books Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredBooks.map((book, index) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  index={index}
                  darkMode={darkMode}
                  onClick={() => openBook(book)}
                />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && filteredBooks.length === 0 && searchQuery.length === 0 && (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg className={`w-16 h-16 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No Books Available Yet
              </h3>
              <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                Our collection is growing. Check back soon for more sacred texts.
              </p>
            </div>
          )}
          
          {/* No Search Results */}
          {!loading && filteredBooks.length === 0 && searchQuery.length > 0 && (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg className={`w-16 h-16 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                No Results Found
              </h3>
              <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                Try adjusting your search terms or browse all available books.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Book Card Component
function BookCard({ book, index, darkMode, onClick }) {
  return (
    <div 
      className={`book-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer animate-scale-in ${darkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white/90 hover:bg-white shadow-lg'}`}
      onClick={onClick}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Book Cover */}
      <div className="relative h-64 sm:h-72 overflow-hidden">
        {/* PDF Preview */}
        <div className={`absolute inset-0 m-4 rounded border ${darkMode ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'}`}>
          {/* Ethiopian Title */}
          <div className="absolute top-2 left-2 right-2 text-center">
            <div className="ethiopic text-xs font-semibold text-yellow-600 leading-tight">
              {book.titleAmharic}
            </div>
          </div>
          
          {/* Simulated Text Lines */}
          <div className="absolute top-8 left-6 right-6 space-y-2">
            <div className="h-0.5 bg-gray-300 rounded" style={{ width: '80%' }}></div>
            <div className="h-0.5 bg-gray-300 rounded" style={{ width: '65%' }}></div>
            <div className="h-0.5 bg-gray-300 rounded" style={{ width: '90%' }}></div>
            <div className="h-0.5 bg-gray-300 rounded" style={{ width: '70%' }}></div>
            <div className="h-0.5 bg-gray-300 rounded" style={{ width: '85%' }}></div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full shadow-lg ${book.available ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'}`}>
            {book.available ? 'Available' : 'Coming Soon'}
          </span>
        </div>
        
        {/* Page Count Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className={`px-2 py-1 text-xs font-medium rounded ${darkMode ? 'bg-gray-800/80 text-gray-300' : 'bg-white/80 text-gray-700'}`}>
            {book.pages} pages
          </span>
        </div>
      </div>
      
      {/* Book Info */}
      <div className="p-6">
        {/* Title */}
        <h3 className={`font-bold text-lg mb-2 leading-tight ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          <span className="ethiopic">{book.titleAmharic}</span>
        </h3>
        
        {/* English Title */}
        <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {book.titleEnglish}
        </p>
        
        {/* Description */}
        <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {book.description}
        </p>
        
        {/* Metadata */}
        <div className={`flex items-center justify-between text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <span>{book.pages} pages</span>
          <span>{book.language}</span>
        </div>
        
        {/* Action Button */}
        <button 
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${book.available 
            ? (darkMode ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900' : 'bg-yellow-600 hover:bg-yellow-500 text-white')
            : (darkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
          }`}
          disabled={!book.available}
        >
          {book.available ? 'Read Now' : 'Coming Soon'}
        </button>
      </div>
    </div>
  )
}