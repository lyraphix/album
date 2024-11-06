const AWS = require('aws-sdk');

module.exports = async (req, res) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // from Vercel
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // from Vercel
    region: process.env.AWS_REGION, // from Vercel
  });

  const bucketName = process.env.AWS_BUCKET_NAME; // from Vercel

  const params = {
    Bucket: bucketName,
    Prefix: '', // Changed from 'images/' to ''
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    console.log('S3 Data:', data);

    const images = data.Contents.filter((item) => !item.Key.endsWith('/'))
      .map((item) => {
        const imageName = item.Key.split('/').pop(); // Extract the filename
        return {
          key: imageName,
          url: `https://${bucketName}.s3.amazonaws.com/${item.Key}`,
          isLowRes: item.Key.includes('low-res/'),
        };
      });

    // Group images by filename
    const imageMap = {};
    images.forEach((img) => {
      const imageName = img.key;
      if (!imageMap[imageName]) {
        imageMap[imageName] = {};
      }
      if (img.isLowRes) {
        imageMap[imageName].lowRes = img.url;
      } else {
        imageMap[imageName].highRes = img.url;
      }
    });

    const imageArray = Object.values(imageMap);

    res.status(200).json(imageArray);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).send('Error listing images');
  }
};
