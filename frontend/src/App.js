const React = require('react');
const { BrowserRouter, Routes, Route } = require('react-router-dom');

const AuthContextProvider = require('./context/AuthContext').AuthContextProvider;
const CartContextProvider = require('./context/CartContext').CartContextProvider;
const AdminAuthContextProvider = require('./context/AdminAuthContext').AdminAuthContextProvider;

const Home = require('./pages/Home');
const Store = require('./pages/Store');
const About = require('./pages/About');
const Login = require('./pages/auth/Login');
const Register = require('./pages/auth/Register');
const ProfileDashboard = require('./pages/profile/ProfileDashboard');
const MedicalInfo = require('./pages/profile/MedicalInfo');
const Orders = require('./pages/profile/Orders');
const Cart = require('./pages/Cart');
const AdminLogin = require('./pages/admin/AdminLogin');
const Dashboard = require('./pages/admin/Dashboard');
const Products = require('./pages/admin/Products');
const AdminOrders = require('./pages/admin/Orders');
const Reports = require('./pages/admin/Reports');

module.exports = function App() {
  return React.createElement(BrowserRouter, null,
    React.createElement(AuthContextProvider, null,
      React.createElement(CartContextProvider, null,
        React.createElement(AdminAuthContextProvider, null,
          React.createElement(Routes, null,
            React.createElement(Route, { path: '/', element: Home ? React.createElement(Home) : 'Home Not Found' }),
            React.createElement(Route, { path: '/store', element: Store ? React.createElement(Store) : 'Store Not Found' }),
            React.createElement(Route, { path: '/about', element: About ? React.createElement(About) : 'About Not Found' }),
            React.createElement(Route, { path: '/login', element: Login ? React.createElement(Login) : 'Login Not Found' }),
            React.createElement(Route, { path: '/register', element: Register ? React.createElement(Register) : 'Register Not Found' }),
            React.createElement(Route, { path: '/profile', element: ProfileDashboard ? React.createElement(ProfileDashboard) : 'Profile Not Found' }),
            React.createElement(Route, { path: '/profile/medical', element: MedicalInfo ? React.createElement(MedicalInfo) : 'MedicalInfo Not Found' }),
            React.createElement(Route, { path: '/profile/orders', element: Orders ? React.createElement(Orders) : 'Orders Not Found' }),
            React.createElement(Route, { path: '/cart', element: Cart ? React.createElement(Cart) : 'Cart Not Found' }),
            React.createElement(Route, { path: '/admin/login', element: AdminLogin ? React.createElement(AdminLogin) : 'AdminLogin Not Found' }),
            React.createElement(Route, { path: '/admin/dashboard', element: Dashboard ? React.createElement(Dashboard) : 'Dashboard Not Found' }),
            React.createElement(Route, { path: '/admin/products', element: Products ? React.createElement(Products) : 'Products Not Found' }),
            React.createElement(Route, { path: '/admin/orders', element: AdminOrders ? React.createElement(AdminOrders) : 'Orders Not Found' }),
            React.createElement(Route, { path: '/admin/reports', element: Reports ? React.createElement(Reports) : 'Reports Not Found' })
          )
        )
      )
    )
  );
};