const React = require('react');
const { Link } = require('react-router-dom');

module.exports = function Navbar() {
  return React.createElement('nav', { className: 'bg-blue-500 p-4 text-white' },
    React.createElement('ul', { className: 'flex space-x-4' },
      React.createElement('li', null, React.createElement(Link, { to: '/' }, 'Home')),
      React.createElement('li', null, React.createElement(Link, { to: '/store' }, 'Store')),
      React.createElement('li', null, React.createElement(Link, { to: '/about' }, 'About')),
      React.createElement('li', null, React.createElement(Link, { to: '/profile' }, 'Profile')),
      React.createElement('li', null, React.createElement(Link, { to: '/login' }, 'Login')),
      React.createElement('li', null, React.createElement(Link, { to: '/register' }, 'Register'))
    )
  );
};
