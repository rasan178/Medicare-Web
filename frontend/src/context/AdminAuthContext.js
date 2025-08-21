const React = require('react');
const { createContext, useState, useEffect } = require('react');
const api = require('../utils/api');

const AdminAuthContext = createContext();

function AdminAuthContextProvider(props) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Check admin session
  }, []);

  const login = (data) => api.post('/admin/login', data).then(() => window.location.reload());
  const logout = () => api.post('/admin/logout').then(() => window.location.reload());

  return React.createElement(AdminAuthContext.Provider, { value: { admin, login, logout } }, props.children);
}

module.exports = { AdminAuthContext, AdminAuthContextProvider }; 
