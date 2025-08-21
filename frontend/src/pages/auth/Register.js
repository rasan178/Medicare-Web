const React = require('react');
const { useState, useContext } = require('react');
const AuthContext = require('../../context/AuthContext').AuthContext;

module.exports = function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const { register } = useContext(AuthContext);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    register(formData);
  };

  return React.createElement('form', { onSubmit: onSubmit, className: 'p-4' },
    React.createElement('input', { name: 'name', placeholder: 'Name', onChange: handleChange }),
    React.createElement('input', { name: 'email', placeholder: 'Email', onChange: handleChange }),
    React.createElement('input', { name: 'password', type: 'password', placeholder: 'Password', onChange: handleChange }),
    React.createElement('input', { name: 'phone', placeholder: 'Phone', onChange: handleChange }),
    React.createElement('input', { name: 'address', placeholder: 'Address', onChange: handleChange }),
    React.createElement('button', { type: 'submit' }, 'Register')
  );
};
