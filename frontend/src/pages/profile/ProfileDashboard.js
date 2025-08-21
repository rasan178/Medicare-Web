import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../utils/api';

function ProfileDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
      fetchOrderStats();
    }
  }, [authLoading]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data.user);
      setFormData({
        name: response.data.user.name || '',
        phone: response.data.user.phone || '',
        address: response.data.user.address || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await api.get('/orders/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching order stats:', err);
      // Don't set error for stats as it's not critical
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setUpdateSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', formData);
      setProfile(response.data.user);
      setEditing(false);
      setUpdateSuccess('Profile updated successfully!');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  if (authLoading || loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-lg mt-4">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600">Please log in to view your profile</p>
            <Link to="/login" className="text-blue-500 hover:text-blue-700 mt-2 inline-block">
              Go to Login
            </Link>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Profile Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile.name}!</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {updateSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {updateSuccess}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Information */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Account Information</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span>{profile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span>{profile.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Address:</span>
                    <span className="text-right max-w-xs">{profile.address || 'Not provided'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/profile/medical"
                  className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Medical Information
                </Link>
                <Link
                  to="/profile/orders"
                  className="block w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                >
                  View Orders
                </Link>
                <Link
                  to="/store"
                  className="block w-full text-center bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
                >
                  Browse Store
                </Link>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          {stats && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">{stats.totalOrders}</div>
                <div className="text-gray-600">Total Orders</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">${stats.totalSpent.toFixed(2)}</div>
                <div className="text-gray-600">Total Spent</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {stats.statusBreakdown.find(s => s._id === 'Delivered')?.count || 0}
                </div>
                <div className="text-gray-600">Completed Orders</div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Your recent activity will appear here</p>
              <Link to="/profile/orders" className="text-blue-500 hover:text-blue-700 mt-2 inline-block">
                View All Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfileDashboard;