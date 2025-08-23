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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-[#1B56FD] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1B56FD]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <p className="text-lg mt-6 font-medium text-gray-700">Loading your health profile...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we secure your data</p>
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-[#1B56FD] to-[#3B82F6] rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-8">Please log in to access your healthcare profile</p>
            <Link 
              to="/login" 
              className="inline-flex items-center px-8 py-4 bg-[#1B56FD] text-white font-semibold rounded-full hover:bg-[#1B56FD]/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1B56FD] to-[#3B82F6] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="text-white mb-6 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Healthcare Dashboard</h1>
                <p className="text-xl text-white/90">Welcome back, {profile.name}!</p>
                <p className="text-white/70 mt-1">Manage your health information securely</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-white">
                    <p className="font-semibold text-lg">Patient ID</p>
                    <p className="text-white/80 text-sm">#{profile.name}{profile.phone ? profile.phone.replace(/\D/g, '').slice(-4) : '0000'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-6 shadow-lg">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {updateSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-6 shadow-lg">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 font-medium">{updateSuccess}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Account Information */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#1B56FD]/10 to-[#1B56FD]/5 px-8 py-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#1B56FD] rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Patient Information</h2>
                        <p className="text-gray-600">Personal details and contact information</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditing(!editing)}
                      className="inline-flex items-center px-6 py-3 bg-[#1B56FD] text-white font-semibold rounded-full hover:bg-[#1B56FD]/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {editing ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-8">
                  {editing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">Full Name</label>
                          <div className="relative">
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1B56FD] focus:ring-4 focus:ring-[#1B56FD]/10 transition-all duration-200 text-gray-900 font-medium"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3">Phone Number</label>
                          <div className="relative">
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1B56FD] focus:ring-4 focus:ring-[#1B56FD]/10 transition-all duration-200 text-gray-900 font-medium"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Address</label>
                        <div className="relative">
                          <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1B56FD] focus:ring-4 focus:ring-[#1B56FD]/10 transition-all duration-200 text-gray-900 font-medium resize-none"
                            placeholder="Enter your complete address"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-[#1B56FD] text-white py-4 px-6 rounded-xl hover:bg-[#1B56FD]/90 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-[#1B56FD] rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-800">Full Name</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{profile.name}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-[#1B56FD] rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-800">Email Address</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{profile.email}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-[#1B56FD] rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-800">Phone Number</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{profile.phone || 'Not provided'}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-[#1B56FD] rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="font-semibold text-gray-800">Address</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{profile.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#1B56FD]/10 to-[#1B56FD]/5 px-6 py-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#1B56FD] rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                      <p className="text-sm text-gray-600">Healthcare services</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <Link
                    to="/profile/medical"
                    className="group block w-full bg-gradient-to-r from-[#1B56FD] to-[#3B82F6] text-white py-4 px-6 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Medical Records</h3>
                        <p className="text-white/80 text-sm">View health information</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link
                    to="/profile/orders"
                    className="group block w-full bg-white border-2 border-gray-200 hover:border-[#1B56FD] text-gray-900 py-4 px-6 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#1B56FD]/10 rounded-xl flex items-center justify-center transition-colors duration-200">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-[#1B56FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Order History</h3>
                        <p className="text-gray-600 text-sm">Track your purchases</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link
                    to="/store"
                    className="group block w-full bg-white border-2 border-gray-200 hover:border-[#1B56FD] text-gray-900 py-4 px-6 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#1B56FD]/10 rounded-xl flex items-center justify-center transition-colors duration-200">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-[#1B56FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">Browse Store</h3>
                        <p className="text-gray-600 text-sm">Shop medical supplies</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          {stats && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center group hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1B56FD] to-[#3B82F6] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalOrders}</div>
                <div className="text-gray-600 font-medium text-lg">Total Orders</div>
                <div className="text-sm text-gray-500 mt-2">Healthcare purchases</div>
              </div>
              
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center group hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1B56FD] to-[#3B82F6] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">${stats.totalSpent.toFixed(2)}</div>
                <div className="text-gray-600 font-medium text-lg">Total Spent</div>
                <div className="text-sm text-gray-500 mt-2">Medical expenses</div>
              </div>
              
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center group hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1B56FD] to-[#3B82F6] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stats.statusBreakdown.find(s => s._id === 'Delivered')?.count || 0}
                </div>
                <div className="text-gray-600 font-medium text-lg">Completed Orders</div>
                <div className="text-sm text-gray-500 mt-2">Successfully delivered</div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1B56FD]/10 to-[#1B56FD]/5 px-8 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#1B56FD] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-gray-600">Your latest healthcare interactions</p>
                </div>
              </div>
            </div>
            
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Recent Activity</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Your healthcare activity and order history will appear here once you start using our services.</p>
              <Link 
                to="/profile/orders" 
                className="inline-flex items-center px-8 py-4 bg-[#1B56FD] text-white font-semibold rounded-full hover:bg-[#1B56FD]/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
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