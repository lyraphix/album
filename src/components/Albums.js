// src/components/Albums.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Albums.css';

const Albums = () => {
  const { username } = useParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch albums from the backend
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`/api/albums?username=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [username]);

  if (loading) {
    return <p>Loading albums...</p>;
  }

  if (albums.length === 0) {
    return <p>No albums found for user "{username}".</p>;
  }

  return (
    <div className="albums-container">
      <h2>albums: {username}</h2>
      <div className="albums-grid">
        {albums.map((album) => (
          <Link
            to={`/u/${username}/${album.albumName}`}
            key={album.albumName}
            className="album-card"
          >
            <img src={album.latestImageUrl} alt={album.albumName} />
            <div className="album-name">{album.albumName}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Albums;
