import express from 'express';
const router = express.Router();
import multer from 'multer';
import { uploadFile } from '../../controllers/uploadfile/uploadFile.js';

const upload = multer(); // This is for parsing form-data requests

router.post('/upload', upload.single('file'), uploadFile);

export default router;