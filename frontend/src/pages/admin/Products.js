const React = require('react');
const { useState, useEffect } = require('react');
const Sidebar = require('../../components/admin/Sidebar');
const ProductForm = require('../../components/admin/ProductForm');
const api = require('../../utils/api');

module.exports = function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/medicines').then(res => setProducts(res.data));
  }, []);

  const addProduct = (data) => api.post('/medicines', data).then(() => window.location.reload());

  return React.createElement('div', { className: 'flex' },
    React.createElement(Sidebar),
    React.createElement('main', { className: 'p-4' },
      React.createElement(ProductForm, { onSubmit: addProduct }),
      products.map(p => React.createElement('div', { key: p._id }, p.name))
    )
  );
}; 
