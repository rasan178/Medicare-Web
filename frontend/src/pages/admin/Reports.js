const React = require('react');
const Sidebar = require('../../components/admin/Sidebar');
const api = require('../../utils/api');

module.exports = function Reports() {
  const generatePDF = () => window.location.href = '/api/admin/reports?type=pdf';
  const generateExcel = () => window.location.href = '/api/admin/reports?type=excel';

  return React.createElement('div', { className: 'flex' },
    React.createElement(Sidebar),
    React.createElement('main', { className: 'p-4' },
      React.createElement('button', { onClick: generatePDF }, 'Export PDF'),
      React.createElement('button', { onClick: generateExcel }, 'Export Excel')
    )
  );
}; 
