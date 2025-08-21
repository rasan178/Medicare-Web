const React = require('react');
const { useState, useContext } = require('react');
const AuthContext = require('../../context/AuthContext').AuthContext;

module.exports = function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(formData);
  };

  return React.createElement('form', { onSubmit: onSubmit, className: 'p-4' },
    React.createElement('input', { name: 'email', placeholder: 'Email', onChange: handleChange }),
    React.createElement('input', { name: 'password', type: 'password', placeholder: 'Password', onChange: handleChange }),
    React.createElement('button', { type: 'submit' }, 'Login')
  );
};
