import sidebarIcon from '../assets/icons/sidebar.png'

export default function ChatHeader({ isMobile, onMenuToggle, saintYaredMode, onToggleSaintYaredMode, currentTheme, onToggleSettings }) {
  return (
    <div 
      className={`px-4 py-3 flex items-center justify-between md:justify-center ${saintYaredMode ? 'saint-yared-content' : ''}`}
      style={!saintYaredMode ? { backgroundColor: currentTheme.background } : {}}
    >
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
      
      {/* Desktop Settings Button */}
      {!isMobile && (
        <div className="absolute right-4 top-3">
          <button 
            onClick={onToggleSettings}
            className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
            style={{ backgroundColor: currentTheme.hover }}
            onMouseEnter={(e) => e.target.style.backgroundColor = currentTheme.button}
            onMouseLeave={(e) => e.target.style.backgroundColor = currentTheme.hover}
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="m12 1 0 6m0 6 0 6"/>
              <path d="m21 12-6 0m-6 0-6 0"/>
            </svg>
          </button>
        </div>
      )}

      {/* Mobile placeholder */}
      {isMobile && <div className="w-8 h-8" />}
    </div>
  );
}