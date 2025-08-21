const React = require('react');
const { useContext } = require('react');
const CartContext = require('../context/CartContext').CartContext;

module.exports = function CartButton(props) {
  const { openCart, cartItems } = useContext(CartContext);
  const count = cartItems.length;

  return React.createElement('button', { onClick: openCart, className: 'fixed bottom-4 left-4 bg-red-500 text-white rounded-full p-4' }, `Cart (${count})`);
}; 
