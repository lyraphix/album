// src/components/ImageUpload.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ImageUpload = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const files = e.target.elements.image.files;
    const username = e.target.elements.username.value.trim();
    const albumname = e.target.elements.albumname.value.trim();
  
    if (!username || !albumname) {
      setMessage('Please enter both username and album name.');
      return;
    }
  
    if (files.length === 0) {
      setMessage('Please select at least one file');
      return;
    }
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('albumname', albumname);
  
    // Append all selected files to the form data
    for (let i = 0; i < files.length; i++) {
      formData.append('image', files[i]);
    }
    // For debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      const text = await res.text();
      setMessage(text);
  
      // Redirect to the album page
      navigate(`/u/${username}/${albumname}`);
    } catch (err) {
      console.error('Error uploading the files:', err);
      setMessage('Error uploading the files');
    }
  };  

  return (
    <div>
      <h2>Upload Images</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="text" name="albumname" placeholder="Album Name" required />
        <input type="file" name="image" accept="image/*" multiple required />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ImageUpload;
