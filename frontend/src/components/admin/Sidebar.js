// frontend/src/components/admin/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Heart, 
  Shield,
  MessageSquareText 
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    { 
      path: '/admin/orders', 
      label: 'Orders', 
      icon: ShoppingCart,
      description: 'Order Management'
    },
    { 
      path: '/admin/products', 
      label: 'Products', 
      icon: Package,
      description: 'Medical Inventory'
    },
    { 
      path: '/admin/testimonials', 
      label: 'Testimonials', 
      icon: MessageSquareText,
      description: 'User Feedback & Reviews'
    },

    { 
      path: '/admin/reports', 
      label: 'Reports', 
      icon: BarChart3,
      description: 'Analytics & Insights'
    },
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-72 h-screen shadow-sm flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B56FD] to-[#4A73FF] p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2.5 rounded-xl">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">MediCare</h2>
            <p className="text-blue-100 text-sm font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="bg-[#1B56FD] p-2 rounded-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Administrator</p>
            <p className="text-xs text-gray-600">Healthcare Management</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 mt-6 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#1B56FD] to-[#4A73FF] text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-[#1B56FD]'
                }`}
              >
                <div className={`p-2 rounded-lg mr-4 transition-colors ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-600 group-hover:text-[#1B56FD]'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${
                    isActive ? 'text-white' : 'text-gray-800'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-xs ${
                    isActive ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-600'
                  }`}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="w-1 h-8 bg-white/30 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* System Status */}
      <div className="px-6 pb-6">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Heart className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">System Status</p>
              <p className="text-xs text-green-600 font-medium">All Systems Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;