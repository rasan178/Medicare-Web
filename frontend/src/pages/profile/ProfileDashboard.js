const React = require('react');
const { useContext } = require('react');
const AuthContext = require('../../context/AuthContext').AuthContext;
const { Link } = require('react-router-dom');

module.exports = function ProfileDashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return React.createElement('p', null, 'Loading...');

  return React.createElement('div', { className: 'p-4' },
    React.createElement('h2', null, 'Account Info'),
    React.createElement('p', null, user.name),
    React.createElement('p', null, user.email),
    React.createElement('p', null, user.phone),
    React.createElement('p', null, user.address),
    React.createElement(Link, { to: '/profile/medical' }, 'Medical Info'),
    React.createElement(Link, { to: '/profile/orders' }, 'Orders')
  );
}; 
