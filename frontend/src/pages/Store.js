const React = require('react');
const { useState, useEffect } = require('react');
const Navbar = require('../components/Navbar');
const Footer = require('../components/Footer');
const MedicineCard = require('../components/MedicineCard');
const api = require('../utils/api');

module.exports = function Store() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    api.get('/medicines').then(res => setMedicines(res.data));
  }, []);

  return React.createElement('div', null,
    React.createElement(Navbar),
    React.createElement('div', { className: 'grid grid-cols-4 gap-4 p-4' },
      medicines.map(med => React.createElement(MedicineCard, { key: med._id, medicine: med }))
    ),
    React.createElement(Footer)
  );
};
