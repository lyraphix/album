// src/components/ImageUpload.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressCircle from './ProgressCircle';

const ImageUpload = () => {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [currentImageName, setCurrentImageName] = useState('');
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

    // Initialize progress state
    setTotalImages(files.length);
    setUploading(true);
    setCurrentImageIndex(0);

    try {
      for (let i = 0; i < files.length; i++) {
        setCurrentImageName(files[i].name);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('albumname', albumname);
        formData.append('image', files[i]);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Failed to upload ${files[i].name}`);
        }

        setCurrentImageIndex(i + 1);
      }

      setMessage('Images uploaded and processed successfully');

      // Navigate to the album page after a brief delay to show 100% progress
      setTimeout(() => {
        navigate(`/u/${username}/${albumname}`);
      }, 500);
    } catch (err) {
      console.error('Error uploading the files:', err);
      setMessage('Error uploading the files');
      setUploading(false);
    }
  };

  return (
    <div>
      {!uploading ? (
        <>
          <h2>make an album</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" required />
            <input type="text" name="albumname" placeholder="Album Name" required />
            <input type="file" name="image" accept="image/*" multiple required />
            <button type="submit">Upload</button>
          </form>
          <p>{message}</p>
        </>
      ) : (
        <div>
          <h2>Uploading Images</h2>
          <p>Uploading: {currentImageName}</p>
          <ProgressCircle current={currentImageIndex} total={totalImages} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
