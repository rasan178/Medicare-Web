import React, { createContext, useState } from 'react';
// import api from '../utils/api';

export const CartContext = createContext();

export function CartContextProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (medicine) => {
    const existingItem = cartItems.find(item => item._id === medicine._id);
    if (existingItem) {
      updateQuantity(medicine._id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  const updateQuantity = (id, qty) => {
    setCartItems(cartItems.map(item => 
      item._id === id ? { ...item, quantity: parseInt(qty) || 1 } : item
    ));
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const checkout = async () => {
    try {
      const requiresPrescription = cartItems.some(item => item.prescriptionRequired);
      console.log('Checkout:', { items: cartItems, requiresPrescription });
      // Mock API call
      // await api.post('/orders', { items: cartItems, requiresPrescription });
      setCartItems([]);
      closeCart();
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      openCart,
      closeCart,
      isOpen,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
}