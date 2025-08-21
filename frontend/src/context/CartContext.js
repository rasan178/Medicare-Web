// frontend/src/context/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (medicine) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === medicine._id);
      if (existingItem) {
        return prev.map(item =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...medicine, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (medicineId) => {
    setCartItems(prev => prev.filter(item => item._id !== medicineId));
  };

  const updateQuantity = (medicineId, quantity) => {
    const qty = parseInt(quantity);
    if (qty <= 0) {
      removeFromCart(medicineId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item._id === medicineId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const clearCart = () => setCartItems([]);

  const checkout = async () => {
    try {
      const items = cartItems.map(item => ({
        medicineId: item._id,
        quantity: item.quantity
      }));

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ items }),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        closeCart();
        alert(`Order created successfully! Order ID: ${data.orderId}`);
      } else {
        const error = await response.json();
        alert(error.msg || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const value = {
    cartItems,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    openCart,
    closeCart,
    clearCart,
    checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};