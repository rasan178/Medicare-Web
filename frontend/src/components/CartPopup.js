import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard,
  ArrowLeft,
  Package
} from 'lucide-react';

function CartPopup() {
  const { cartItems, removeFromCart, updateQuantity, closeCart, checkout } = useContext(CartContext);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden transform transition-all duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Shopping Cart</h2>
                <p className="text-blue-100 text-sm">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button 
              onClick={closeCart}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some medicines to get started</p>
              <button 
                onClick={closeCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-sm">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                        <p className="text-lg font-bold text-blue-600">${item.price}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200">
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          <input 
                            type="number" 
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-2 text-center border-0 focus:outline-none bg-transparent"
                          />
                          
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {item.quantity} × ${item.price}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Only show when cart has items */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            {/* Total Section */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-600 text-sm">Total Amount</span>
                  <div className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{itemCount} {itemCount === 1 ? 'item' : 'items'}</div>
                  <div>+ taxes & fees</div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={closeCart}
                className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue</span>
              </button>
              
              <button 
                onClick={checkout}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <CreditCard className="w-4 h-4" />
                <span>Checkout</span>
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex justify-center items-center space-x-4 mt-4 text-xs text-gray-500">
              <span>🔒 Secure Payment</span>
              <span>📦 Fast Delivery</span>
              <span>✅ Genuine Products</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPopup;