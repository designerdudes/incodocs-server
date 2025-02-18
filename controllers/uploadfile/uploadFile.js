import Busboy from "busboy"; // ✅ Import correctly
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

export const uploadFile = (req, res) => {
  try {
    console.log("Received upload request");

    const busboy = Busboy({ headers: req.headers }); // ✅ Call Busboy as a function

    busboy.on("file", (fieldname, file, fileInfo) => {
      console.log("Processing file:", fileInfo.filename);

      const { filename, mimeType } = fileInfo;
      const uniqueFilename = `${Date.now()}-${filename}`;
      const blob = bucket.file(uniqueFilename);

      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: { contentType: mimeType },
      });

      file.pipe(blobStream);

      blobStream.on("finish", async () => {
        console.log("File uploaded successfully");
        await blob.makePublic();
        res.status(200).json({ url: blob.publicUrl() });
      });

      blobStream.on("error", (err) => {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
      });
    });

    busboy.on("finish", () => console.log("Busboy finished parsing"));
    req.pipe(busboy);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
};

// import { Storage } from "@google-cloud/storage";
// import dotenv from "dotenv";

// dotenv.config();

// // Initialize Google Cloud Storage
// const storage = new Storage({
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Check if this is loaded correctly
// });

// const bucket = storage.bucket(process.env.BUCKET_NAME); // Load bucket from .env

// export const uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ message: "No file uploaded. Please select a file." });
//     }

//     // Generate unique filename
//     const uniqueFilename = `${Date.now()}-${req.file.originalname}`;

//     // Create file in the bucket
//     const blob = bucket.file(uniqueFilename);
//     const blobStream = blob.createWriteStream({
//       resumable: false,
//       metadata: {
//         contentType: req.file.mimetype, // Explicitly set correct Content-Type
//         cacheControl: "public, max-age=31536000", // (Optional) Helps with browser caching
//       },
//     });

//     blobStream.on("error", (err) => {
//       console.error("Upload error:", err);
//       return res.status(500).json({ error: err.message });
//     });

//     blobStream.on("finish", async () => {
//       await blob.makePublic();
//       await blob.setMetadata({
//         contentType: req.file.mimetype,
//         cacheControl: "public, max-age=31536000",
//         contentDisposition: "inline", // 🛠️ Forces browser to display the file
//       });

//       // const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//       const publicUrl = blob.publicUrl();

//       console.log("File uploaded:", publicUrl);
//       res
//         .status(200)
//         .json({ message: "File uploaded successfully", url: publicUrl });
//     });

//     blobStream.end(req.file.buffer);
//   } catch (error) {
//     console.error("Upload failed:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
