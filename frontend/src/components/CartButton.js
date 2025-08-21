import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function CartButton() {
  const { openCart, cartItems } = useContext(CartContext);
  const count = cartItems.length;

  return (
    <button 
      onClick={openCart}
      className="fixed bottom-4 right-4 bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition-colors z-50"
    >
      <div className="flex items-center space-x-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 3H4m2 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        {count > 0 && (
          <span className="bg-white text-red-500 rounded-full px-2 py-1 text-sm font-bold">
            {count}
          </span>
        )}
      </div>
    </button>
  );
}

export default CartButton;