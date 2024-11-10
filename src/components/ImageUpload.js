// src/components/ImageUpload.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressCircle from './ProgressCircle';
import imageCompression from 'browser-image-compression'; // Ensure this is installed
import './ImageUpload.css'; // Import the CSS file

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

        // Client-side image compression and resizing
        const options = {
          maxSizeMB: 1, // Adjust based on desired quality and size
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(files[i], options);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('albumname', albumname);
        formData.append('image', compressedFile);

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
    <div className="container">
      {!uploading ? (
        <>
          <h2>create an Album</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <input
              type="text"
              name="albumname"
              placeholder="Album Name"
              required
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              multiple
              required
            />
            <button type="submit">Upload</button>
          </form>
          <p>{message}</p>
        </>
      ) : (
        <div className="uploading-section">
          <h2>uploading images</h2>
          <p>uploading: {currentImageName}</p>
          <ProgressCircle current={currentImageIndex} total={totalImages} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
