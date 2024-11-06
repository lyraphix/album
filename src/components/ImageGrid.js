import React, { useState } from 'react';
import ImageModal from './ImageModal';
import './ImageGrid.css';

const ImageGrid = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="grid">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.lowRes}
          alt="Gallery"
          loading="lazy"
          onClick={() => setSelectedImage(image.highRes)}
        />
      ))}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default ImageGrid;
