// frontend/src/components/admin/AdminNavbar.js
import React, { useContext } from 'react';
import { AdminAuthContext } from '../../context/AdminAuthContext';

function AdminNavbar() {
  const { admin, logout } = useContext(AdminAuthContext);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Pharmacy Admin Dashboard
        </h1>
        
        <div className="flex items-center space-x-4">
          {admin && (
            <>
              <span className="text-gray-600">
                Welcome, {admin.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;