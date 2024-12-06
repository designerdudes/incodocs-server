import express from "express";
const router = express.Router();

import { getAllGstData, getGstDataByDate } from "../../controllers/accounting/gst/gst.js";

router.get("/getall", getAllGstData);

router.get("/getbydate", getGstDataByDate);


export default router;
