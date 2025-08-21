const React = require('react');

module.exports = function PrescriptionUpload(props) {
  const { onUpload } = props;

  return React.createElement('input', { type: 'file', onChange: onUpload, accept: 'image/*, .pdf' });
}; 
