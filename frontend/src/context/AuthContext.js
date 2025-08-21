import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call - replace with actual API
    setTimeout(() => {
      // api.get('/auth/profile').then(res => setUser(res.data.user)).catch(() => {});
      setLoading(false);
    }, 1000);
  }, []);

  const login = async (data) => {
    try {
      // Mock login - replace with actual API call
      // await api.post('/auth/login', data);
      console.log('Login attempt:', data);
      // window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const register = async (data) => {
    try {
      // Mock register - replace with actual API call
      // await api.post('/auth/register', data);
      console.log('Register attempt:', data);
      // window.location.reload();
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const logout = async () => {
    try {
      // await api.post('/auth/logout');
      setUser(null);
      // window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}