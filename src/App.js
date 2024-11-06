import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import ImageGrid from './components/ImageGrid';
import './App.css';

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/api/images')
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  return (
    <div className="App">
      <h1>album: scans</h1>
      <ImageUpload setImages={setImages} />
      <ImageGrid images={images} />
    </div>
  );
}

export default App;
