// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">
            🏥 Pharmacy
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/store" className="hover:text-blue-200 transition-colors">
              Store
            </Link>
            <Link to="/about" className="hover:text-blue-200 transition-colors">
              About
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="hover:text-blue-200 transition-colors">
                  Profile
                </Link>
                <Link to="/cart" className="hover:text-blue-200 transition-colors relative">
                  Cart
                  {cartItems && cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <span className="text-blue-200">Hello, {user.name}</span>
                <button 
                  onClick={logout} 
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-blue-200 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;