import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { 
  ShoppingCart, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Package, 
  Tag,
  Star,
  Shield,
  Heart,
  Clock
} from 'lucide-react';

function MedicineCard({ medicine }) {
  const { addToCart } = useContext(CartContext);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative h-auto w-full perspective-1000">
      <div className={`relative w-full transition-transform duration-700 transform-style-preserve-3d ${showDetails ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side */}
        <div className="backface-hidden bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header with Image and Quick Info */}
      <div className="relative">
        {/* Medicine Image */}
        <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
          <img 
            src={medicine.image} 
            alt={medicine.name} 
            className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300" 
          />
        </div>

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3">
          {medicine.prescriptionRequired && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Rx
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {medicine.stock > 0 ? (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Available
            </span>
          ) : (
            <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <Package className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Category and Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {medicine.category}
          </span>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          </div>
        </div>

        {/* Medicine Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {medicine.name}
        </h3>

        {/* Brand and Dosage */}
        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Brand:</span> {medicine.brand}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Dosage:</span> {medicine.dosage}
          </p>
        </div>

        {/* Price Section */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
          <span className="text-2xl font-bold text-blue-600">${medicine.price}</span>
          <span className="text-sm text-gray-500 ml-1">per unit</span>
        </div>

        {/* Description Toggle */}
        {/* Removed - description now shows on flip */}

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button 
              onClick={() => addToCart(medicine)}
              disabled={medicine.stock === 0}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                medicine.stock === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 active:scale-95"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>FDA Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
    </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col h-full p-6 text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold truncate pr-2">{medicine.name}</h3>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
              >
                <Info className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Description */}
            <div className="flex-1 mb-6">
              <h4 className="text-lg font-semibold mb-3 text-blue-100">Description</h4>
              <div className="overflow-y-auto pr-2">
                <p className="text-white leading-relaxed text-sm">
                  {medicine.description}
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div className="mb-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-100 text-sm">Brand</span>
                  <span className="text-white text-sm">{medicine.brand}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-100 text-sm">Dosage</span>
                  <span className="text-white text-sm">{medicine.dosage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-100 text-sm">Category</span>
                  <span className="text-white text-sm">{medicine.category}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white border-opacity-20 pt-3">
                  <span className="font-medium text-blue-100 text-sm">Price</span>
                  <span className="text-white font-bold text-lg">${medicine.price}</span>
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-auto">
              <button 
                onClick={() => addToCart(medicine)}
                disabled={medicine.stock === 0}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  medicine.stock === 0 
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                    : 'bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  {medicine.stock === 0 ? 'Out of Stock' : `Add to Cart - ${medicine.price}`}
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="h-1 bg-gradient-to-r from-blue-300 to-blue-400"></div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

export default MedicineCard;