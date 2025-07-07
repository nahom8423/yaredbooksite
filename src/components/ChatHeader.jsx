import sidebarIcon from '../assets/icons/sidebar.png'

export default function ChatHeader({ isMobile, onMenuToggle, saintYaredMode, onToggleSaintYaredMode }) {
  return (
    <div className={`px-4 py-3 flex items-center justify-between md:justify-center ${saintYaredMode ? 'saint-yared-content' : 'bg-[#1A0F08]'}`}>
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          onClick={onMenuToggle}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#2F1B12] transition-colors"
        >
          <img src={sidebarIcon} alt="Toggle sidebar" className="w-4 h-4" />
        </button>
      )}
      
      {/* Title - only show on mobile */}
      {isMobile && (
        <h1 className="text-white font-medium text-lg">Kidus Yared</h1>
      )}
      
      {/* Saint Yared Mode Toggle - Right side */}
      {isMobile ? (
        <button 
          onClick={onToggleSaintYaredMode}
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${saintYaredMode ? 'bg-[#3D251A] text-white' : 'hover:bg-[#2F1B12]'}`}
          title={saintYaredMode ? 'Disable Saint Yared Background' : 'Enable Saint Yared Background'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
          </svg>
        </button>
      ) : (
        <div className="absolute right-4 top-3">
          <button 
            onClick={onToggleSaintYaredMode}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${saintYaredMode ? 'bg-[#3D251A] text-white' : 'hover:bg-[#2F1B12] text-gray-300'}`}
            title={saintYaredMode ? 'Disable Saint Yared Background' : 'Enable Saint Yared Background'}
          >
            {saintYaredMode ? 'Saint Yared Mode' : 'Classic Mode'}
          </button>
        </div>
      )}
    </div>
  );
}