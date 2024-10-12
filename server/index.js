const express = require('express');
const AWS = require('aws-sdk');
const app = express();
require('dotenv').config();  // Load environment variables

const port = process.env.PORT || 3001;

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',  // Your S3 bucket region
});

app.get('/images', (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,  // Your S3 bucket name from .env
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error('Error fetching images:', err);
      return res.status(500).json({ error: 'Error fetching images' });
    }

    // Map each object to its S3 URL
    const imageUrls = data.Contents.map(item => {
        return `https://${params.Bucket}.s3.amazonaws.com/${item.Key}`;
    });
      

    res.json(imageUrls);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
