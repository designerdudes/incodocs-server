import express from "express";
import { createcustomer, getallcustomers, getCustomerById } from "../../../controllers/accounting/customer&suppliers/customers.js";
const router = express.Router();

// Factory Routes
router.post("/create", createcustomer);
router.get("/getAll", getallcustomers);
router.get("/getSingle/:id", getCustomerById);
// router.get("/getfactorybyuser",authenticate, getFactoriesByUser)
// router.get("/getSingle/:id", getSingleFactory);
// router.put("/put/:id", updateFactory);
// router.delete("/delete/:id", removeFactoryFrommOrg);

export default router;
