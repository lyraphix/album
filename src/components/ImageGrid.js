// src/components/ImageGrid.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ImageModal from './ImageModal';
import './ImageGrid.css';

const ImageGrid = () => {
  const { username, albumname } = useParams();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/images?username=${username}&albumname=${albumname}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched images:', data); // For debugging
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [username, albumname]);

  return (
    <div className="image-grid-container">
      <h2>{`${username}'s Album: ${albumname}`}</h2>
      <div className="grid">
        {images.map((image) => (
          <img
            key={image.imageId} // Use unique imageId as key
            src={image.lowres}
            alt={image.fileName}
            loading="lazy"
            onClick={() => setSelectedImage(image.hires)}
            className="grid-image"
          />
        ))}
      </div>
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ImageGrid;
