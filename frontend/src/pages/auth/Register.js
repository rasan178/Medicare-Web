import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const { register } = useContext(AuthContext);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = '';
    let color = '';

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        color = 'text-red-500';
        break;
      case 2:
        feedback = 'Weak';
        color = 'text-red-400';
        break;
      case 3:
        feedback = 'Fair';
        color = 'text-yellow-500';
        break;
      case 4:
        feedback = 'Good';
        color = 'text-blue-500';
        break;
      case 5:
        feedback = 'Strong';
        color = 'text-green-500';
        break;
      default:
        feedback = '';
    }

    return { score, text: feedback, color };
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification('Please enter your full name.', 'error');
      return false;
    }
    if (!formData.email.trim()) {
      showNotification('Please enter your email address.', 'error');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showNotification('Please enter a valid email address.', 'error');
      return false;
    }
    if (formData.password.length < 6) {
      showNotification('Password must be at least 6 characters long.', 'error');
      return false;
    }
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      showNotification('Please enter a valid phone number.', 'error');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual register logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      register(formData);
      showNotification('Account created successfully! Welcome to MedCare.', 'success');
    } catch (error) {
      showNotification('Registration failed. Please try again.', 'error');
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
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join MedCare</h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                    style={{ 
                      focusRingColor: '#1B56FD',
                      '--tw-ring-color': '#1B56FD'
                    }}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
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

              {/* Password Field with Strength Indicator */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            backgroundColor: passwordStrength.score >= 4 ? '#10B981' : passwordStrength.score >= 3 ? '#1B56FD' : passwordStrength.score >= 2 ? '#F59E0B' : '#EF4444'
                          }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                    style={{ 
                      focusRingColor: '#1B56FD',
                      '--tw-ring-color': '#1B56FD'
                    }}
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white text-gray-900 resize-none"
                    style={{ 
                      focusRingColor: '#1B56FD',
                      '--tw-ring-color': '#1B56FD'
                    }}
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <div className="absolute top-3 right-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-2"
                style={{ 
                  accentColor: '#1B56FD',
                  '--tw-ring-color': '#1B56FD'
                }}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="font-medium hover:underline" style={{ color: '#1B56FD' }}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="font-medium hover:underline" style={{ color: '#1B56FD' }}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Create Account</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold hover:underline transition-all duration-200"
                style={{ color: '#1B56FD' }}
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#1B56FD' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Your data is secure</p>
                <p className="text-xs text-gray-600 mt-1">We use industry-standard encryption to protect your personal information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;