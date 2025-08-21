import React from 'react';
import { Heart, Store, Info, Phone, Mail, Clock, MapPin, Shield, Award, Users } from 'lucide-react';

function Footer() {
  return (
    <footer className="text-white mt-12 relative overflow-hidden" style={{background: 'linear-gradient(to bottom right, #1B56FD, #0D47E8, #1B56FD)'}}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mr-3 shadow-lg">
                <Heart className="h-6 w-6" style={{color: '#1B56FD'}} />
              </div>
              <h3 className="text-2xl font-bold text-white">
                MediCare+
              </h3>
            </div>
            <p className="text-white leading-relaxed mb-6">
              Your trusted online pharmacy for all your healthcare needs. Committed to quality, care, and convenience.
            </p>
            
            {/* Trust Badges */}
            <div className="flex space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <div className="w-1 h-6 bg-white rounded-full mr-3"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/store" className="flex items-center text-white hover:text-gray-200 hover:translate-x-2 transition-all duration-300 group">
                  <Store className="h-4 w-4 mr-3 text-white group-hover:text-gray-200" />
                  Store
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center text-white hover:text-gray-200 hover:translate-x-2 transition-all duration-300 group">
                  <Info className="h-4 w-4 mr-3 text-white group-hover:text-gray-200" />
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="flex items-center text-white hover:text-gray-200 hover:translate-x-2 transition-all duration-300 group">
                  <Phone className="h-4 w-4 mr-3 text-white group-hover:text-gray-200" />
                  Contact
                </a>
              </li>
              <li>
                <a href="/services" className="flex items-center text-white hover:text-gray-200 hover:translate-x-2 transition-all duration-300 group">
                  <Heart className="h-4 w-4 mr-3 text-white group-hover:text-gray-200" />
                  Services
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 bg-opacity-20 rounded-lg mr-3 group-hover:bg-opacity-30 transition-all duration-300">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-medium">support@medicareplus.com</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 bg-opacity-20 rounded-lg mr-3 group-hover:bg-opacity-30 transition-all duration-300">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 bg-opacity-20 rounded-lg mr-3 group-hover:bg-opacity-30 transition-all duration-300">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Support</p>
                  <p className="font-medium">24/7 Available</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Location & Hours */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
              Our Location
            </h3>
            <div className="space-y-4">
              <div className="flex items-start text-gray-300 hover:text-white transition-colors duration-300 group">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 bg-opacity-20 rounded-lg mr-3 mt-1 group-hover:bg-opacity-30 transition-all duration-300">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="font-medium leading-relaxed">123 Medical Avenue<br />Health City, HC 12345</p>
                </div>
              </div>
              
              {/* Emergency Notice */}
              <div className="bg-blue-600 bg-opacity-10 border border-blue-600 border-opacity-20 rounded-lg p-4 mt-6">
                <div className="flex items-center text-blue-400 mb-2">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="font-semibold text-sm">Emergency Services</span>
                </div>
                <p className="text-xs text-gray-300">
                  For medical emergencies, call 911 immediately
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400">
                &copy; 2025 <span className="text-white font-semibold">MediCare+</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Licensed pharmacy committed to your health and wellness
              </p>
            </div>
            
            {/* Social Links Placeholder */}
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 cursor-pointer">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;