// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './components/ImageUpload';
import ImageGrid from './components/ImageGrid';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/u/:username/:albumname" element={<ImageGrid />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
