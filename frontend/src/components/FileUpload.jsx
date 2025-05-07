import React from 'react';

const FileUpload = ({ onUpload }) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return <input type="file" onChange={handleChange} />;
};

export default FileUpload;
