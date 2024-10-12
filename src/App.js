import React from 'react';
import ImageGrid from './components/ImageGrid';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>album: scans</h1>
      {/* Remove hardcoded images and fetch from backend */}
      <ImageGrid />
    </div>
  );
}

export default App;
