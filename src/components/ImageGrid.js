import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';
import './ImageGrid.css';

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch('/api/images')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched images:', data);
        setImages(data);
      })
      .catch((error) => console.error('Error fetching images:', error));
  }, []);



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
      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};

export default ImageGrid;
