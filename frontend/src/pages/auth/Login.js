import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const { login } = useContext(AuthContext);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual login logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (formData.email && formData.password) {
        login(formData);
        showNotification('Login successful! Welcome back.', 'success');
      } else {
        showNotification('Please fill in all required fields.', 'error');
      }
    } catch (error) {
      showNotification('Login failed. Please check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Notification */}
      {notification.show && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          notification.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div className={`px-6 py-4 rounded-xl shadow-lg border-l-4 flex items-center space-x-3 ${
            notification.type === 'success' 
              ? 'bg-white border-l-blue-600 text-gray-900' 
              : 'bg-white border-l-red-500 text-gray-900'
          }`} style={{ 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
          }}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#1B56FD' }}>
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your MedCare account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                    style={{ 
                      focusRingColor: '#1B56FD',
                      '--tw-ring-color': '#1B56FD'
                    }}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                    style={{ 
                      focusRingColor: '#1B56FD',
                      '--tw-ring-color': '#1B56FD'
                    }}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 focus:ring-2"
                  style={{ 
                    accentColor: '#1B56FD',
                    '--tw-ring-color': '#1B56FD'
                  }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium hover:underline transition-all duration-200" style={{ color: '#1B56FD' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                backgroundColor: '#1B56FD',
                focusRingColor: '#1B56FD'
              }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold hover:underline transition-all duration-200"
                style={{ color: '#1B56FD' }}
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Quick Access</span>
            </div>
          </div>

          {/* Quick Demo Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData({ email: 'demo@medcare.com', password: 'demo123' });
                showNotification('Demo credentials loaded!', 'success');
              }}
              className="w-full flex justify-center items-center py-3 px-4 border-2 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50"
              style={{ 
                borderColor: '#1B56FD',
                color: '#1B56FD'
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try Demo Account
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;