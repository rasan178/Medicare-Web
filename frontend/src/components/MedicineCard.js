import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function MedicineCard({ medicine }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
      <img 
        src={medicine.image} 
        alt={medicine.name} 
        className="w-full h-32 object-cover rounded-md mb-3" 
      />
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-800">{medicine.name}</h3>
        <p className="text-sm text-gray-600">Brand: {medicine.brand}</p>
        <p className="text-sm text-gray-600">Dosage: {medicine.dosage}</p>
        <p className="text-xl font-bold text-green-600">${medicine.price}</p>
        <p className="text-sm text-gray-500">Stock: {medicine.stock}</p>
        <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded inline-block">
          {medicine.category}
        </p>
        
        {medicine.prescriptionRequired && (
          <p className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded inline-block">
            Prescription Required
          </p>
        )}
        
        <p className="text-sm text-gray-600 line-clamp-2">{medicine.description}</p>
      </div>
      
      <div className="mt-4 space-y-2">
        <button 
          onClick={() => addToCart(medicine)}
          disabled={medicine.stock === 0}
          className={`w-full py-2 px-4 rounded font-medium ${
            medicine.stock === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        
        <button className="w-full py-2 px-4 bg-blue-500 text-white rounded font-medium hover:bg-blue-600">
          View Details
        </button>
      </div>
    </div>
  );
}

export default MedicineCard;