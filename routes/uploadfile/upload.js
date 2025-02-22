import express from "express";
import { uploadFile } from "../../controllers/uploadfile/uploadFile.js";

const router = express.Router();

router.post("/upload", uploadFile); // No need for Multer middleware

export default router;

// import express from 'express';
// import multer from 'multer';
// import { uploadFile } from "../../controllers/uploadfile/uploadFile.js";

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory before uploading

// router.post('/upload', upload.single('file'), uploadFile);

// export default router;
