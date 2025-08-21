const React = require('react');
const { useState, useEffect } = require('react');
const Sidebar = require('../../components/admin/Sidebar');
const api = require('../../utils/api');

module.exports = function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/admin/orders').then(res => setOrders(res.data));
  }, []);

  const approve = (id) => api.post(`/admin/orders/${id}/approve`).then(() => window.location.reload());
  const decline = (id) => api.post(`/admin/orders/${id}/decline`).then(() => window.location.reload());

  return React.createElement('div', { className: 'flex' },
    React.createElement(Sidebar),
    React.createElement('main', { className: 'p-4' },
      orders.map(order => React.createElement('div', { key: order._id },
        React.createElement('p', null, order.status),
        React.createElement('button', { onClick: () => approve(order._id) }, 'Approve'),
        React.createElement('button', { onClick: () => decline(order._id) }, 'Decline')
      ))
    )
  );
}; 
