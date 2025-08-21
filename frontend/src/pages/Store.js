// frontend/src/pages/Store.js
import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MedicineCard from '../components/MedicineCard';
import CartButton from '../components/CartButton';
import CartPopup from '../components/CartPopup';
import { CartContext } from '../context/CartContext';

function Store() {
  const [medicines, setMedicines] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]); // Store all medicines for client-side filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    prescriptionRequired: '',
    inStock: 'true'
  });
  const [categories, setCategories] = useState([]);
  const { isOpen } = useContext(CartContext);

  useEffect(() => {
    fetchAllMedicines();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Apply client-side filtering when filters change
    applyFilters();
  }, [filters, allMedicines]);

  const fetchAllMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/medicines');
      
      if (response.ok) {
        const data = await response.json();
        const medicinesData = data.medicines || data;
        setAllMedicines(medicinesData);
        setMedicines(medicinesData);
        setError(null);
      } else {
        throw new Error('Failed to fetch medicines');
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setError('Failed to load medicines. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/medicines/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const applyFilters = () => {
    let filteredMedicines = [...allMedicines];

    // Search filter - more accurate matching
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredMedicines = filteredMedicines.filter(medicine => {
        const name = medicine.name?.toLowerCase() || '';
        const description = medicine.description?.toLowerCase() || '';
        const category = medicine.category?.toLowerCase() || '';
        const manufacturer = medicine.manufacturer?.toLowerCase() || '';
        
        // Check for exact matches first, then partial matches
        return name.includes(searchTerm) || 
               description.includes(searchTerm) || 
               category.includes(searchTerm) ||
               manufacturer.includes(searchTerm) ||
               // Also check for word boundaries for better accuracy
               name.split(' ').some(word => word.startsWith(searchTerm)) ||
               description.split(' ').some(word => word.startsWith(searchTerm));
      });
    }

    // Category filter
    if (filters.category) {
      filteredMedicines = filteredMedicines.filter(medicine => 
        medicine.category === filters.category
      );
    }

    // Prescription filter
    if (filters.prescriptionRequired !== '') {
      const requiresPrescription = filters.prescriptionRequired === 'true';
      filteredMedicines = filteredMedicines.filter(medicine => 
        medicine.prescriptionRequired === requiresPrescription
      );
    }

    // Stock filter
    if (filters.inStock === 'true') {
      filteredMedicines = filteredMedicines.filter(medicine => 
        medicine.stock > 0
      );
    }

    setMedicines(filteredMedicines);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      prescriptionRequired: '',
      inStock: 'true'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-[#1B56FD] mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1B56FD]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L11 4.323V3a1 1 0 112 0v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L11 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading Medicines</h3>
            <p className="text-lg text-gray-600">Finding the best healthcare solutions for you...</p>
            <div className="mt-6 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#1B56FD] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#1B56FD] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-[#1B56FD] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 max-w-md">
            <div className="mb-6">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h3>
            <p className="text-lg text-red-600 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="group relative bg-[#1B56FD] text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#1B56FD]">
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Premium Medicine Store
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Discover quality healthcare products with advanced filtering and seamless shopping experience
            </p>
            <div className="flex justify-center space-x-8 text-white/80">
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>Smart Filtering</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Advanced Filters */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl mb-12 border border-gray-100">
          <div className="flex items-center mb-6">
            <svg className="w-7 h-7 text-[#1B56FD] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Smart Medicine Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#1B56FD] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search medicines..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-all duration-300 text-gray-800 placeholder-gray-500 font-medium"
              />
            </div>
            
            {/* Category Select */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#1B56FD] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l2 2-2 2m-2-2h6M7 13l2 2-2 2m2-2H1" />
                </svg>
              </div>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Prescription Select */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#1B56FD] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <select
                name="prescriptionRequired"
                value={filters.prescriptionRequired}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1B56FD]/20 focus:border-[#1B56FD] transition-all duration-300 text-gray-800 font-medium appearance-none cursor-pointer"
              >
                <option value="">All Medicines</option>
                <option value="false">Over-the-Counter</option>
                <option value="true">Prescription Required</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="group relative bg-[#1B56FD] text-white px-6 py-4 rounded-2xl hover:bg-[#1B56FD]/80 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold overflow-hidden"
            >
              <div className="relative">
                <svg 
                  className="w-5 h-5 inline mr-2 transition-all duration-500 group-hover:scale-110" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {/* Trash bin body */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    className="transition-all duration-500 group-hover:translate-y-0.5" 
                  />
                  {/* Trash bin lid */}
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 7h16"
                    className="transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-12 transform-origin-center" 
                  />
                </svg>
                <span className="transition-all duration-300">Clear Filters</span>
              </div>
            </button>
          </div>
          
          {/* Filter Status */}
          {(filters.search || filters.category || filters.prescriptionRequired !== '') && (
            <div className="mt-6 flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-4 py-2 bg-[#1B56FD]/10 text-[#1B56FD] rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search: "{filters.search}"
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-4 py-2 bg-[#1B56FD]/10 text-[#1B56FD] rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category: {filters.category}
                </span>
              )}
              {filters.prescriptionRequired !== '' && (
                <span className="inline-flex items-center px-4 py-2 bg-[#1B56FD]/10 text-[#1B56FD] rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {filters.prescriptionRequired === 'true' ? 'Prescription Required' : 'Over-the-Counter'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        {medicines.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 max-w-md mx-auto">
              <div className="mb-6">
                <svg className="w-20 h-20 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No medicines found</h3>
              <p className="text-gray-600 mb-8">Try adjusting your filters to find what you're looking for</p>
              <button 
                onClick={clearFilters}
                className="group bg-[#1B56FD] text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                <svg 
                  className="w-5 h-5 inline mr-2 transition-all duration-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    className="transition-all duration-500 group-hover:translate-y-0.5" 
                  />
                </svg>
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-[#1B56FD]/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-[#1B56FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-7l2 2-2 2m-2-2h6M7 13l2 2-2 2m2-2H1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Available Medicines</h3>
                  <p className="text-gray-600">{medicines.length} products found</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>In Stock</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-[#1B56FD] rounded-full"></div>
                  <span>Prescription</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>OTC</span>
                </div>
              </div>
            </div>
            
            {/* Medicine Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {medicines.map((medicine, index) => (
                <div 
                  key={medicine._id} 
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <MedicineCard medicine={medicine} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <CartButton />
      {isOpen && <CartPopup />}
      <Footer />
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Store;