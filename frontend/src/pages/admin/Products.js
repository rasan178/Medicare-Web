// frontend/src/pages/admin/Products.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ProductForm from '../../components/admin/ProductForm';
import api from '../../utils/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/medicines');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (data) => {
    try {
      await api.post('/medicines', data);
      // Refresh products list
      const response = await api.get('/medicines');
      setProducts(response.data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/medicines/${id}`);
        // Refresh products list
        const response = await api.get('/medicines');
        setProducts(response.data);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-6">Product Management</h1>
          
          <ProductForm onSubmit={handleAddProduct} />
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Product List</h2>
            </div>
            
            {loading ? (
              <div className="p-4 text-center">Loading products...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Brand</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Stock</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      products.map(product => (
                        <tr key={product._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium">{product.name}</td>
                          <td className="px-4 py-2">{product.brand}</td>
                          <td className="px-4 py-2">${product.price}</td>
                          <td className="px-4 py-2">{product.stock}</td>
                          <td className="px-4 py-2">{product.category}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Products;
