import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import api from '../../utils/api';
import { 
  Package, 
  Plus, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Pill, 
  Tag, 
  DollarSign, 
  Hash, 
  FileText, 
  Image, 
  Shield, 
  X, 
  Save 
} from 'lucide-react';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    dosage: '',
    price: '',
    stock: '',
    category: '',
    prescriptionRequired: false,
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/medicines');
      
      // Handle different response structures
      if (response.data.medicines) {
        setProducts(response.data.medicines);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.brand || !formData.dosage || !formData.price || !formData.stock || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editProduct) {
        // Update existing product
        await api.put(`/medicines/${editProduct._id}`, formData);
      } else {
        // Add new product
        await api.post('/medicines', formData);
      }
      
      // Reset form and refresh list
      resetForm();
      await fetchProducts();
      setShowAddForm(false);
      setEditProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.msg || 'Failed to save product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      dosage: '',
      price: '',
      stock: '',
      category: '',
      prescriptionRequired: false,
      description: '',
      image: ''
    });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      dosage: product.dosage || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      prescriptionRequired: product.prescriptionRequired || false,
      description: product.description || '',
      image: product.image || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/medicines/${productId}`);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditProduct(null);
    resetForm();
  };

  const getStockStatus = (stock) => {
    if (stock <= 10) {
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <AlertTriangle className="w-3 h-3" />,
        label: 'Critical'
      };
    } else if (stock <= 50) {
      return {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <AlertCircle className="w-3 h-3" />,
        label: 'Low'
      };
    } else {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Good'
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#1B56FD] mx-auto"></div>
                <p className="mt-6 text-gray-600 font-medium">Loading medical inventory...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-[#1B56FD] to-[#4A73FF] p-3 rounded-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Medical Inventory</h1>
                    <p className="text-gray-600 mt-1">Manage pharmaceutical products and supplies</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={fetchProducts}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-[#1B56FD] to-[#4A73FF] hover:shadow-lg text-white px-6 py-2.5 rounded-lg transition-all duration-200 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Add/Edit Product Form */}
          {showAddForm && (
            <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-100">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#1B56FD] to-[#4A73FF] text-white px-8 py-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {editProduct ? 'Edit Medical Product' : 'Add New Medical Product'}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {editProduct ? 'Update product information' : 'Enter product details for inventory management'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={cancelForm}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-800">
                      <Pill className="w-4 h-4 mr-2 text-[#1B56FD]" />
                      Product Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                      required
                    />
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-800">
                      <Tag className="w-4 h-4 mr-2 text-[#1B56FD]" />
                      Brand/Manufacturer <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                      required
                    />
                  </div>

                  {/* Dosage */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-800">
                      <Hash className="w-4 h-4 mr-2 text-[#1B56FD]" />
                      Dosage/Strength <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      placeholder="e.g., 500mg"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-800">
                      <DollarSign className="w-4 h-4 mr-2 text-[#1B56FD]" />
                      Unit Price <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-800">
                      <Package className="w-4 h-4 mr-2 text-[#1B56FD]" />
                      Stock Quantity <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-800">
                      <Tag className="w-4 h-4 mr-2 text-[#1B56FD]" />
                      Medical Category <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-6">
                  <label className="flex items-center text-sm font-semibold text-gray-800">
                    <FileText className="w-4 h-4 mr-2 text-[#1B56FD]" />
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2 mb-8">
                  <label className="flex items-center text-sm font-semibold text-gray-800">
                    <Image className="w-4 h-4 mr-2 text-[#1B56FD]" />
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B56FD] focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800"
                  />
                </div>

                {/* Prescription Requirement */}
                <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <label className="flex items-start cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="prescriptionRequired"
                        checked={formData.prescriptionRequired}
                        onChange={handleInputChange}
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

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-gradient-to-r from-[#1B56FD] to-[#4A73FF] hover:shadow-lg text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editProduct ? 'Update Product' : 'Add Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Products List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="w-6 h-6 text-[#1B56FD]" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Product Inventory ({products.length})
                  </h2>
                </div>
              </div>
            </div>
            
            {products.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                <p className="text-gray-500">Start by adding your first medical product to the inventory.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Brand</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dosage</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prescription</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{product.brand}</td>
                          <td className="px-6 py-4 text-gray-700">{product.dosage}</td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-gray-900">${product.price}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                              {stockStatus.icon}
                              <span>{product.stock} units</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-xs font-medium">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {product.prescriptionRequired ? (
                              <div className="flex items-center space-x-2 text-red-600">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">Required</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Not Required</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleEdit(product)}
                                className="flex items-center space-x-1 text-[#1B56FD] hover:text-blue-700 font-medium text-sm transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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