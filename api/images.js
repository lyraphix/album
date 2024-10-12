const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');  // Import CORS
const app = express();
require('dotenv').config();  // Load environment variables

// Enable CORS for all routes
app.use(cors());

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',  // Make sure to set the correct region here
  });
  

app.get('/api/images', (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      console.error('Error fetching images:', err);
      return res.status(500).json({ error: 'Error fetching images' });
    }

    // Map each object to its S3 URL
    const imageUrls = data.Contents.map(item => `https://${params.Bucket}.s3.amazonaws.com/${item.Key}`);

    res.json(imageUrls);
  });
});

// Vercel will handle port binding automatically, no need for app.listen()
