// frontend/src/components/admin/ProductForm.js
import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="brand"
          placeholder="Brand"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="dosage"
          placeholder="Dosage"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
      </div>
      <div className="mt-4">
        <label className="flex items-center">
          <input
            name="prescriptionRequired"
            type="checkbox"
            onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
            className="mr-2"
          />
          Prescription Required
        </label>
      </div>
      <div className="mt-4">
        <textarea
          name="description"
          placeholder="Product Description"
          onChange={handleChange}
          className="border p-2 rounded w-full h-24"
          rows="3"
        />
      </div>
      <div className="mt-4">
        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600"
      >
        Add Product
      </button>
    </form>
  );
}

export default ProductForm;