// src/components/ImageUpload.js

import React, { useState } from 'react';
import ProgressCircle from './ProgressCircle'; // Assuming you have a progress component

const ImageUpload = ({ username, albumname, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate file types
    const validImages = files.filter(file => file.type.startsWith('image/'));
    if (validImages.length !== files.length) {
      alert('Some files were not images and have been excluded.');
    }
    setSelectedFiles(validImages);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select image files to upload.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('albumname', albumname);
    selectedFiles.forEach(file => {
      formData.append('image', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.text();
      console.log(result);
      alert('Images uploaded successfully!');
      setSelectedFiles([]);
      onUploadSuccess(); // Callback to refresh image grid if needed
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('There was an error uploading your images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
        {uploading ? 'Uploading...' : 'Upload Images'}
      </button>
      {uploading && <ProgressCircle />}
      <div className="selected-files">
        {selectedFiles.map((file, index) => (
          <div key={index} className="selected-file">
            <img src={URL.createObjectURL(file)} alt={file.name} />
            <p>{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
