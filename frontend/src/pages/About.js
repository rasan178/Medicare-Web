const React = require('react');
const Navbar = require('../components/Navbar');
const Footer = require('../components/Footer');

module.exports = function About() {
  return React.createElement('div', null,
    React.createElement(Navbar),
    React.createElement('section', { className: 'p-8' }, 'About Our Pharmacy...'),
    React.createElement(Footer)
  );
}; 
