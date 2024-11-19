import express from "express";
import {
  addFactoryToOrg,
  addWorkerPay,
  getFactories,
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
router.get("/getSingle/:id", getSingleFactory);
router.post("/add", addFactoryToOrg);
router.put("/put/:id", updateFactory);
router.delete("/delete/:id", removeFactoryFrommOrg);

//WOrker Routes
router.get("/workerpay/getAll", getWorker);
router.get("/workerpay/getone/:id", getSingleWorker);
router.post("/workerpay/add", addWorkerPay);
router.put("/workerpay/put/:id", updateWorkerPay);
router.delete("/workerpay/delete/:id", removeWorkerPay);

export default router;
