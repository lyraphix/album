const formidable = require('formidable');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files');
        res.status(500).send('Internal server error');
        return;
      }

      let uploadedFiles = files.image;

      if (!uploadedFiles) {
        res.status(400).send('No files uploaded');
        return;
      }

      // Ensure uploadedFiles is an array
      if (!Array.isArray(uploadedFiles)) {
        uploadedFiles = [uploadedFiles];
      }

      try {
        // Initialize AWS S3 client
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID, // from Vercel
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // from Vercel
          region: process.env.AWS_REGION, // from Vercel
        });

        const bucketName = process.env.AWS_BUCKET_NAME; // from Vercel

        for (const file of uploadedFiles) {
          // Read the file from the temporary location
          const fileData = fs.readFileSync(file.filepath); // Updated here

          // Generate a low-resolution version
          const lowResImage = await sharp(fileData)
            .resize({ width: 200 })
            .toBuffer();

          const fileName = file.originalFilename; // Use originalFilename instead of name

          // Upload original image to root of bucket
          await s3
            .upload({
              Bucket: bucketName,
              Key: `${fileName}`, // Stored at root
              Body: fileData,
              ACL: 'public-read',
            })
            .promise();

          // Upload low-res image to 'low-res/' directory
          await s3
            .upload({
              Bucket: bucketName,
              Key: `low-res/${fileName}`,
              Body: lowResImage,
              ACL: 'public-read',
            })
            .promise();

          console.log(`Processed and uploaded ${fileName}`);
        }

        res.status(200).send('Images uploaded and processed successfully');
      } catch (error) {
        console.error('Error processing the images:', error);
        res.status(500).send('Error processing the images');
      }
    });
  } else {
    res.status(405).send('Method not allowed');
  }
};
