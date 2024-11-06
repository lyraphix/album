// process-images.js

require('dotenv').config();

const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Ensure this is set in your .env file
});

// Parameters
const bucketName = process.env.AWS_BUCKET_NAME;
const inputFolder = path.join(__dirname, 'images', 'high-res');
const outputFolder = path.join(__dirname, 'images', 'low-res');

// Ensure output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Read all files in the input folder
fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Error reading input folder:', err);
    return;
  }

  files.forEach((file) => {
    const inputFile = path.join(inputFolder, file);
    const outputFile = path.join(outputFolder, file);

    // Process image
    sharp(inputFile)
      .resize({ width: 200 }) // Adjust width as needed
      .toFile(outputFile)
      .then(() => {
        console.log(`Processed ${file}`);
        // Upload low-res image to S3
        uploadToS3(outputFile, `low-res/${file}`);
      })
      .catch((err) => {
        console.error(`Error processing ${file}:`, err);
      });
  });
});

// Function to upload a file to S3
function uploadToS3(filePath, key) {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: key, // Include 'low-res/' prefix
    Body: fileContent,
    ContentType: 'image/jpeg', // Adjust if using other image formats
    ACL: 'public-read', // Make the object publicly readable
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.error(`Error uploading ${key}:`, err);
    } else {
      console.log(`Uploaded ${key} to ${data.Location}`);
    }
  });
}
