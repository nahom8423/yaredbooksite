import sidebarIcon from '../assets/icons/sidebar.png'
import settingsIcon from '../assets/icons/settings.png'

export default function ChatHeader({ isMobile, onMenuToggle, saintYaredMode, onToggleSaintYaredMode, currentTheme, onToggleSettings }) {
  return (
    <div 
      className={`px-4 py-3 flex items-center justify-between md:justify-center ${saintYaredMode ? 'saint-yared-content' : 'bg-[#171717]'}`}
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
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
          <button 
            onClick={onToggleSettings}
            className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
            style={{ backgroundColor: currentTheme.hover }}
            onMouseEnter={(e) => e.target.style.backgroundColor = currentTheme.button}
            onMouseLeave={(e) => e.target.style.backgroundColor = currentTheme.hover}
            title="Settings"
          >
            <img src={settingsIcon} alt="Settings" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile placeholder */}
      {isMobile && <div className="w-8 h-8" />}
    </div>
  );
}