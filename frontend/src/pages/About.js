import React, { useState, useEffect } from 'react';
import { Shield, Heart, Truck, Clock, Award, Users, Phone, Mail, MapPin, Stethoscope, PillBottle, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalMedicines: 0,
    totalRevenue: '0.00'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutStats();
  }, []);

  const fetchAboutStats = async () => {
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
      console.error('About stats fetch error:', err);
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

  const services = [
    {
      icon: <PillBottle className="h-8 w-8" />,
      title: "Prescription Medications",
      description: "Wide range of prescription drugs from certified suppliers"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "OTC Products",
      description: "Over-the-counter medications and health supplements"
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Health Monitoring",
      description: "Regular health check-ups and wellness consultations"
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Online Consultation",
      description: "Connect with licensed pharmacists and healthcare professionals"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Home Delivery",
      description: "Fast and secure delivery to your doorstep"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service and emergency assistance"
    }
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Licensed Pharmacists",
      description: "All prescriptions reviewed by certified professionals"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Quality Assurance",
      description: "Rigorous quality control and safety standards"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Patient Privacy",
      description: "Complete confidentiality and secure transactions"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Competitive Prices",
      description: "Affordable healthcare solutions for everyone"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              About <span className="text-blue-200">MediCare+</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in health and wellness, delivering quality healthcare 
              solutions with the convenience of modern technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We are committed to revolutionizing healthcare access by combining cutting-edge 
              technology with compassionate care, ensuring every patient receives the highest 
              quality medications and healthcare services from the comfort of their home.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive healthcare solutions tailored to your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MediCare+?</h2>
            <p className="text-xl text-gray-600">Excellence in every aspect of healthcare delivery</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 mx-auto group-hover:bg-blue-700 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Same as Home Page */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
              <p className="text-blue-100">Loading statistics...</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-8 text-center">
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-12 h-12 text-blue-200 mb-2" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.totalOrders.toLocaleString()}
                </div>
                <div className="text-blue-200 text-lg font-medium">Total Orders</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <PillBottle className="w-12 h-12 text-blue-200 mb-2" />
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
                  <Clock className="w-12 h-12 text-blue-200 mb-2" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  15+
                </div>
                <div className="text-blue-200 text-lg font-medium">Years of Experience</div>
              </div>
              
              <div className="group">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="w-12 h-12 text-blue-200 mb-2" />
                </div>
                <div className="text-5xl lg:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="text-blue-200 text-lg font-medium">Number of Outlets</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl text-gray-300">Get in touch with our healthcare professionals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 mx-auto group-hover:bg-blue-500 transform group-hover:scale-110 transition-all duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Phone Support</h3>
              <p className="text-gray-300 mb-2">24/7 Emergency Hotline</p>
              <p className="text-blue-400 font-semibold">+1 (555) 123-4567</p>
            </div>
            
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 mx-auto group-hover:bg-blue-500 transform group-hover:scale-110 transition-all duration-300">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email Support</h3>
              <p className="text-gray-300 mb-2">Quick Response Team</p>
              <p className="text-blue-400 font-semibold">support@medicareplus.com</p>
            </div>
            
            <div className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6 mx-auto group-hover:bg-blue-500 transform group-hover:scale-110 transition-all duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Main Location</h3>
              <p className="text-gray-300 mb-2">Healthcare Center</p>
              <p className="text-blue-400 font-semibold">123 Medical Ave, Health City</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-blue-600 inline-block px-8 py-4 rounded-2xl hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
              <p className="text-lg font-semibold">Ready to get started?</p>
              <p className="text-blue-200 text-sm">Contact us today for personalized healthcare solutions</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;