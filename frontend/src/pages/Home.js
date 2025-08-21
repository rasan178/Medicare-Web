const React = require('react');
const Navbar = require('../components/Navbar');
const Footer = require('../components/Footer');
const { Link } = require('react-router-dom');

module.exports = function Home() {
  return React.createElement('div', null,
    React.createElement(Navbar),
    React.createElement('section', { className: 'hero bg-blue-200 p-8' },
      React.createElement('h1', null, 'Welcome to Pharmacy'),
      React.createElement('p', null, 'Featured Medicines'),
      React.createElement(Link, { to: '/store', className: 'bg-blue-500 p-2' }, 'Shop Now')
    ),
    React.createElement(Footer)
  );
}; 
