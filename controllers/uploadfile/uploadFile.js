// import express from 'express';
import { Storage } from '@google-cloud/storage';
// import path from 'path';
// import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Google Cloud Storage
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,// path to your key file
});
console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// this is bucket name
const bucket = storage.bucket(process.env.BUCKET_NAME); // bucket name

// Configure Multer for file uploads
// const upload = multer({ storage: multer.memoryStorage() });

export const uploadFile = async (req, res) => {
    try {
        console.log(req.file, "filekdjf");
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded maki file nai hai' });
        }

        // Generate unique filename to avoid overwriting
        const uniqueFilename = `${Date.now()}-${req.file.originalname}`;

        const blob = bucket.file(uniqueFilename);
        const blobStream = blob.createWriteStream({
            resumable: false,
            // public: true, // Make file publicly accessible
            metadata: { contentType: req.file.mimetype },
        });

        blobStream.on('error', (err) => res.status(500).json({ error: err.message }));

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            res.status(200).json({ message: 'File uploaded successfully', url: publicUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};