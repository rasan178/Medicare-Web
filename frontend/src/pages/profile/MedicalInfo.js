const React = require('react');
const { useState, useEffect, useContext } = require('react');
const AuthContext = require('../../context/AuthContext').AuthContext;
const api = require('../../utils/api');

module.exports = function MedicalInfo() {
  const { user } = useContext(AuthContext);
  const [medical, setMedical] = useState({});

  useEffect(() => {
    api.get('/auth/profile').then(res => setMedical(res.data.medical));
  }, []);

  const handleChange = e => setMedical({ ...medical, [e.target.name]: e.target.value });

  const onSubmit = () => api.put('/auth/medical', medical);

  return React.createElement('form', { onSubmit: onSubmit, className: 'p-4' },
    React.createElement('input', { name: 'dob', type: 'date', value: medical.dob || '', onChange: handleChange }),
    React.createElement('input', { name: 'allergies', placeholder: 'Allergies', value: medical.allergies || '', onChange: handleChange }),
    React.createElement('input', { name: 'conditions', placeholder: 'Conditions', value: medical.conditions || '', onChange: handleChange }),
    React.createElement('input', { name: 'medications', placeholder: 'Medications', value: medical.medications || '', onChange: handleChange }),
    React.createElement('button', { type: 'submit' }, 'Update')
  );
}; 
