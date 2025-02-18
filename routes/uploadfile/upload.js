import express from "express";
import { uploadFile } from "../../controllers/uploadfile/uploadFile.js";

const router = express.Router();

router.post("/upload", uploadFile); // No need for Multer middleware

export default router;

// import express from "express";
// import { uploadFile } from "../../controllers/uploadfile/uploadFile.js";

// const router = express.Router();

// router.post("/upload", uploadFile); // No need for Multer middleware

// export default router;
