const React = require('react');
const { useState } = require('react');

module.exports = function ProductForm(props) {
  const { onSubmit } = props;
  const [formData, setFormData] = useState({});

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  return React.createElement('form', { onSubmit: e => { e.preventDefault(); onSubmit(formData); } },
    React.createElement('input', { name: 'name', placeholder: 'Name', onChange: handleChange }),
    React.createElement('input', { name: 'brand', placeholder: 'Brand', onChange: handleChange }),
    React.createElement('input', { name: 'dosage', placeholder: 'Dosage', onChange: handleChange }),
    React.createElement('input', { name: 'price', type: 'number', placeholder: 'Price', onChange: handleChange }),
    React.createElement('input', { name: 'stock', type: 'number', placeholder: 'Stock', onChange: handleChange }),
    React.createElement('input', { name: 'category', placeholder: 'Category', onChange: handleChange }),
    React.createElement('input', { name: 'prescriptionRequired', type: 'checkbox', onChange: e => setFormData({ ...formData, prescriptionRequired: e.target.checked }) }),
    React.createElement('textarea', { name: 'description', placeholder: 'Description', onChange: handleChange }),
    React.createElement('input', { name: 'image', placeholder: 'Image URL', onChange: handleChange }),
    React.createElement('button', { type: 'submit' }, 'Submit')
  );
}; 
