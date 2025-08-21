import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <div>
      <Navbar />
      <section className="p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Our Pharmacy</h1>
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Welcome to our online pharmacy, your trusted partner in health and wellness. 
              We are committed to providing high-quality medications and healthcare products 
              with the convenience of online ordering and home delivery.
            </p>
            <h2 className="text-2xl font-semibold mb-4 mt-8">Our Services</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Prescription medications</li>
              <li>Over-the-counter drugs</li>
              <li>Health and wellness products</li>
              <li>Online consultation</li>
              <li>Home delivery</li>
              <li>24/7 customer support</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
            <ul className="list-disc pl-6 mb-6">
              <li>Licensed pharmacists</li>
              <li>Quality assurance</li>
              <li>Secure and confidential</li>
              <li>Competitive prices</li>
              <li>Fast delivery</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default About;