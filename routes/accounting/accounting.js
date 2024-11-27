import express from "express";
const router = express.Router();
import customers from "../accounting/customers&suppliers/customers.js";




router.use("/customers", customers);

export default router;