import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

function CartButton() {
  const { cartItems, openCart } = useContext(CartContext);
  const itemCount = cartItems ? cartItems.length : 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={openCart}
        className="group relative bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        
        {/* Cart Icon */}
        <div className="relative">
          <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Pulse Animation for New Items */}
          {itemCount > 0 && (
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></div>
          )}
        </div>

        {/* Item Count Badge */}
        {itemCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[24px] h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
            <span className="px-1">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          </div>
        )}

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300 -z-10 scale-150"></div>
      </button>

      {/* Floating Label */}
      {itemCount === 0 && (
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Your cart is empty
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
      
      {itemCount > 0 && (
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartButton;