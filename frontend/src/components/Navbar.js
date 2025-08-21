// frontend/src/components/Navbar.js
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMenu}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 3h12l2 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5l2-2zM8 8v2h2v2h2V10h2V8h-2V6h-2v2H8zm4 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">MedCare</span>
              <span className="text-xs text-gray-500 -mt-1">Pharmacy</span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/store" 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
              </svg>
              <span>Store</span>
            </Link>
            <Link 
              to="/about" 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              <span>About</span>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Profile Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">Signed in</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={closeProfileMenu}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Profile
                      </Link>
                      <button
                        onClick={() => { logout(); closeProfileMenu(); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="py-4 space-y-2">
              <Link 
                to="/store" 
                onClick={closeMenu}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg mx-2 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                </svg>
                Store
              </Link>
              
              <Link 
                to="/about" 
                onClick={closeMenu}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg mx-2 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
                About
              </Link>

              {user ? (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center px-4 py-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-white">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">Signed in</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    onClick={closeMenu}
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg mx-2 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Profile
                  </Link>
                  
                  <button 
                    onClick={() => { logout(); closeMenu(); }}
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg mx-2 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                  <Link 
                    to="/login" 
                    onClick={closeMenu}
                    className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg mx-2 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 102 0V4a1 1 0 011-1zm7.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 9H7a1 1 0 100 2h6.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sign In
                  </Link>
                  
                  <Link 
                    to="/register" 
                    onClick={closeMenu}
                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mx-2 transition-colors duration-200 font-medium"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;