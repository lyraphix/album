import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import './ImageGrid.css';

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch('/api/images')
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);
  

  return (
    <div className="grid">
      {images.map((image, index) => (
        <img key={index} src={image} alt="Gallery" onClick={() => setSelectedImage(image)} />
      ))}
      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default ImageGrid;
