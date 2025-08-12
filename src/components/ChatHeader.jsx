import sidebarIcon from '../assets/icons/sidebar.png'
import settingsIcon from '../assets/icons/settings.png'
import saintYaredImage from '../assets/images/saintyared.png'

export default function ChatHeader({ isMobile, isWelcome = false, onMenuToggle }) {
  const containerClass = isMobile
    ? `fixed top-0 left-0 right-0 z-30`
    : `sticky top-0 z-30`
  return (
    <div
      className={`${containerClass} px-4 py-3 ${isWelcome ? 'bg-transparent' : 'bg-[#171717]'} flex items-center justify-between md:justify-center`}
      style={isMobile ? { paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' } : undefined}
    >
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          onClick={onMenuToggle}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#2A2A2A] transition-colors"
        >
          <img src={sidebarIcon} alt="Toggle sidebar" className="w-4 h-4" />
        </button>
      )}
      
      {/* Title - only show on mobile */}
      {isMobile && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img src={saintYaredImage} alt="Kidus Yared" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-white font-medium text-lg">Kidus Yared</h1>
        </div>
      )}
      

      {/* Mobile placeholder */}
      {isMobile && <div className="w-8 h-8" />}
    </div>
  );
}
