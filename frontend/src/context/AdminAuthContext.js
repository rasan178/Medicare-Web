import React, { createContext, useState, useEffect } from 'react';
// import api from '../utils/api';

export const AdminAuthContext = createContext();

export function AdminAuthContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock check admin session
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const login = async (data) => {
    try {
      console.log('Admin login attempt:', data);
      // await api.post('/admin/login', data);
      // window.location.reload();
    } catch (error) {
      console.error('Admin login error:', error);
    }
  };

  const logout = async () => {
    try {
      // await api.post('/admin/logout');
      setAdmin(null);
      // window.location.reload();
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}