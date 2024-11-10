// src/components/Search.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const [username, setUsername] = useState('');
  const [albumname, setAlbumname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      if (albumname) {
        navigate(`/u/${username}/${albumname}`);
      } else {
        navigate(`/u/${username}`);
      }
    }
  };

  return (
    <div className="image-upload-container">
      <h2>Search Albums</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          value={albumname}
          placeholder="Album Name (Optional)"
          onChange={(e) => setAlbumname(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
