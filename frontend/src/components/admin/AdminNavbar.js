import React, { useContext, useState, useEffect } from 'react';
import { AdminAuthContext } from '../../context/AdminAuthContext';

function AdminNavbar() {
  const { admin, logout } = useContext(AdminAuthContext);
  const [adminDetails, setAdminDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      fetchAdminDetails();
      fetchNotifications();
    }
  }, [admin]);

  const fetchAdminDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAdminDetails({
            pendingOrders: data.stats.pendingOrders || 0,
            totalOrders: data.stats.totalOrders || 0,
            lowStockCount: data.stats.lowStockMedicines?.length || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Create notifications from pending orders
          const pendingOrders = data.orders.filter(order => 
            order.status === 'Pending Verification'
          ).slice(0, 5); // Show only latest 5

          const notificationList = pendingOrders.map(order => ({
            id: order._id,
            type: 'order',
            message: `New order from ${order.userId?.name || 'Unknown Customer'}`,
            time: new Date(order.createdAt).toLocaleTimeString(),
            unread: true
          }));

          setNotifications(notificationList);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      try {
        setLoading(true);
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error during logout. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const refreshData = async () => {
    await Promise.all([
      fetchAdminDetails(),
      fetchNotifications()
    ]);
  };

  const formatAdminName = (email) => {
    if (!email) return 'Admin';
    return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-50 relative">
      <div className="flex justify-between items-center px-8 py-5">
        <div className="flex items-center space-x-6">
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                MediCare Admin
              </h1>
              <p className="text-xs text-gray-500 font-medium">Healthcare Management</p>
            </div>
          </div>
          
          {/* Stats Indicators */}
          {adminDetails && (
            <div className="hidden lg:flex items-center space-x-6 ml-8">
              <div className="flex items-center space-x-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-amber-800">
                  {adminDetails.pendingOrders} Pending Orders
                </span>
              </div>
              
              {adminDetails.lowStockCount > 0 && (
                <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-red-800">
                    {adminDetails.lowStockCount} Low Stock Items
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-green-800">
                  {adminDetails.totalOrders} Total Orders
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-300 group"
            title="Refresh data"
          >
            <svg 
              className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-300 relative group"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-md animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <h3 className="font-bold text-lg">Notifications</h3>
                  </div>
                  {notifications.length > 0 && (
                    <p className="text-blue-100 text-sm mt-1">{notifications.length} new alerts</p>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150">
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-xs text-gray-500 font-medium">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">No new notifications</p>
                      <p className="text-gray-400 text-sm mt-1">All caught up!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {admin && (
            <>
              {/* Admin Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-200 bg-gray-50 hover:bg-blue-50 px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {formatAdminName(admin.username || admin.email).charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-semibold text-sm leading-tight">
                      {formatAdminName(admin.username || admin.email)}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Administrator</p>
                  </div>
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                          {formatAdminName(admin.username || admin.email).charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-base">
                            {formatAdminName(admin.username || admin.email)}
                          </p>
                          <p className="text-blue-100 text-sm">
                            {admin.username || admin.email}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-blue-100">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-3 transition-all duration-150 font-medium"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <span>Refresh Dashboard</span>
                      </button>
                      
                      <div className="mx-4 my-2 border-t border-gray-100"></div>
                      
                      <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 disabled:opacity-50 transition-all duration-150 font-medium"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        ></div>
      )}
    </header>
  );
}

export default AdminNavbar;