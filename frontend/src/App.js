import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthContext';
import { CartContextProvider } from './context/CartContext';
import { AdminAuthContextProvider, useAdminAuth } from './context/AdminAuthContext';

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

// Protected Route Component for Admin Routes
function ProtectedAdminRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Redirect to admin login if not authenticated
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfileDashboard />} />
          <Route path="/profile/medical" element={<MedicalInfo />} />
          <Route path="/profile/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Admin Login Route (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedAdminRoute>
                <Products />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedAdminRoute>
                <AdminOrders />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedAdminRoute>
                <Reports />
              </ProtectedAdminRoute>
            } 
          />
          
          {/* Catch-all route for admin paths - redirect to dashboard if authenticated, login if not */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedAdminRoute>
                <Navigate to="/admin/dashboard" replace />
              </ProtectedAdminRoute>
            } 
          />
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