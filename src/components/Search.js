// src/components/Search.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageUpload.css'; // Use the same CSS for consistent styling

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
      <h2>search Albums</h2>
      <form onSubmit={handleSubmit} className="form-inline">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          name="albumname"
          placeholder="Album Name (Optional)"
          value={albumname}
          onChange={(e) => setAlbumname(e.target.value)}
        />
        <button type="submit">search</button>
      </form>
    </div>
  );
};

export default Search;
