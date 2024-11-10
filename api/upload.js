const formidable = require('formidable');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the files:', err);
        res.status(500).send('Internal server error');
        return;
      }

      const username = fields.username.trim();
      const albumname = fields.albumname.trim();

      if (!username || !albumname) {
        res.status(400).send('Username and album name are required.');
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
        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });

        const bucketName = process.env.AWS_BUCKET_NAME;

        for (const file of uploadedFiles) {
          try {
            const fileData = fs.readFileSync(file.filepath);
            const lowResImage = await sharp(fileData)
              .resize({ width: 200 })
              .toBuffer();
        
            const fileName = file.originalFilename;
        
            const highResKey = `users/${username}/${albumname}/hi-res/${fileName}`;
            const lowResKey = `users/${username}/${albumname}/low-res/${fileName}`;
        
            // Upload high-res image
            await s3.upload({
              Bucket: bucketName,
              Key: highResKey,
              Body: fileData,
              ACL: 'public-read',
            }).promise();
        
            // Upload low-res image
            await s3.upload({
              Bucket: bucketName,
              Key: lowResKey,
              Body: lowResImage,
              ACL: 'public-read',
            }).promise();
        
            console.log(`Successfully processed and uploaded ${fileName} for user ${username} in album ${albumname}`);
          } catch (error) {
            console.error(`Error processing or uploading ${file.originalFilename}:`, error);
            // Optionally, collect errors to inform the user later
          }
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
