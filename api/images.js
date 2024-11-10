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

  let allKeys = [];
  let continuationToken = null;

  try {
    do {
      const params = {
        Bucket: bucketName,
        Prefix: `users/${username}/${albumname}/`,
        ContinuationToken: continuationToken,
      };

      const data = await s3.listObjectsV2(params).promise();

      console.log('S3 Data:', data);

      allKeys = allKeys.concat(data.Contents);

      continuationToken = data.IsTruncated ? data.NextContinuationToken : null;
    } while (continuationToken);

    // Filter out directories and map image data
    const images = allKeys
      .filter((item) => !item.Key.endsWith('/'))
      .map((item) => {
        const keyParts = item.Key.split('/');
        const fileName = keyParts[keyParts.length - 1]; // Get the filename
        const resolutionFolder = keyParts[keyParts.length - 2]; // 'hi-res' or 'low-res'
        const resolution = resolutionFolder.replace('-', ''); // 'hires' or 'lowres'

        // Generate a unique imageId based on the path without the resolution folder
        const imageId = keyParts.slice(0, -2).join('/') + '/' + fileName;

        return {
          imageId: imageId,
          fileName: fileName,
          url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
          resolution: resolution,
        };
      });

    // Group images by imageId
    const imageMap = {};
    images.forEach((img) => {
      const imageId = img.imageId;
      if (!imageMap[imageId]) {
        imageMap[imageId] = {};
      }
      imageMap[imageId][img.resolution] = img.url;
    });

    const imageArray = Object.values(imageMap);

    res.status(200).json(imageArray);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).send('Error listing images');
  }
};
