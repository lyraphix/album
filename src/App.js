// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './components/ImageUpload';
import ImageGrid from './components/ImageGrid';
import Albums from './components/Albums';
import Search from './components/Search';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page with Search and Upload */}
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to My Photo Gallery</h1>
                <Search />
                <ImageUpload />
              </div>
            }
          />
          
          {/* User's Albums Page */}
          <Route path="/u/:username" element={<Albums />} />
          
          {/* Specific Album Page */}
          <Route path="/u/:username/:albumname" element={<ImageGrid />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
