const React = require('react');

module.exports = function OrderStatusTracker(props) {
  const { status } = props;

  return React.createElement('div', { className: 'p-2 bg-yellow-200' }, `Status: ${status}`);
}; 
