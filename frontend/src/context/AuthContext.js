const React = require('react');
const { createContext, useState, useEffect } = require('react');
const api = require('../utils/api');

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get('/auth/profile').then(res => setUser(res.data.user)).catch(() => {});
  }, []);

  const login = (data) => api.post('/auth/login', data).then(() => window.location.reload());
  const register = (data) => api.post('/auth/register', data).then(() => window.location.reload());
  const logout = () => api.post('/auth/logout').then(() => window.location.reload());

  return React.createElement(AuthContext.Provider, { value: { user, login, register, logout } }, props.children);
}

module.exports = { AuthContext, AuthContextProvider }; 
