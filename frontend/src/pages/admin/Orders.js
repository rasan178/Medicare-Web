import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import api from '../../utils/api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/orders');
      
      // Handle the response structure from your backend
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        // Fallback for direct array response
        setOrders(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    if (!orderId) return;
    
    try {
      await api.post(`/admin/orders/${orderId}/approve`);
      await fetchOrders(); // Refresh the list
      setShowDetails(false);
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order');
    }
  };

  const handleDecline = async (orderId) => {
    if (!orderId) return;
    
    const reason = prompt('Please enter a reason for declining this order:');
    if (!reason) return;

    try {
      await api.post(`/admin/orders/${orderId}/decline`, { reason });
      await fetchOrders(); // Refresh the list
      setShowDetails(false);
    } catch (error) {
      console.error('Error declining order:', error);
      alert('Failed to decline order');
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      if (response.data.success) {
        setSelectedOrder(response.data.order);
      } else {
        setSelectedOrder(response.data.order || response.data);
      }
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to fetch order details');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Verification':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready to Checkout':
        return 'bg-blue-100 text-blue-800';
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-100">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Order Management</h1>
            <button 
              onClick={fetchOrders}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">
                All Orders ({orders.length})
              </h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Items</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono">
                          {order._id.slice(-8)}...
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <p className="font-medium">{order.userId?.name || 'Unknown'}</p>
                            <p className="text-gray-500">{order.userId?.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          ${order.total?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order._id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View
                          </button>
                          {order.status === 'Pending Verification' && (
                            <>
                              <button
                                onClick={() => handleApprove(order._id)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDecline(order._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Order Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Total:</strong> ${selectedOrder.total?.toFixed(2)}</p>
                <p><strong>Date:</strong> {selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : 'N/A'}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Customer Information:</h4>
                <p><strong>Name:</strong> {selectedOrder.userId?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedOrder.userId?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.userId?.phone || 'N/A'}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Items Ordered:</h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                        <div>
                          <p className="font-medium">{item.medicineId?.name || 'Unknown Medicine'}</p>
                          <p className="text-sm text-gray-600">{item.medicineId?.brand}</p>
                        </div>
                        <div className="text-right">
                          <p>Qty: {item.quantity}</p>
                          <p>${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No items found</p>
                )}
              </div>

              {selectedOrder.prescription && (
                <div>
                  <h4 className="font-semibold mb-2">Prescription:</h4>
                  <p className="text-sm text-gray-600">File uploaded: {selectedOrder.prescription}</p>
                </div>
              )}

              {selectedOrder.status === 'Pending Verification' && (
                <div className="flex space-x-4 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedOrder._id)}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Approve Order
                  </button>
                  <button
                    onClick={() => handleDecline(selectedOrder._id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Decline Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;