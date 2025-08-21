// frontend/src/components/CartButton.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function CartButton() {
  const { cartItems, openCart } = useContext(CartContext);

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-50"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
      </svg>
      {cartItems && cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {cartItems.length}
        </span>
      )}
    </button>
  );
}

export default CartButton;