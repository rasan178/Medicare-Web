import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Clock, 
  Users, 
  Pill, 
  Stethoscope, 
  Activity, 
  Award,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  ShoppingBag,
  Plus,
  X,
  Send
} from 'lucide-react';

function Home() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalMedicines: 0,
    totalRevenue: '0.00'
  });
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    fullName: '',
    profession: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHomeStats();
  }, []);

  const fetchHomeStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/medicines/public/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Home stats fetch error:', err);
      // Keep default values on error
      setStats({
        totalOrders: 0,
        totalMedicines: 0,
        totalRevenue: '0.00'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!reviewForm.comment.trim() || !reviewForm.fullName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      // Here you would typically submit to your API
      console.log('Submitting review:', reviewForm);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setReviewForm({
        rating: 0,
        comment: '',
        fullName: '',
        profession: ''
      });
      setShowReviewForm(false);
      alert('Thank you for your review! It will be reviewed and published soon.');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowReviewForm(false);
    setReviewForm({
      rating: 0,
      comment: '',
      fullName: '',
      profession: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Quality Medicines,
                <span className="block text-blue-200">Delivered Fast</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Your trusted online pharmacy for genuine medicines and healthcare products. 
                Fast delivery, competitive prices, guaranteed quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/store"
                  className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                >
                  Shop Medicines
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-500 bg-opacity-20 rounded-2xl p-6 mb-4">
                      <Stethoscope className="w-12 h-12 mx-auto text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">Genuine Medicines</h3>
                    <p className="text-blue-100 text-sm">100% authentic products</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500 bg-opacity-20 rounded-2xl p-6 mb-4">
                      <Shield className="w-12 h-12 mx-auto text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">Safe & Secure</h3>
                    <p className="text-blue-100 text-sm">FDA approved medicines</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500 bg-opacity-20 rounded-2xl p-6 mb-4">
                      <Clock className="w-12 h-12 mx-auto text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">Fast Delivery</h3>
                    <p className="text-blue-100 text-sm">Same day & next day options</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-500 bg-opacity-20 rounded-2xl p-6 mb-4">
                      <Heart className="w-12 h-12 mx-auto text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">Best Prices</h3>
                    <p className="text-blue-100 text-sm">Competitive pharmacy rates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Medicare Pharmacy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted online pharmacy committed to providing genuine medicines 
              at competitive prices with fast, reliable delivery service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Pill,
                title: "Premium Medicines",
                description: "Access to high-quality, FDA-approved medications from trusted manufacturers worldwide."
              },
              {
                icon: Users,
                title: "Licensed Pharmacists",
                description: "Our certified pharmacists ensure proper medication dispensing and provide product information."
              },
              {
                icon: Activity,
                title: "Order Tracking",
                description: "Real-time tracking system to monitor your order from pharmacy to your doorstep."
              },
              {
                icon: Shield,
                title: "Safe & Secure",
                description: "All transactions and medical data are protected with bank-level security measures."
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                description: "Quick and reliable delivery service ensuring your medicines reach you on time."
              },
              {
                icon: Award,
                title: "Verified Quality",
                description: "All medicines are sourced from licensed manufacturers and undergo strict quality checks."
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Updated Stats Section with Real Data */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
              <p className="text-blue-100">Loading statistics...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <ShoppingBag className="w-12 h-12 text-blue-200 mb-2" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.totalOrders.toLocaleString()}
                </div>
                <div className="text-blue-200 text-lg font-medium">Total Orders</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Pill className="w-12 h-12 text-blue-200 mb-2" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.totalMedicines.toLocaleString()}+
                </div>
                <div className="text-blue-200 text-lg font-medium">Medicines Available</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Activity className="w-12 h-12 text-blue-200 mb-2" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-blue-200 text-lg font-medium">Customer Support</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Award className="w-12 h-12 text-blue-200 mb-2" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  99.9%
                </div>
                <div className="text-blue-200 text-lg font-medium">Quality Guarantee</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Pharmacy Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete pharmaceutical solutions for all your medicine and healthcare product needs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {[
                {
                  title: "Prescription Medicines",
                  description: "Upload your prescription and get genuine medicines delivered to your doorstep with proper verification."
                },
                {
                  title: "Over-the-Counter Products",
                  description: "Wide range of OTC medicines, vitamins, supplements, and healthcare products available instantly."
                },
                {
                  title: "Medicine Information",
                  description: "Detailed product information, usage instructions, and side effects for all medicines in our catalog."
                }
              ].map((service, index) => (
                <div key={index} className="flex items-start space-x-4 bg-gray-50 rounded-2xl p-6 hover:bg-blue-50 transition-all duration-300">
                  <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Customer Support</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-blue-200" />
                  <div>
                    <div className="font-semibold">Order Support</div>
                    <div className="text-blue-200">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-blue-200" />
                  <div>
                    <div className="font-semibold">Email Support</div>
                    <div className="text-blue-200">orders@medicare.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-blue-200" />
                  <div>
                    <div className="font-semibold">Store Locations</div>
                    <div className="text-blue-200">Find nearby pharmacy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Add Review Button */}
      <section className="py-20 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Regular Customer",
                content: "Medicare Pharmacy has been my go-to for all medications. Always genuine products and super fast delivery!"
              },
              {
                name: "Robert Miller",
                role: "Senior Citizen",
                content: "The online ordering is so easy, and they always have my regular medications in stock. Great service!"
              },
              {
                name: "Emma Davis",
                role: "Working Mother",
                content: "Perfect for busy parents! I can order my family's medicines online and they deliver right to our door."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-blue-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Button */}
        <button
          onClick={() => setShowReviewForm(true)}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 z-40"
          title="Add Your Review"
        >
          <Plus className="w-8 h-8" />
        </button>
      </section>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Share Your Review</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewForm.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Share your experience with Medicare Pharmacy..."
                  required
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={reviewForm.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession (Optional)
                </label>
                <input
                  type="text"
                  name="profession"
                  value={reviewForm.profession}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Doctor, Teacher, Student"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Order Your Medicines?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of customers who trust Medicare Pharmacy for their medicine needs. 
            Browse our extensive catalog and get fast, reliable delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/store"
              className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105"
            >
              Browse Medicines
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default Home;