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
      'Pending Verification': 'bg-[#1B56FD]/10 text-[#1B56FD] border-[#1B56FD]/20',
      'Ready to Checkout': 'bg-[#1B56FD]/10 text-[#1B56FD] border-[#1B56FD]/20',
      'Paid': 'bg-[#1B56FD]/20 text-[#1B56FD] border-[#1B56FD]/30',
      'Processing': 'bg-[#1B56FD]/15 text-[#1B56FD] border-[#1B56FD]/25',
      'Shipped': 'bg-[#1B56FD]/25 text-[#1B56FD] border-[#1B56FD]/35',
      'Delivered': 'bg-[#1B56FD]/30 text-[#1B56FD] border-[#1B56FD]/40',
      'Cancelled': 'bg-gray-100 text-gray-700 border-gray-300',
      'Declined': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending Verification': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Ready to Checkout': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
      ),
      'Paid': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Processing': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      'Shipped': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      'Delivered': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      'Cancelled': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      'Declined': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[status] || icons['Pending Verification'];
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-[#1B56FD] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1B56FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-lg mt-6 font-medium text-gray-700">Loading your medical orders...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your order history</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1B56FD] to-[#3B82F6] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-12">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Medical Orders</h1>
              <p className="text-xl text-white/90">Track your healthcare purchases and prescriptions</p>
              <p className="text-white/70 mt-1">Secure order management for your medical needs</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {error && (
            <div className="bg-white border-l-4 border-red-500 rounded-r-xl shadow-lg p-6 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Error Loading Orders</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#1B56FD]/10 to-[#1B56FD]/5 rounded-full mx-auto mb-8 flex items-center justify-center">
                <svg className="w-16 h-16 text-[#1B56FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
              <p className="text-gray-600 text-lg mb-2">You haven't placed any medical orders yet.</p>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Browse our pharmacy to find the medications and healthcare products you need.</p>
              <a
                href="/store"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#1B56FD] to-[#3B82F6] text-white font-semibold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-9 0V9a1 1 0 011-1h2a1 1 0 011 1v10M9 7h1m-1 4h1" />
                </svg>
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map(order => (
                <div key={order._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-[#1B56FD]/5 to-[#1B56FD]/10 px-8 py-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-[#1B56FD] rounded-2xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h3>
                          <p className="text-gray-600 font-medium">Placed on {formatDate(order.createdAt)}</p>
                          {order.deliveryMethod && (
                            <div className="flex items-center mt-2">
                              <svg className="w-4 h-4 text-[#1B56FD] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                              <span className="text-sm text-[#1B56FD] font-medium">Delivery: {order.deliveryMethod}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900 mb-3">${order.total.toFixed(2)}</div>
                        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </div>
                        {order.trackingStatus && (
                          <div className="flex items-center justify-end mt-2">
                            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">Tracking: {order.trackingStatus}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-[#1B56FD] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Order Items</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl p-6 flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-[#1B56FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {item.medicineId?.name || item.name || 'Unknown Medicine'}
                              </h5>
                              <div className="text-sm text-gray-600 space-x-2">
                                {item.medicineId?.brand && (
                                  <span>Brand: {item.medicineId.brand}</span>
                                )}
                                {item.medicineId?.dosage && (
                                  <span>• Dosage: {item.medicineId.dosage}</span>
                                )}
                                <span>• Quantity: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                            <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Information */}
                  {(order.prescription || order.declineReason) && (
                    <div className="px-8 pb-6">
                      {order.prescription && (
                        <div className="bg-[#1B56FD]/5 rounded-2xl p-4 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#1B56FD] rounded-xl flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#1B56FD]">Prescription Uploaded</h5>
                              <p className="text-sm text-gray-600">{order.prescription.split('/').pop()}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {order.declineReason && (
                        <div className="bg-red-50 rounded-2xl p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h5 className="font-semibold text-red-800">Order Declined</h5>
                              <p className="text-red-600">{order.declineReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="bg-gray-50 px-8 py-6 flex flex-wrap gap-3">
                    <a
                      href={`/orders/${order._id}`}
                      className="inline-flex items-center px-6 py-3 bg-[#1B56FD] text-white font-semibold rounded-full hover:bg-[#1B56FD]/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </a>
                    
                    {order.status === 'Ready to Checkout' && (
                      <a
                        href={`/checkout?orderId=${order._id}`}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#1B56FD] to-[#3B82F6] text-white font-semibold rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Complete Payment
                      </a>
                    )}
                    
                    {['Pending Verification', 'Ready to Checkout', 'Processing'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 hover:border-gray-300 transform hover:scale-105 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Order
                      </button>
                    )}
                    
                    {order.status === 'Delivered' && (
                      <button className="inline-flex items-center px-6 py-3 bg-white border-2 border-[#1B56FD] text-[#1B56FD] font-semibold rounded-full hover:bg-[#1B56FD]/5 transform hover:scale-105 transition-all duration-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reorder
                      </button>
                    )}

                    {order.paymentId && (
                      <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Payment ID: {order.paymentId}
                      </div>
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