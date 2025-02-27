import express from "express";
import {
  addBlock,
  addFinishedSlab,
  addLot,
  addLotAndBlocks,
  AddTrimDataToMultipleSlabs,
  deleteBlocksInLot,
  deleteLotsInFactory,
  deleteMultipleBlocks,
  deleteMultipleLots,
  deleteMultipleSlabs,
  deleteSlabsInBlock,
  getAllBlocks,
  getAllFinishedSlabs,
  getAllLots,
  getBlocksByFactoryId,
  getBlocksByLot,
  getBlocksBystatus,
  getLotByFactory,
  getLotById,
  getSingleBlock,
  getSingleFinishedSlab,
  getSlabsByBlock,
  getSlabsByFactoryId,
  getSlabsBystatus,
  removeBlock,
  removeFinishedSlab,
  removeLot,
  updateBlock,
  updateBlockCreateSlab,
  updateFinishedSlab,
  updateLot,
  updateLotAddBlocks,
  updateMultipleSlabs,
  updateMultipleSlabsValue,
  updateSlabAddTrimData,
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

// Add Lot with Blocks
router.post("/inventory/addlotandblocks", addLotAndBlocks);

// Update Block create slab
router.put("/inventory/updatelotaddblocks/:id", updateLotAddBlocks);

// Update Block create slab
router.put("/inventory/updateblockaddslab/:id", updateBlockCreateSlab);

// update multiple slabs add trim data
router.put("/inventory/addtrim-multipleslabs", AddTrimDataToMultipleSlabs);

// add trim data in slab
router.put("/inventory/addtrim/:id", updateSlabAddTrimData);

// Get blocks by status
router.get("/inventory/getblocksbystatus", getBlocksBystatus);

// Get blocks by status
router.get("/inventory/getslabsbystatus", getSlabsBystatus);

// get blocks by factoryId
router.get("/inventory/getblocksbyfactory/:id", getBlocksByFactoryId);

// get slabs by factoryId
router.get("/inventory/getslabsbyfactory/:id", getSlabsByFactoryId);

// update multiple slabs
router.put("/inventory/updatemultipleslabs", updateMultipleSlabs);

// update multiple slabs values
router.put("/inventory/updateMultipleSlabsValue", updateMultipleSlabsValue);

// delete multiple lots
router.delete("/inventory/deletemultiplelots", deleteMultipleLots);

// delete multiple blocks
router.delete("/inventory/deletemultipleblocks", deleteMultipleBlocks);

// delete multiple slabs
router.delete("/inventory/deletemultipleslabs", deleteMultipleSlabs);

export default router;
