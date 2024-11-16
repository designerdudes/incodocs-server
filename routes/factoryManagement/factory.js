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
router.get("/getAll", getWorker);
router.get("/getone", getSingleWorker);
router.post("/add", addWorkerPay);
router.put("/put", updateWorkerPay);
router.delete("/delete", removeWorkerPay);

export default router;
