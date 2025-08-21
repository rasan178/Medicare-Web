const React = require('react');
const { Link } = require('react-router-dom');

module.exports = function AdminNavbar() {
  return React.createElement('nav', { className: 'bg-blue-700 p-4 text-white' },
    React.createElement('h1', null, 'Admin Panel'),
    React.createElement(Link, { to: '/admin/logout' }, 'Logout')
  );
}; 
