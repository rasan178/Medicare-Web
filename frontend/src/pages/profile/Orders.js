import React, { useState, useEffect } from 'react';
import OrderStatusTracker from '../../components/OrderStatusTracker';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
// import api from '../../utils/api';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Mock API call - replace with actual API
    // api.get('/orders').then(res => setOrders(res.data));
    setOrders([
      {
        _id: '1',
        total: 25.98,
        status: 'Processing',
        createdAt: '2025-01-15T10:30:00Z',
        items: [
          { name: 'Paracetamol', quantity: 2, price: 5.99 },
          { name: 'Vitamin C', quantity: 1, price: 14.00 }
        ]
      },
      {
        _id: '2',
        total: 12.99,
        status: 'Shipped',
        createdAt: '2025-01-10T14:20:00Z',
        items: [
          { name: 'Amoxicillin', quantity: 1, price: 12.99 }
        ]
      },
      {
        _id: '3',
        total: 45.50,
        status: 'Delivered',
        createdAt: '2025-01-05T09:15:00Z',
        items: [
          { name: 'Blood Pressure Monitor', quantity: 1, price: 45.50 }
        ]
      }
    ]);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500 text-lg">No orders found</p>
              <a
                href="/store"
                className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                      <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                      <OrderStatusTracker status={order.status} />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex space-x-3">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                      View Details
                    </button>
                    {order.status === 'Processing' && (
                      <button className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <button className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600">
                        Reorder
                      </button>
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