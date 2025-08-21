// frontend/src/pages/admin/Orders.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import api from '../../utils/api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/admin/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/orders/${id}/approve`);
      // Refresh orders list
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  const handleDecline = async (id) => {
    try {
      await api.post(`/admin/orders/${id}/decline`);
      // Refresh orders list
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error declining order:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-6">Order Management</h1>
          
          {loading ? (
            <div className="text-center">Loading orders...</div>
          ) : (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center text-gray-500">No orders found</div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Order ID: {order._id}</p>
                        <p className="text-gray-600">Status: 
                          <span className={`ml-1 px-2 py-1 rounded text-sm ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </p>
                        {order.customerName && <p className="text-gray-600">Customer: {order.customerName}</p>}
                        {order.total && <p className="text-gray-600">Total: ${order.total}</p>}
                      </div>
                      <div className="space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(order._id)}
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecline(order._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminOrders;