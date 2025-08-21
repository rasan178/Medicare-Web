import React, { useState, useEffect } from 'react';
import OrderStatusTracker from '../../components/OrderStatusTracker';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../utils/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const reason = prompt('Please provide a reason for cancellation (optional):');
      await api.delete(`/orders/${orderId}/cancel`, {
        data: { reason: reason || 'Cancelled by user' }
      });
      
      // Refresh orders list
      fetchOrders();
      alert('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.msg || 'Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending Verification': 'bg-yellow-100 text-yellow-800',
      'Ready to Checkout': 'bg-blue-100 text-blue-800',
      'Paid': 'bg-green-100 text-green-800',
      'Processing': 'bg-indigo-100 text-indigo-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Declined': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-lg mt-4">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-4">No orders found</p>
              <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
              <a
                href="/store"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                      <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                      {order.deliveryMethod && (
                        <p className="text-sm text-gray-500">Delivery: {order.deliveryMethod}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {order.trackingStatus && (
                        <p className="text-sm text-gray-500 mt-1">Tracking: {order.trackingStatus}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-gray-700">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                          <div>
                            <span className="font-medium">
                              {item.medicineId?.name || item.name || 'Unknown Medicine'}
                            </span>
                            {item.medicineId?.brand && (
                              <span className="text-gray-500"> - {item.medicineId.brand}</span>
                            )}
                            {item.medicineId?.dosage && (
                              <span className="text-gray-500"> ({item.medicineId.dosage})</span>
                            )}
                            <span className="text-gray-600"> × {item.quantity}</span>
                          </div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.prescription && (
                    <div className="mt-4 pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        📄 Prescription uploaded: {order.prescription.split('/').pop()}
                      </p>
                    </div>
                  )}

                  {order.declineReason && (
                    <div className="mt-4 pt-2 border-t">
                      <p className="text-sm text-red-600">
                        <strong>Decline Reason:</strong> {order.declineReason}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                    <a
                      href={`/orders/${order._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </a>
                    
                    {order.status === 'Ready to Checkout' && (
                      <a
                        href={`/checkout?orderId=${order._id}`}
                        className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Complete Payment
                      </a>
                    )}
                    
                    {['Pending Verification', 'Ready to Checkout', 'Processing'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    
                    {order.status === 'Delivered' && (
                      <button className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors">
                        Reorder
                      </button>
                    )}

                    {order.paymentId && (
                      <span className="text-xs text-gray-500 px-2 py-2">
                        Payment ID: {order.paymentId}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Orders;