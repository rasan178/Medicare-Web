import React from 'react';
import CartPopup from '../components/CartPopup';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Cart() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-4">
        <CartPopup />
      </div>
      <Footer />
    </div>
  );
}

export default Cart;