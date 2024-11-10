// api/images.js

const AWS = require('aws-sdk');
const path = require('path');

module.exports = async (req, res) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const bucketName = process.env.AWS_BUCKET_NAME;
  const { username, albumname } = req.query;

  if (!username || !albumname) {
    res.status(400).json({ error: 'Username and album name are required.' });
    return;
  }

  try {
    const params = { Bucket: bucketName, Prefix: `users/${username}/${albumname}/` };
    const allKeys = [];
    let continuationToken = null;

    // Fetch all images with pagination handling
    do {
      const data = await s3.listObjectsV2({ ...params, ContinuationToken: continuationToken }).promise();
      allKeys.push(...data.Contents);
      continuationToken = data.IsTruncated ? data.NextContinuationToken : null;
    } while (continuationToken);

    // Map out image data, separating low-res and high-res versions by resolution
    const images = allKeys
      .filter((item) => !item.Key.endsWith('/'))
      .map((item) => {
        const fileName = path.basename(item.Key);
        const resolution = item.Key.includes('hi-res') ? 'hires' : 'lowres';
        return {
          imageId: path.parse(fileName).name,
          fileName,
          url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
          resolution,
        };
      });

    // Group images by imageId and ensure both resolutions exist
    const imageMap = images.reduce((acc, img) => {
      if (!acc[img.imageId]) acc[img.imageId] = { imageId: img.imageId, fileName: img.fileName };
      acc[img.imageId][img.resolution] = img.url;
      return acc;
    }, {});

    const imageArray = Object.values(imageMap).filter((img) => img.lowres && img.hires);

    res.status(200).json(imageArray);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: 'Error listing images' });
  }
};
