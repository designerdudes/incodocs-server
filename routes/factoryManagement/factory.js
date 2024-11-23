import express from "express";
import {authenticate}  from "../../middleware/authToken.js";
import {
  addFactoryToOrg,
  addWorkerPay,
  getFactories,
  getFactoriesByUser,
  getSingleFactory,
  getSingleWorker,
  getWorker,
  removeFactoryFrommOrg,
  removeWorkerPay,
  updateFactory,
  updateWorkerPay,
} from "../../controllers/factoryManagement/factory.js";
const router = express.Router();

// Factory Routes
router.get("/getAll", getFactories);
router.get("/getfactorybyuser",authenticate, getFactoriesByUser)
router.get("/getSingle/:id", getSingleFactory);
router.post("/add",authenticate, addFactoryToOrg);
router.put("/put/:id", updateFactory);
router.delete("/delete/:id", removeFactoryFrommOrg);

//WOrker Routes
router.get("/workerpay/getAll", getWorker);
router.get("/workerpay/getone/:id", getSingleWorker);
router.post("/workerpay/add", addWorkerPay);
router.put("/workerpay/put/:id", updateWorkerPay);
router.delete("/workerpay/delete/:id", removeWorkerPay);

export default router;
