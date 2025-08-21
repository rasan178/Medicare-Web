import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
// import api from '../../utils/api';

function MedicalInfo() {
  const { user } = useContext(AuthContext);
  const [medical, setMedical] = useState({
    dob: '',
    allergies: '',
    conditions: '',
    medications: ''
  });

  useEffect(() => {
    // Mock API call - replace with actual API
    // api.get('/auth/profile').then(res => setMedical(res.data.medical || {}));
    setMedical({
      dob: '1990-01-01',
      allergies: 'Peanuts, Shellfish',
      conditions: 'Hypertension',
      medications: 'Lisinopril 10mg daily'
    });
  }, []);

  const handleChange = (e) => {
    setMedical({ ...medical, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // await api.put('/auth/medical', medical);
      console.log('Medical info updated:', medical);
      alert('Medical information updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update medical information');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Medical Information</h1>
          
          <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List any allergies (e.g., Peanuts, Penicillin)"
                value={medical.allergies || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                name="conditions"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List any medical conditions"
                value={medical.conditions || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <textarea
                name="medications"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List current medications and dosages"
                value={medical.medications || ''}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Information
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
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