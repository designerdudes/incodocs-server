import express from "express";
import {
  addBlock,
  addFinishedSlab,
  addLot,
  deleteBlocksInLot,
  deleteLotsInFactory,
  deleteSlabsInBlock,
  getAllBlocks,
  getAllFinishedSlabs,
  getAllLots,
  getBlocksByLot,
  getLotByFactory,
  getLotById,
  getSingleBlock,
  getSingleFinishedSlab,
  getSlabsByBlock,
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

// Get Blocks by Lot Id
router.get("/inventory/blocksbylot/get/:id", getBlocksByLot);

router.delete("/inventory/blocksbylot/delete/:id", deleteBlocksInLot);

// Get slabs By Block Id
router.get("/inventory/slabsbyblock/get/:id", getSlabsByBlock);

router.delete("/inventory/slabsbyblock/delete/:id", deleteSlabsInBlock);

export default router;
