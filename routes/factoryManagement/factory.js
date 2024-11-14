import express from "express";
import {
  addFactoryToOrg,
  getFactories,
  getSingleFactory,
  removeFactoryFrommOrg,
  updateFactory,
} from "../../controllers/factory.js";
const router = express.Router();

router.get("/getAll", getFactories);
router.get("/getSingle/:id", getSingleFactory);
router.post("/add", addFactoryToOrg);
router.put("/put/:id", updateFactory);
router.delete("/delete/:id", removeFactoryFrommOrg);

export default router;
