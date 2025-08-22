import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthContext';
import { CartContextProvider } from './context/CartContext';
import { AdminAuthContextProvider } from './context/AdminAuthContext';

import Navbar from './components/Navbar';
import AdminNavbar from './components/admin/AdminNavbar';
import Home from './pages/Home';
import Store from './pages/Store';
import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProfileDashboard from './pages/profile/ProfileDashboard';
import MedicalInfo from './pages/profile/MedicalInfo';
import Orders from './pages/profile/Orders';
import Cart from './pages/Cart';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import Reports from './pages/admin/Reports';

// Component to conditionally render navbar based on route
function ConditionalNavbar() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't render any navbar for admin routes (they handle their own navigation)
  if (isAdminRoute) {
    return null;
  }
  
  return <Navbar />;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ConditionalNavbar />
      <main className={isAdminRoute ? "pt-0" : "pt-16"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfileDashboard />} />
          <Route path="/profile/medical" element={<MedicalInfo />} />
          <Route path="/profile/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <CartContextProvider>
          <AdminAuthContextProvider>
            <AppContent />
          </AdminAuthContextProvider>
        </CartContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;