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
      Delimiter: '/',
    };

    const data = await s3.listObjectsV2(params).promise();
    const albumPrefixes = data.CommonPrefixes || [];

    const albums = await Promise.all(
      albumPrefixes.map(async (prefixObj) => {
        const albumName = prefixObj.Prefix.split('/')[2]; // Extract album name from the prefix
        const hiResParams = {
          Bucket: bucketName,
          Prefix: `users/${username}/${albumName}/hi-res/`,
        };

        const hiResData = await s3.listObjectsV2(hiResParams).promise();
        const latestImageKey = hiResData.Contents.sort(
          (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
        )[0]?.Key;

        const latestImageUrl = latestImageKey
          ? `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${latestImageKey}`
          : null;

        return {
          albumName,
          latestImageUrl,
        };
      })
    );

    res.status(200).json(albums.filter((album) => album.albumName));
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Error fetching albums.' });
  }
};
