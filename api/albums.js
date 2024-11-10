// api/albums.js

const AWS = require('aws-sdk');

module.exports = async (req, res) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const bucketName = process.env.AWS_BUCKET_NAME;
  const { username } = req.query;

  if (!username) {
    res.status(400).json({ error: 'Username is required.' });
    return;
  }

  try {
    // List all objects for the user
    const params = {
      Bucket: bucketName,
      Prefix: `users/${username}/`,
    };

    const data = await s3.listObjectsV2(params).promise();
    const allKeys = data.Contents;

    // Extract unique album names
    const albumNamesSet = new Set();
    allKeys.forEach((item) => {
      const keyParts = item.Key.split('/');
      if (keyParts.length >= 4) {
        // users/{username}/{albumname}/hi-res/{filename}
        const albumName = keyParts[2];
        albumNamesSet.add(albumName);
      }
    });

    const albumNames = Array.from(albumNamesSet);

    // For each album, find the most recent image in hi-res and get low-res URL
    const albums = await Promise.all(
      albumNames.map(async (albumName) => {
        const hiResParams = {
          Bucket: bucketName,
          Prefix: `users/${username}/${albumName}/hi-res/`,
        };

        const hiResData = await s3.listObjectsV2(hiResParams).promise();
        const hiResKeys = hiResData.Contents;

        if (hiResKeys.length === 0) {
          return null; // Skip albums with no hi-res images
        }

        // Sort hi-res images by LastModified descending
        hiResKeys.sort((a, b) => b.LastModified - a.LastModified);
        const latestHiRes = hiResKeys[0];

        // Derive low-res image key
        const lowResKey = latestHiRes.Key.replace('/hi-res/', '/low-res/');
        const lowResUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${lowResKey}`;

        return {
          albumName,
          latestImageUrl: lowResUrl, // Use low-res for cover
        };
      })
    );

    // Filter out any null albums
    const filteredAlbums = albums.filter((album) => album !== null);

    res.status(200).json(filteredAlbums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Error fetching albums.' });
  }
};
