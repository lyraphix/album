// src/components/ImageModal.js

import React from 'react';
import './ImageModal.css';

const ImageModal = ({ image, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={image} alt="High Resolution" />
      </div>
    </div>
  );
};

export default ImageModal;
