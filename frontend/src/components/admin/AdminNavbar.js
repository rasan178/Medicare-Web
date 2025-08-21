// frontend/src/components/admin/AdminNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function AdminNavbar() {
  return (
    <nav className="bg-blue-700 p-4 text-white">
      <h1>Admin Panel</h1>
      <Link to="/admin/logout">Logout</Link>
    </nav>
  );
}

export default AdminNavbar;
