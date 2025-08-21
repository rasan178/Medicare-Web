import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MedicineCard from '../components/MedicineCard';
import CartButton from '../components/CartButton';
import CartPopup from '../components/CartPopup';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
// import api from '../utils/api';

function Store() {
  const [medicines, setMedicines] = useState([]);
  const { isOpen } = useContext(CartContext);

  useEffect(() => {
    // Mock data - replace with actual API call
    // api.get('/medicines').then(res => setMedicines(res.data));
    setMedicines([
      {
        _id: '1',
        name: 'Paracetamol',
        brand: 'Brand A',
        dosage: '500mg',
        price: 5.99,
        stock: 100,
        category: 'Pain Relief',
        prescriptionRequired: false,
        description: 'Pain and fever relief medication',
        image: 'https://via.placeholder.com/200x150'
      },
      {
        _id: '2',
        name: 'Amoxicillin',
        brand: 'Brand B',
        dosage: '250mg',
        price: 12.99,
        stock: 50,
        category: 'Antibiotics',
        prescriptionRequired: true,
        description: 'Antibiotic for bacterial infections',
        image: 'https://via.placeholder.com/200x150'
      }
    ]);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Medicine Store</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {medicines.map(med => (
            <MedicineCard key={med._id} medicine={med} />
          ))}
        </div>
      </div>
      <CartButton />
      {isOpen && <CartPopup />}
      <Footer />
    </div>
  );
}

export default Store;