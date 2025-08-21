// frontend/src/pages/admin/Reports.js
import React from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';

function Reports() {
  const handleGeneratePDF = () => {
    window.location.href = '/api/admin/reports?type=pdf';
  };

  const handleGenerateExcel = () => {
    window.location.href = '/api/admin/reports?type=excel';
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-6">Reports</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Sales Report</h2>
              <p className="text-gray-600 mb-4">
                Generate comprehensive sales reports with detailed analytics
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleGeneratePDF}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Export as PDF
                </button>
                <button
                  onClick={handleGenerateExcel}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Export as Excel
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Products:</span>
                  <span className="font-semibold">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-semibold">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold">$--</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Statistics will be loaded from API
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reports;