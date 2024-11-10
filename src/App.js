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
        <h1 className="main-header">Album</h1>
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Search />
                  <ImageUpload />
                </>
              }
            />
            <Route path="/u/:username" element={<Albums />} />
            <Route path="/u/:username/:albumname" element={<ImageGrid />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
