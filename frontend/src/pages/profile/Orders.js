const React = require('react');
const { useState, useEffect } = require('react');
const OrderStatusTracker = require('../../components/OrderStatusTracker');
const api = require('../../utils/api');

module.exports = function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(res => setOrders(res.data));
  }, []);

  return React.createElement('div', { className: 'p-4' },
    orders.map(order => React.createElement('div', { key: order._id },
      React.createElement('p', null, `Total: $${order.total}`),
      React.createElement(OrderStatusTracker, { status: order.status })
    ))
  );
}; 
