import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Info, Phone, Compass,CalendarCheck2 } from 'lucide-react';



const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };
    
    // Close menu when route changes
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleRouteChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleRouteChange);
    };
  }, [isMenuOpen, location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-500';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" aria-label="Main Navigation">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" aria-label="Go to homepage">
              <Compass className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-600">Zuru-TZ</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link to="/" className={`px-3 py-2 font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/')}`}>
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/tours" className={`px-3 py-2 font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/tours')}`}>
                <Map size={18} />
                <span>Tours</span>
              </Link>
                <Link to="/contact" className={`px-3 py-2 font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/contact')}`}>
                <CalendarCheck2 size={18} />
                <span>Book</span>
              </Link>
              <Link to="/about" className={`px-3 py-2 font-medium transition-colors duration-200 flex items-center gap-2 ${isActive('/about')}`}>
                <Info size={18} />
                <span>About Us</span>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-500 hover:bg-gray-100 "
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              <div className="relative w-6 h-6">
                {/* Hamburger to X animation */}
                <span 
                  className={`absolute h-0.5 w-6 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  }`} 
                />
                <span 
                  className={`absolute h-0.5 w-6 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`} 
                />
                <span 
                  className={`absolute h-0.5 w-6 bg-gray-600 transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, with smooth transition */}
      <div 
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-inner">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
              isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-500'
            }`}
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/tours"
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
              isActive('/tours') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-500'
            }`}
            aria-current={location.pathname === '/tours' ? 'page' : undefined}
          >
            <Map size={20} />
            <span>Tours</span>
          </Link>

          <Link
            to="/contact"
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
              isActive('/contact') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-500'
            }`}
            aria-current={location.pathname === '/contact' ? 'page' : undefined}
          >
            <CalendarCheck2 size={20} />
            <span>Book</span>
          </Link>

          <Link
            to="/about"
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
              isActive('/about') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-500'
            }`}
            aria-current={location.pathname === '/about' ? 'page' : undefined}
          >
            <Info size={20} />
            <span>About Us</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;