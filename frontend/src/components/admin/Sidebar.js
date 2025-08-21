// frontend/src/components/admin/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white p-4 min-h-screen w-64">
      <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link 
            to="/admin/dashboard" 
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/products" 
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Products
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/orders" 
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Orders
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/reports" 
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Reports
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;