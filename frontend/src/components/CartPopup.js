const React = require('react');
const { useContext } = require('react');
const CartContext = require('../context/CartContext').CartContext;

module.exports = function CartPopup() {
  const { cartItems, removeFromCart, updateQuantity, closeCart, checkout } = useContext(CartContext);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return React.createElement('div', { className: 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center' },
    React.createElement('div', { className: 'bg-white p-4 rounded' },
      React.createElement('h2', null, 'Cart'),
      cartItems.map(item => React.createElement('div', { key: item._id },
        React.createElement('p', null, item.name),
        React.createElement('input', { type: 'number', value: item.quantity, onChange: e => updateQuantity(item._id, e.target.value) }),
        React.createElement('button', { onClick: () => removeFromCart(item._id) }, 'Remove')
      )),
      React.createElement('p', null, `Total: $${total}`),
      React.createElement('button', { onClick: checkout, className: 'bg-green-500 p-2' }, 'Checkout'),
      React.createElement('button', { onClick: closeCart, className: 'bg-red-500 p-2 ml-2' }, 'Close')
    )
  );
}; 
