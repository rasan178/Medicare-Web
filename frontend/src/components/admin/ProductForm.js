// frontend/src/components/admin/ProductForm.js
import React, { useState } from 'react';
import { Package, Pill, DollarSign, Hash, Tag, FileText, Image, Shield } from 'lucide-react';

function ProductForm({ onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B56FD] to-[#4A73FF] text-white px-8 py-6 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Add New Medical Product</h2>
            <p className="text-blue-100 text-sm">Enter product details for inventory management</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-8">
        {/* Primary Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Pill className="w-4 h-4 mr-2 text-[#1B56FD]" />
              Product Name *
            </label>
            <input
              name="name"
              placeholder="Enter medication or product name"
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500"
              required
            />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Tag className="w-4 h-4 mr-2 text-[#1B56FD]" />
              Brand/Manufacturer *
            </label>
            <input
              name="brand"
              placeholder="Enter brand or manufacturer name"
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500"
              required
            />
          </div>

          {/* Dosage */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Hash className="w-4 h-4 mr-2 text-[#1B56FD]" />
              Dosage/Strength
            </label>
            <input
              name="dosage"
              placeholder="e.g., 500mg, 10ml, 1 tablet"
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <DollarSign className="w-4 h-4 mr-2 text-[#1B56FD]" />
              Unit Price *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500"
              required
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Package className="w-4 h-4 mr-2 text-[#1B56FD]" />
              Initial Stock Quantity *
            </label>
            <input
              name="stock"
              type="number"
              placeholder="Enter quantity"
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-800">
              <Tag className="w-4 h-4 mr-2 text-[#1B56FD]" />
              Medical Category *
            </label>
            <input
              name="category"
              placeholder="e.g., Antibiotics, Pain Relief, Vitamins"
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500"
              required
            />
          </div>
        </div>

        {/* Prescription Requirement */}
        <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <label className="flex items-start cursor-pointer group">
            <div className="relative flex items-center">
              <input
                name="prescriptionRequired"
                type="checkbox"
                onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                className="w-5 h-5 text-[#1B56FD] border-2 border-gray-300 rounded focus:ring-blue-100 focus:ring-2"
              />
            </div>
            <div className="ml-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#1B56FD]" />
                <span className="font-semibold text-gray-800">Prescription Required</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Check this box if the product requires a valid prescription for purchase
              </p>
            </div>
          </label>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-6">
          <label className="flex items-center text-sm font-semibold text-gray-800">
            <FileText className="w-4 h-4 mr-2 text-[#1B56FD]" />
            Product Description
          </label>
          <textarea
            name="description"
            placeholder="Enter detailed product description, usage instructions, side effects, etc."
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500 resize-none"
            rows="4"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2 mb-8">
          <label className="flex items-center text-sm font-semibold text-gray-800">
            <Image className="w-4 h-4 mr-2 text-[#1B56FD]" />
            Product Image URL
          </label>
          <input
            name="image"
            placeholder="https://example.com/product-image.jpg"
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#1B56FD] to-[#4A73FF] text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>Add Product to Inventory</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;