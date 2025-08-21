const React = require('react');
const { useContext } = require('react');
const CartContext = require('../context/CartContext').CartContext;

module.exports = function MedicineCard(props) {
  const { medicine } = props;
  const { addToCart } = useContext(CartContext);

  return React.createElement('div', { className: 'border p-4 rounded' },
    React.createElement('img', { src: medicine.image, alt: medicine.name, className: 'w-full h-32 object-cover' }),
    React.createElement('h3', null, medicine.name),
    React.createElement('p', null, medicine.brand),
    React.createElement('p', null, medicine.dosage),
    React.createElement('p', null, `$${medicine.price}`),
    React.createElement('p', null, `Stock: ${medicine.stock}`),
    React.createElement('p', null, medicine.category),
    React.createElement('p', null, medicine.prescriptionRequired ? 'Prescription Required' : ''),
    React.createElement('p', null, medicine.description),
    React.createElement('button', { onClick: () => addToCart(medicine), className: 'bg-green-500 p-2' }, 'Add to Cart'),
    React.createElement('button', { className: 'bg-blue-500 p-2 ml-2' }, 'View Details')
  );
}; 
