import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Check if this is loaded correctly
});

const bucket = storage.bucket(process.env.BUCKET_NAME); // Load bucket from .env

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please select a file.' });
    }

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${req.file.originalname}`;

    // Create file in the bucket
    const blob = bucket.file(uniqueFilename);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', (err) => {
      console.error('Upload error:', err);
      return res.status(500).json({ error: err.message });
    });

    blobStream.on('finish', async () => {
      await blob.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      console.log('File uploaded:', publicUrl);
      res.status(200).json({ message: 'File uploaded successfully', url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: error.message });
  }
};
