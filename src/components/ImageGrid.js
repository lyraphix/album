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
    fetch(`/api/images?username=${username}&albumname=${albumname}`)
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((error) => console.error('Error fetching images:', error));
  }, [username, albumname]);

  return (
    <div>
      <h2>{`${username}'s album: ${albumname}`}</h2>
      <div className="grid">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.lowres}
            alt="Gallery"
            loading="lazy"
            onClick={() => setSelectedImage(image.hires)}
          />
        ))}
      </div>
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default ImageGrid;
