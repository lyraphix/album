import React, { useState } from 'react';

const ImageUpload = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileInput = e.target.elements.image;
    const file = fileInput.files[0];

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      setMessage(text);
    } catch (err) {
      console.error('Error uploading the file:', err);
      setMessage('Error uploading the file');
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" accept="image/*" />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ImageUpload;
