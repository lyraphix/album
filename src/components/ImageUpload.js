import React, { useState } from 'react';

const ImageUpload = ({ setImages }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const files = e.target.elements.image.files;

    if (files.length === 0) {
      setMessage('Please select at least one file');
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('image', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      setMessage(text);

      // Fetch updated images without reloading the page
      const updatedImages = await fetch('/api/images').then((res) => res.json());
      setImages(updatedImages);
    } catch (err) {
      console.error('Error uploading the files:', err);
      setMessage('Error uploading the files');
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" accept="image/*" multiple />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ImageUpload;
