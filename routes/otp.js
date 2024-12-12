import express from "express";
import { getotps, sendOTPforMobileverification } from "../controllers/auth.js";
const router = express.Router();

router.get("/getotps", getotps);
router.post("/mobileotp", sendOTPforMobileverification);

export default router;
