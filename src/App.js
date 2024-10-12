import React from 'react';
import ImageGrid from './components/ImageGrid';
import './App.css';

function App() {
  // Placeholder for now, we will later fetch images dynamically from S3
  const images = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg',
    // Add paths to local images
  ];

  return (
    <div className="App">
      <h1>My Photo Gallery</h1>
      <ImageGrid images={images} />
    </div>
  );
}

export default App;
