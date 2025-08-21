// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        navigate('/profile');
        // Removed alert - let individual components handle notifications
      } else {
        throw new Error(data.msg || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Removed alert - let individual components handle error notifications
      throw error; // Re-throw so components can handle the error
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        navigate('/profile');
        // Removed alert - let individual components handle notifications
      } else {
        throw new Error(data.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Removed alert - let individual components handle error notifications
      throw error; // Re-throw so components can handle the error
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      navigate('/');
      // Removed alert - let individual components handle notifications
    } catch (error) {
      console.error('Logout error:', error);
      throw error; // Re-throw so components can handle the error
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};