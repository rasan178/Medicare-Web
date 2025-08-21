import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function ProfileDashboard() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Mock user data when not logged in
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-234-567-8900',
    address: '123 Main Street, City, State 12345'
  };

  const currentUser = user || mockUser;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span> {currentUser.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {currentUser.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {currentUser.phone}
                </div>
                <div>
                  <span className="font-medium">Address:</span> {currentUser.address}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/profile/medical"
                  className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Medical Information
                </Link>
                <Link
                  to="/profile/orders"
                  className="block w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  View Orders
                </Link>
                <Link
                  to="/store"
                  className="block w-full text-center bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                >
                  Browse Store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfileDashboard;