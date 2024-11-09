// api/images.js

const AWS = require('aws-sdk');

module.exports = async (req, res) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // from Vercel
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // from Vercel
    region: process.env.AWS_REGION, // from Vercel
  });

  const bucketName = process.env.AWS_BUCKET_NAME; // from Vercel

  const { username, albumname } = req.query;

  if (!username || !albumname) {
    res.status(400).json({ error: 'Username and album name are required.' });
    return;
  }

  const params = {
    Bucket: bucketName,
    Prefix: `users/${username}/albums/${albumname}/`,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    console.log('S3 Data:', data);

    const images = data.Contents.filter((item) => !item.Key.endsWith('/'))
      .map((item) => {
        const keyParts = item.Key.split('/');
        const imageName = keyParts[keyParts.length - 1]; // Get the filename
        const resolution = keyParts[keyParts.length - 2]; // 'hires' or 'lowres'

        return {
          key: imageName,
          url: `https://${bucketName}.s3.amazonaws.com/${item.Key}`,
          resolution: resolution,
        };
      });

    // Group images by filename
    const imageMap = {};
    images.forEach((img) => {
      const imageName = img.key;
      if (!imageMap[imageName]) {
        imageMap[imageName] = {};
      }
      imageMap[imageName][img.resolution] = img.url;
    });

    const imageArray = Object.values(imageMap);

    res.status(200).json(imageArray);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).send('Error listing images');
  }
};
