import express from "express";
import {
  addBlock,
  addFinishedSlab,
  addLot,
  deleteLotsInFactory,
  getAllBlocks,
  getAllFinishedSlabs,
  getAllLots,
  getLotByFactory,
  getLotById,
  getSingleBlock,
  getSingleFinishedSlab,
  removeBlock,
  removeFinishedSlab,
  removeLot,
  updateBlock,
  updateFinishedSlab,
  updateLot,
} from "../../controllers/factoryManagement/inventory.js";

const router = express.Router();

//Raw Blocks
router.get("/inventory/raw/get", getAllBlocks);

router.get("/inventory/raw/get/:id", getSingleBlock);

router.post("/inventory/raw/add", addBlock);

router.put("/inventory/raw/put/:id", updateBlock);

router.delete("/inventory/raw/delete/:id", removeBlock);

//Finished Slabs
router.get("/inventory/finished/get", getAllFinishedSlabs);

router.get("/inventory/finished/get/:id", getSingleFinishedSlab);

router.post("/inventory/finished/add", addFinishedSlab);

router.put("/inventory/finished/put/:id", updateFinishedSlab);

router.delete("/inventory/finished/delete/:id", removeFinishedSlab);

// Lot Routes
router.get("/inventory/lot/get", getAllLots);

router.get("/inventory/lot/getbyid/:id", getLotById);

router.post("/inventory/lot/add", addLot);

router.put("/inventory/lot/update/:id", updateLot);

router.delete("/inventory/lot/delete/:id", removeLot);

//Get Lot by factory id
router.get("/inventory/factory-lot/get/:id", getLotByFactory);

router.delete("/inventory/factory-lot/delete/:id", deleteLotsInFactory);

export default router;
