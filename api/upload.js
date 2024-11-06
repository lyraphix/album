const formidable = require('formidable');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs'); // Added fs module

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files');
        res.status(500).send('Internal server error');
        return;
      }

      const file = files.image;

      if (!file) {
        res.status(400).send('No file uploaded');
        return;
      }

      try {
        // Read the file from the temporary location
        const fileData = fs.readFileSync(file.path);

        // Initialize AWS S3 client
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID, // from Vercel
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // from Vercel
          region: process.env.AWS_REGION, // from Vercel
        });

        // Generate a low-resolution version
        const lowResImage = await sharp(fileData)
          .resize({ width: 200 })
          .toBuffer();

        // Define S3 upload parameters
        const bucketName = process.env.AWS_BUCKET_NAME; // from Vercel
        const fileName = file.name; // Original file name

        // Upload original image
        await s3
          .upload({
            Bucket: bucketName,
            Key: `images/${fileName}`,
            Body: fileData,
            ACL: 'public-read',
          })
          .promise();

        // Upload low-res image
        await s3
          .upload({
            Bucket: bucketName,
            Key: `images/low-res/${fileName}`,
            Body: lowResImage,
            ACL: 'public-read',
          })
          .promise();

        res.status(200).send('Image uploaded and processed successfully');
      } catch (error) {
        console.error('Error processing the image:', error);
        res.status(500).send('Error processing the image');
      }
    });
  } else {
    res.status(405).send('Method not allowed');
  }
};
