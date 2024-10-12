import React from 'react';
import './ImageModal.css';

const ImageModal = ({ image, onClose }) => {
  return (
    <div className="modal" onClick={onClose}>
      <img src={image} alt="Enlarged" />
    </div>
  );
};

export default ImageModal;
