import React from 'react';
import ImageGrid from './components/ImageGrid';
import './App.css';
import ImageUpload from './components/ImageUpload';

function App() {
  return (
    <div className="App">
      <h1>album: scans</h1>
      <ImageUpload />
      <ImageGrid />
    </div>
  );
}

export default App;
