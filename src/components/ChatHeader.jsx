import sidebarIcon from '../assets/icons/sidebar.png'

export default function ChatHeader({ isMobile, onMenuToggle }) {
  return (
    <div className="bg-[#2C1810] px-4 py-3 flex items-center justify-between md:justify-center">
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          onClick={onMenuToggle}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#4A3326] transition-colors"
        >
          <img src={sidebarIcon} alt="Toggle sidebar" className="w-4 h-4" />
        </button>
      )}
      
      {/* Title - only show on mobile */}
      {isMobile && (
        <h1 className="text-white font-medium text-lg">Kidus Yared</h1>
      )}
      
      {/* Right side - placeholder for mobile */}
      {isMobile && <div className="w-8 h-8" />}
    </div>
  );
}