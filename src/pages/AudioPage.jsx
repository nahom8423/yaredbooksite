import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function AudioPage() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') !== 'false')
  const [currentView, setCurrentView] = useState('months')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedHoliday, setSelectedHoliday] = useState('')
  const [recordings, setRecordings] = useState([])
  const [currentRecording, setCurrentRecording] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [showSavedTracks, setShowSavedTracks] = useState(false)
  const [showMarkerPanel, setShowMarkerPanel] = useState(false)
  const [newMarkerTitle, setNewMarkerTitle] = useState('')
  const [newMarkerDescription, setNewMarkerDescription] = useState('')
  const [savedTracks, setSavedTracks] = useState(() => JSON.parse(localStorage.getItem('savedTracks') || '[]'))
  const [showHolidaySwitcher, setShowHolidaySwitcher] = useState(false)
  const audioRef = useRef(null)

  // Ethiopian calendar months with holidays
  const monthChannels = {
    "መስከረም": [
      "መስከረም-1-ዓውደ-ዓመት",
      "መስከረም-2-ምትረተ-ርእሱ-ቅዱስ-ዮሐንስ-መጥምቅ",
      "መስከረም-11-ፋሲለደስ",
      "መስከረም-17-መስቀል",
      "መስከረም-17-አስተርእዮተ-መስቀል",
      "መስከረም-21-ብዙኃን-ማርያም"
    ],
    "ጥቅምት": [
      "ጥቅምት-5-አቦ-አቡነ-ገብረ-መንፈስ-ቅዱስ",
      "ጥቅምንት-14-አቡነ-አረጋዊ",
      "ጥቅምት-27-መድኃኔዓለም"
    ],
    "ኅዳር": [
      "ኅዳር-6-ቊስቋም",
      "ኅዳር-7-ቅዳሴ-ቤቱ-ለጊዮርጊስ",
      "ኅዳር-8-አርባዕቱ-እንስሳ",
      "ኅዳር-11-ቅዳሴ-ሐና",
      "ኅዳር-12-ቅዱስ-ሚካኤል",
      "ኅዳር-13-አዕላፍ",
      "ኅዳር-21-ጽዮን",
      "ኅዳር-24-ካህናተ-ሰማይ",
      "ኅዳር-25-መርቆሬዎስ"
    ],
    "ታኅሣሥ": [
      "ታኅሣሥ-3-በዓታ-ለማርያም",
      "ታኅሣሥ-6-ቅድስት-አርሴማ",
      "ታኅሣሥ-12-አባ-ሳሙኤል",
      "ታኅሣሥ-13-ሩፋኤል",
      "ታኅሣሥ-19-ቅዱስ-ገብርኤል",
      "ታኅሣሥ-22-ደቅስዮስ",
      "ታኅሣሥ-24-ተክለ-ሃይማኖት",
      "ታኅሣሥ-28-አማኑኤል",
      "ታኅሣሥ-29-ዘልደት"
    ],
    "ጥር": [
      "ጥር-3-አቡነ-ሊባኖስ",
      "ጥር-4-ዮሐንስ-ወልደ-ነጎድጓድ",
      "ጥር-6-ዘግዝረት",
      "ጥር-7-ሥላሴ",
      "ጥር-11-ጥምቀት",
      "ጥር-12-ቃና-ዘገሊላ",
      "ጥር-13-እግዚአብሔር-አብ",
      "ጥር-15-ቂርቆስ",
      "ጥር-18-ጊዮርጊስ",
      "ጥር-21-አስተርእዮ-ማርያም",
      "ጥር-22-ዑራኤል"
    ],
    "የካቲት": [
      "የካቲት-8-ልደተ-ስምዖን",
      "የካቲት-16-ኪዳን-ምሕረት"
    ],
    "መጋቢት": [
      "መጋቢት-5-አቡነ-ገብረ-መንፈስ-ቅዱስ",
      "መጋቢት-10-መስቀል",
      "መጋቢት-27-መድሃኔዓለም",
      "መጋቢት-29-በዓለ-እግዚአብሔር"
    ],
    "ሚያዝያ": [
      "ሚያዝያ-21-ማርያም",
      "ሚያዝያ-23-ጊዮርጊስ",
      "ሚያዚያ-30-ማርቆስ"
    ],
    "ግንቦት": [
      "ግንቦት-1-ልደታ",
      "ግንቦት-11-ቅዱስ-ያሬድ",
      "ግንቦት-11-ያሬድ-ዘደብረ-ይባቤ",
      "ግንቦት-12-ተክለ-ሃይማኖት-ወክርስቶስ-ሠምራ",
      "ግንቦት-19-ዓቢየ-እግዚእ",
      "ግንቦት-21-ደብረ-ምጥማቅ-ማርያም"
    ],
    "ሰኔ": [
      "ሰኔ-12-ቅዱስ-ሚካኤል",
      "ሰኔ-21-ሕንፀተ-ቤታ-ለማርያም",
      "ሰኔ-26-ቅዳሴ-ቤቱ-ለቅዱስ-ገብርኤል"
    ],
    "ሐምሌ": [
      "ሐምሌ-4-ልደተ-ማርያም",
      "ሐምሌ-22-አብ-ወወልድ-ወመንፈስ-ቅዱስ"
    ],
    "ነሐሴ": [
      "ነሐሴ-13-በዓለ-ኢየሱስ",
      "ነሐሴ-16-መድኃኔዓለም"
    ]
  }

  // Watch dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // Update audio progress
  useEffect(() => {
    let interval = null
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          if (newTime >= duration) {
            setIsPlaying(false)
            return 0
          }
          setProgress((newTime / duration) * 100)
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const selectMonth = (month) => {
    setSelectedMonth(month)
    setCurrentView('holidays')
  }

  const selectHoliday = (holiday) => {
    setSelectedHoliday(holiday)
    setCurrentView('recordings')
    generateSampleRecordings(holiday)
  }

  const switchToHoliday = (holiday) => {
    setSelectedHoliday(holiday)
    generateSampleRecordings(holiday)
    setShowHolidaySwitcher(false)
  }

  const getCurrentMonthHolidays = () => {
    return monthChannels[selectedMonth] || []
  }

  const generateSampleRecordings = (holiday) => {
    const types = ['ቁም', 'አቋቋም', 'ወረብ']
    const chanters = ['ዲያቆን ሰለሞን ክብሮም', 'ዲያቆን ዮሐንስ አፈወርቅ', 'ዲያቆን ዘራሁን ከበደ']
    
    const newRecordings = []
    
    types.forEach((type, typeIndex) => {
      for (let i = 1; i <= 2; i++) {
        newRecordings.push({
          id: `${holiday}-${type}-${i}`,
          title: `${holiday.split('-').slice(-1)[0]} ${type} ${i}`,
          type: type,
          chanter: chanters[typeIndex],
          duration: `${Math.floor(Math.random() * 10) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          audioUrl: '#',
          markers: []
        })
      }
    })
    
    setRecordings(newRecordings)
  }

  const getRecordingsByType = (type) => {
    return recordings.filter(r => r.type === type)
  }

  const playRecording = (recording) => {
    setCurrentRecording(recording)
    setIsPlaying(true)
    setDuration(180) // 3 minutes mock duration
    setCurrentTime(0)
    setProgress(0)
    setShowSavedTracks(false)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const seek = (event) => {
    const rect = event.target.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    const newTime = percent * duration
    setCurrentTime(newTime)
    setProgress(percent * 100)
  }

  const seekToMarker = (time) => {
    setCurrentTime(time)
    setProgress((time / duration) * 100)
  }

  const addMarker = () => {
    if (!currentRecording || !newMarkerTitle.trim()) return
    
    if (!currentRecording.markers) {
      currentRecording.markers = []
    }
    
    const newMarker = {
      id: Date.now(),
      title: newMarkerTitle.trim(),
      description: newMarkerDescription.trim(),
      time: currentTime
    }
    
    currentRecording.markers.push(newMarker)
    currentRecording.markers.sort((a, b) => a.time - b.time)
    
    setNewMarkerTitle('')
    setNewMarkerDescription('')
    setCurrentRecording({ ...currentRecording })
  }

  const removeMarker = (markerId) => {
    if (!currentRecording?.markers) return
    
    currentRecording.markers = currentRecording.markers.filter(m => m.id !== markerId)
    setCurrentRecording({ ...currentRecording })
  }

  const saveTrack = (track) => {
    if (!track || savedTracks.find(t => t.id === track.id)) return
    
    const newSavedTracks = [...savedTracks, track]
    setSavedTracks(newSavedTracks)
    localStorage.setItem('savedTracks', JSON.stringify(newSavedTracks))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const previousTrack = () => {
    console.log('Previous track')
  }

  const nextTrack = () => {
    console.log('Next track')
  }

  const updateVolume = (value) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-24 ${darkMode ? 'dark' : ''}`}
         style={darkMode ? 
           {background: 'linear-gradient(135deg, #0a0a12 0%, #1f2937 50%, #0a0a12 100%)', color: '#f3f4f6'} :
           {background: 'linear-gradient(135deg, #fdf6e3 0%, #f8f4e6 50%, #fdf6e3 100%)', color: '#333333'}
         }>
      
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-900/95 border-gray-800 backdrop-blur-sm' : 'bg-white/95 border-gray-200 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </div>
            
            <div className="flex-1 flex justify-center px-4">
              <h1 className={`text-xl sm:text-2xl font-bold text-center ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                <span className="ethiopic">ዜማ ቤት</span> Recordings
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSavedTracks(!showSavedTracks)}
                className={`p-2 rounded-md transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                aria-label="Toggle saved tracks"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-md transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                aria-label="Toggle dark mode"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Months View */}
        {currentView === 'months' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ethiopic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                ዓመት
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Select a month from the Ethiopian calendar to explore liturgical recordings organized by holidays and feast days.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.entries(monthChannels).map(([month, holidays]) => (
                <div 
                  key={month}
                  className="month-card rounded-2xl p-8 text-center"
                  onClick={() => selectMonth(month)}
                >
                  <h3 className={`text-2xl font-bold mb-4 ethiopic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    {month}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {holidays.length} holidays
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {holidays.slice(0, 3).map((holiday, index) => (
                      <span 
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                      >
                        {holiday.split('-').slice(-1)[0]}
                      </span>
                    ))}
                    {holidays.length > 3 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        +{holidays.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Holidays View */}
        {currentView === 'holidays' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentView('months')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Months
              </button>
              
              <div className="text-center">
                <h2 className={`text-2xl font-bold ethiopic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  {selectedMonth}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ethiopian Orthodox Calendar
                </p>
              </div>
              
              <div></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentMonthHolidays().map((holiday) => (
                <div 
                  key={holiday}
                  className="recording-column cursor-pointer" 
                  onClick={() => selectHoliday(holiday)}
                >
                  <div className={`text-xl font-semibold mb-4 text-center ethiopic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    {holiday.split('-').slice(-1)[0]}
                  </div>
                  <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Click to view recordings
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recordings View */}
        {currentView === 'recordings' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setCurrentView('holidays')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Holidays
              </button>
              
              <div className="text-center">
                <button 
                  onClick={() => setShowHolidaySwitcher(true)}
                  className={`text-xl font-bold ethiopic hover:text-opacity-80 transition-colors cursor-pointer ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}
                >
                  {selectedHoliday ? selectedHoliday.split('-').slice(-1)[0] : ''}
                </button>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedMonth}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {currentRecording && (
                  <button 
                    onClick={() => setShowMarkerPanel(!showMarkerPanel)}
                    className={`p-2 rounded-md transition-colors duration-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                    aria-label="Toggle markers"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ቁም Column */}
              <div className="recording-column">
                <div className={`text-xl font-semibold mb-4 text-center ethiopic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  ቁም
                </div>
                {getRecordingsByType('ቁም').map((recording) => (
                  <div 
                    key={recording.id}
                    className="recording-item" 
                    onClick={() => playRecording(recording)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold text-base pr-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {recording.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {recording.duration}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Chanter: {recording.chanter}
                    </p>
                    <div className="recording-play-btn">
                      <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* አቋቋም Column */}
              <div className="recording-column">
                <div className={`text-xl font-semibold mb-4 text-center ethiopic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  አቋቋም
                </div>
                {getRecordingsByType('አቋቋም').map((recording) => (
                  <div 
                    key={recording.id}
                    className="recording-item" 
                    onClick={() => playRecording(recording)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold text-base pr-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {recording.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {recording.duration}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Chanter: {recording.chanter}
                    </p>
                    <div className="recording-play-btn">
                      <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* ወረብ Column */}
              <div className="recording-column">
                <div className={`text-xl font-semibold mb-4 text-center ethiopic ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  ወረብ
                </div>
                {getRecordingsByType('ወረብ').map((recording) => (
                  <div 
                    key={recording.id}
                    className="recording-item" 
                    onClick={() => playRecording(recording)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold text-base pr-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {recording.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {recording.duration}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Chanter: {recording.chanter}
                    </p>
                    <div className="recording-play-btn">
                      <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Holiday Switcher Modal */}
      {showHolidaySwitcher && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowHolidaySwitcher(false)}>
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-80 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-center text-white">Switch Holiday</h3>
            {getCurrentMonthHolidays().map((holiday) => (
              <button
                key={holiday}
                onClick={() => switchToHoliday(holiday)}
                className={`w-full p-3 mb-2 rounded-lg text-center ethiopic transition-colors ${
                  holiday === selectedHoliday ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-yellow-600'
                }`}
              >
                {holiday.split('-').slice(-1)[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mini Player */}
      {currentRecording && (
        <div className="mini-player">
          <div className="flex items-center justify-center gap-4 mb-2">
            <button className="nav-btn" onClick={previousTrack}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button className="nav-btn" onClick={togglePlayPause}>
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            <button className="nav-btn" onClick={nextTrack}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
          
          <div className="w-full max-w-lg mx-auto flex items-center gap-4">
            <span className="text-xs text-gray-400 min-w-[40px]">{formatTime(currentTime)}</span>
            <div className="flex-1 progress-bar" onClick={seek}>
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-xs text-gray-400 min-w-[40px]">{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center justify-between px-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">{currentRecording.title}</h4>
                <p className="text-xs text-gray-400 truncate">{currentRecording.chanter}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="volume-controls">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={volume}
                  onChange={(e) => updateVolume(parseFloat(e.target.value))}
                  className="volume-slider"
                />
              </div>
              
              <button 
                onClick={() => saveTrack(currentRecording)}
                className={`transition-colors ${savedTracks.find(t => t.id === currentRecording.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marker Panel */}
      {showMarkerPanel && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-gray-700 z-50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Time Markers</h3>
            <button 
              onClick={() => setShowMarkerPanel(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {currentRecording && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold mb-3 text-white">Add New Marker</h4>
              <input 
                type="text" 
                value={newMarkerTitle}
                onChange={(e) => setNewMarkerTitle(e.target.value)}
                placeholder="Marker title..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 mb-3"
                onKeyPress={(e) => e.key === 'Enter' && addMarker()}
              />
              <textarea 
                value={newMarkerDescription}
                onChange={(e) => setNewMarkerDescription(e.target.value)}
                placeholder="Description (optional)..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 mb-3 resize-none h-20"
              />
              <div className="flex gap-3">
                <button 
                  onClick={addMarker}
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
                >
                  Add at {formatTime(currentTime)}
                </button>
                <button 
                  onClick={() => {
                    setNewMarkerTitle('')
                    setNewMarkerDescription('')
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
          
          {currentRecording && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Current Track Markers</h4>
              {currentRecording.markers && currentRecording.markers.length > 0 ? (
                currentRecording.markers.map((marker) => (
                  <div key={marker.id} className="bg-gray-800 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-white">{marker.title}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-yellow-400">{formatTime(marker.time)}</span>
                        <button 
                          onClick={() => removeMarker(marker.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    {marker.description && (
                      <p className="text-sm text-gray-300 mb-2">{marker.description}</p>
                    )}
                    <button 
                      onClick={() => seekToMarker(marker.time)}
                      className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      Jump to time
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No markers for this track yet
                </div>
              )}
            </div>
          )}
          
          {!currentRecording && (
            <div className="text-center text-gray-400 py-12">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
              </svg>
              <p className="text-lg">No track playing</p>
              <p className="text-sm">Start playing a track to add markers</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden audio element for future integration */}
      <audio ref={audioRef} />
    </div>
  )
}