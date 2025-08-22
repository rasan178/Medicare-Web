// frontend/src/context/AdminAuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminAuthContext = createContext();

export const AdminAuthContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAuth = () => {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        try {
          setAdmin(JSON.parse(adminData));
        } catch (error) {
          console.error('Invalid admin data in localStorage');
          localStorage.removeItem('admin');
        }
      }
      setLoading(false);
    };

    checkAdminAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        setAdmin(data.admin);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        navigate('/admin/dashboard');
        alert('Admin login successful!');
      } else {
        alert(data.msg || 'Admin login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      alert('Admin login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setAdmin(null);
      localStorage.removeItem('admin');
      navigate('/admin/login');
      alert('Admin logged out successfully');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    // Add these properties for compatibility with the protected route
    isAdminAuthenticated: !!admin,
    isLoading: loading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthContextProvider');
  }
  
  return context;
};