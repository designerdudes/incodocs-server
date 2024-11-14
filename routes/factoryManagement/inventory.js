import express from 'express'
import { addBlock, addFinishedSlab, getAllBlocks, getAllFinishedSlabs, getSingleBlock, getSingleFinishedSlab, removeBlock, removeFinishedSlab, updateBlock, updateFinishedSlab } from '../../controllers/factoryManagement/inventory.js';

const router = express.Router();

//Raw Blocks
router.get('/inventory/raw/get', getAllBlocks);

router.get('/inventory/raw/get/:id', getSingleBlock);

router.post('/inventory/raw/add', addBlock);

router.put('/inventory/raw/put/:id', updateBlock);

router.delete('/inventory/raw/delete/:id', removeBlock);

//Finished Slabs
router.get('/inventory/finished/get', getAllFinishedSlabs);

router.get('/inventory/finished/get/:id', getSingleFinishedSlab);

router.post('/inventory/finished/add', addFinishedSlab);

router.put('/inventory/finished/put/:id', updateFinishedSlab);

router.delete('/inventory/finished/delete/:id', removeFinishedSlab);


// lots route


router.post('/inventory/lot/add', addLot)

router.get('/inventory/lot/get', getallLot)

router.put('/inventory/lot/update', updateLot)

router.get('/inventory/lot/getbyid', getlotById)

router.delete('/inventory/lot/delete', removeLot)




export default router;