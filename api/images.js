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
    Prefix: 'images/', // Adjust if needed
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    const images = data.Contents.filter((item) => !item.Key.endsWith('/'))
      .map((item) => {
        const imageName = item.Key.replace('images/', '');
        return {
          key: imageName,
          url: `https://${bucketName}.s3.amazonaws.com/${item.Key}`,
          isLowRes: item.Key.includes('low-res/'),
        };
      });

    // Group images by name
    const imageMap = {};
    images.forEach((img) => {
      const name = img.key.replace('low-res/', '');
      if (!imageMap[name]) {
        imageMap[name] = {};
      }
      if (img.isLowRes) {
        imageMap[name].lowRes = img.url;
      } else {
        imageMap[name].highRes = img.url;
      }
    });

    const imageArray = Object.values(imageMap);

    res.status(200).json(imageArray);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).send('Error listing images');
  }
};
