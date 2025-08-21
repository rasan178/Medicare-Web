const React = require('react');
const { Link } = require('react-router-dom');

module.exports = function Sidebar() {
  return React.createElement('aside', { className: 'bg-gray-800 text-white p-4' },
    React.createElement('ul', null,
      React.createElement('li', null, React.createElement(Link, { to: '/admin/dashboard' }, 'Dashboard')),
      React.createElement('li', null, React.createElement(Link, { to: '/admin/products' }, 'Products')),
      React.createElement('li', null, React.createElement(Link, { to: '/admin/orders' }, 'Orders')),
      React.createElement('li', null, React.createElement(Link, { to: '/admin/reports' }, 'Reports'))
    )
  );
}; 
