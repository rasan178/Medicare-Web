import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <Navbar />
      <section className="hero bg-blue-200 p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Pharmacy</h1>
        <p className="text-lg mb-4">Featured Medicines</p>
        <Link to="/store" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Shop Now
        </Link>
      </section>
      <Footer />
    </div>
  );
}

export default Home;