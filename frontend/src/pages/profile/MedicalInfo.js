import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../utils/api';

function MedicalInfo() {
  const { user } = useContext(AuthContext);
  const [medical, setMedical] = useState({
    dob: '',
    allergies: '',
    conditions: '',
    medications: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMedicalInfo();
  }, []);

  const fetchMedicalInfo = async () => {
    try {
      const response = await api.get('/auth/profile');
      const medicalData = response.data.medical || {};
      
      setMedical({
        dob: medicalData.dob ? medicalData.dob.split('T')[0] : '',
        allergies: Array.isArray(medicalData.allergies) ? medicalData.allergies.join(', ') : '',
        conditions: Array.isArray(medicalData.conditions) ? medicalData.conditions.join(', ') : '',
        medications: Array.isArray(medicalData.medications) ? medicalData.medications.join(', ') : ''
      });
    } catch (err) {
      console.error('Error fetching medical info:', err);
      setError('Failed to load medical information');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMedical({ ...medical, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/auth/medical', medical);
      setSuccess('Medical information updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.msg || 'Failed to update medical information');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !medical.dob && !medical.allergies) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Medical Information</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={medical.dob || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies
              </label>
              <textarea
                name="allergies"
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List any allergies separated by commas (e.g., Peanuts, Penicillin)"
                value={medical.allergies || ''}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple allergies with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                name="conditions"
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List any medical conditions separated by commas"
                value={medical.conditions || ''}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple conditions with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <textarea
                name="medications"
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List current medications and dosages separated by commas"
                value={medical.medications || ''}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple medications with commas</p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Updating...' : 'Update Information'}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MedicalInfo;