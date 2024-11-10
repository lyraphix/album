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
    const params = {
      Bucket: bucketName,
      Prefix: `users/${username}/`,
    };

    const data = await s3.listObjectsV2(params).promise();
    const allKeys = data.Contents;

    // Collect album names
    const albumNamesSet = new Set();
    allKeys.forEach((item) => {
      const keyParts = item.Key.split('/');
      if (keyParts.length >= 4) {
        const albumName = keyParts[2];
        albumNamesSet.add(albumName);
      }
    });

    const albumNames = Array.from(albumNamesSet);

    // Retrieve low-res image for each album
    const albums = await Promise.all(
      albumNames.map(async (albumName) => {
        const lowResParams = {
          Bucket: bucketName,
          Prefix: `users/${username}/${albumName}/low-res/`,
        };

        const lowResData = await s3.listObjectsV2(lowResParams).promise();
        const lowResKeys = lowResData.Contents;

        if (lowResKeys.length === 0) {
          return null;
        }

        lowResKeys.sort((a, b) => b.LastModified - a.LastModified);
        const latestLowRes = lowResKeys[0];
        const latestImageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${latestLowRes.Key}`;

        return {
          albumName,
          latestImageUrl,
        };
      })
    );

    const filteredAlbums = albums.filter((album) => album !== null);
    res.status(200).json(filteredAlbums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Error fetching albums.' });
  }
};
