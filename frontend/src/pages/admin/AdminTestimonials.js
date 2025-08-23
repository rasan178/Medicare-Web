import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { 
  Star, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  Calendar,
  User,
  MessageSquare,
  MoreVertical,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [actionDropdown, setActionDropdown] = useState(null);

  const itemsPerPage = 10;

  // Get the base API URL
  const getBaseUrl = () => {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  };

  useEffect(() => {
    fetchTestimonials();
  }, [filter, currentPage]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(filter !== 'all' && { status: filter })
      });

      const response = await fetch(`${getBaseUrl()}/api/testimonials/admin/all?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.testimonials);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      alert('Error fetching testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (testimonialId) => {
    setProcessing(prev => ({ ...prev, [testimonialId]: 'approving' }));
    try {
      const response = await fetch(`${getBaseUrl()}/api/testimonials/admin/${testimonialId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the testimonial in the list
        setTestimonials(prev => 
          prev.map(testimonial => 
            testimonial._id === testimonialId 
              ? { ...testimonial, isApproved: true }
              : testimonial
          )
        );
        alert('Testimonial approved successfully!');
      } else {
        alert(data.message || 'Error approving testimonial');
      }
    } catch (error) {
      console.error('Error approving testimonial:', error);
      alert('Error approving testimonial. Please try again.');
    } finally {
      setProcessing(prev => ({ ...prev, [testimonialId]: null }));
      setActionDropdown(null);
    }
  };

  const handleToggleVisibility = async (testimonialId) => {
    setProcessing(prev => ({ ...prev, [testimonialId]: 'toggling' }));
    try {
      const response = await fetch(`${getBaseUrl()}/api/testimonials/admin/${testimonialId}/toggle-visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the testimonial in the list
        setTestimonials(prev => 
          prev.map(testimonial => 
            testimonial._id === testimonialId 
              ? { ...testimonial, isVisible: data.testimonial.isVisible }
              : testimonial
          )
        );
        alert(data.message);
      } else {
        alert(data.message || 'Error updating testimonial visibility');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Error updating testimonial visibility. Please try again.');
    } finally {
      setProcessing(prev => ({ ...prev, [testimonialId]: null }));
      setActionDropdown(null);
    }
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;

    setProcessing(prev => ({ ...prev, [testimonialToDelete._id]: 'deleting' }));
    try {
      const response = await fetch(`${getBaseUrl()}/api/testimonials/admin/${testimonialToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove the testimonial from the list
        setTestimonials(prev => prev.filter(testimonial => testimonial._id !== testimonialToDelete._id));
        setTotalCount(prev => prev - 1);
        alert('Testimonial deleted successfully!');
      } else {
        alert(data.message || 'Error deleting testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial. Please try again.');
    } finally {
      setProcessing(prev => ({ ...prev, [testimonialToDelete._id]: null }));
      setShowDeleteModal(false);
      setTestimonialToDelete(null);
    }
  };

  const openDeleteModal = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowDeleteModal(true);
    setActionDropdown(null);
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (testimonial.profession && testimonial.profession.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (testimonial) => {
    if (!testimonial.isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    } else if (!testimonial.isVisible) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Hidden
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
                <p className="text-gray-600 font-medium">Loading testimonials...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <div className="md:flex md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                      Testimonials Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage customer reviews and testimonials
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={fetchTestimonials}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{totalCount}</dd>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {testimonials.filter(t => t.isApproved).length}
                    </dd>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {testimonials.filter(t => !t.isApproved).length}
                    </dd>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <dt className="text-sm font-medium text-gray-500 truncate">Visible</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {testimonials.filter(t => t.isVisible && t.isApproved).length}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  {/* Filter Tabs */}
                  <div className="flex space-x-4">
                    {[
                      { key: 'all', label: 'All Reviews', count: totalCount },
                      { key: 'pending', label: 'Pending', count: testimonials.filter(t => !t.isApproved).length },
                      { key: 'approved', label: 'Approved', count: testimonials.filter(t => t.isApproved).length }
                    ].map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setFilter(tab.key);
                          setCurrentPage(1);
                        }}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          filter === tab.key
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                            filter === tab.key ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Testimonials List */}
              <div className="overflow-hidden">
                {filteredTestimonials.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredTestimonials.map((testimonial) => (
                      <div key={testimonial._id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="flex items-center">
                                <User className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-lg font-medium text-gray-900">
                                  {testimonial.fullName}
                                </span>
                              </div>
                              {testimonial.profession && (
                                <span className="text-sm text-gray-500">
                                  • {testimonial.profession}
                                </span>
                              )}
                              {getStatusBadge(testimonial)}
                            </div>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${
                                      i < testimonial.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">
                                {testimonial.rating}/5
                              </span>
                            </div>

                            <p className="text-gray-700 mb-3 leading-relaxed">
                              "{testimonial.comment}"
                            </p>

                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              Submitted on {formatDate(testimonial.createdAt)}
                            </div>
                          </div>

                          {/* Action Menu */}
                          <div className="relative ml-4">
                            <button
                              onClick={() => setActionDropdown(actionDropdown === testimonial._id ? null : testimonial._id)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {actionDropdown === testimonial._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                                <div className="py-1">
                                  {!testimonial.isApproved && (
                                    <button
                                      onClick={() => handleApprove(testimonial._id)}
                                      disabled={processing[testimonial._id]}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                      Approve
                                    </button>
                                  )}
                                  
                                  {testimonial.isApproved && (
                                    <button
                                      onClick={() => handleToggleVisibility(testimonial._id)}
                                      disabled={processing[testimonial._id]}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                      {testimonial.isVisible ? (
                                        <>
                                          <EyeOff className="w-4 h-4 mr-2 text-gray-600" />
                                          Hide
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="w-4 h-4 mr-2 text-gray-600" />
                                          Show
                                        </>
                                      )}
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => openDeleteModal(testimonial)}
                                    disabled={processing[testimonial._id]}
                                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}

                            {processing[testimonial._id] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Try adjusting your search criteria.' : 'No testimonials match the current filter.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">Delete Testimonial</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this testimonial from{' '}
                  <strong>{testimonialToDelete?.fullName}</strong>? This action cannot be undone.
                </p>
                
                <div className="flex space-x-4 justify-end">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setTestimonialToDelete(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={processing[testimonialToDelete?._id]}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {processing[testimonialToDelete?._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Click outside to close dropdown */}
          {actionDropdown && (
            <div 
              className="fixed inset-0 z-0" 
              onClick={() => setActionDropdown(null)}
            ></div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminTestimonials;