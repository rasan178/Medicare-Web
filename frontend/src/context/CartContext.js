const React = require('react');
const { createContext, useState } = require('react');
const api = require('../utils/api');

const CartContext = createContext();

function CartContextProvider(props) {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (medicine) => setCartItems([...cartItems, { ...medicine, quantity: 1 }]);
  const removeFromCart = (id) => setCartItems(cartItems.filter(item => item._id !== id));
  const updateQuantity = (id, qty) => setCartItems(cartItems.map(item => item._id === id ? { ...item, quantity: parseInt(qty) } : item));
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const checkout = () => {
    const requiresPrescription = cartItems.some(item => item.prescriptionRequired);
    api.post('/orders', { items: cartItems, requiresPrescription }).then(res => {
      // Handle prescription upload if needed, then checkout
      setCartItems([]);
    });
  };

  return React.createElement(CartContext.Provider, { value: { cartItems, addToCart, removeFromCart, updateQuantity, openCart, closeCart, isOpen, checkout } }, props.children);
}

module.exports = { CartContext, CartContextProvider }; 
