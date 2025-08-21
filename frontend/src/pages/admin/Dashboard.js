const React = require('react');
const Sidebar = require('../../components/admin/Sidebar');

module.exports = function Dashboard() {
  return React.createElement('div', { className: 'flex' },
    React.createElement(Sidebar),
    React.createElement('main', { className: 'p-4' }, 'Admin Dashboard')
  );
}; 
