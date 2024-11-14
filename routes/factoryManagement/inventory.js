import express from 'express'
import { addFinishedSlab, addRawBlock, getAllFinishedSlabs, getAllRawBlocks, getSingleFinishedSlab, getSingleRawBlock, removeFinishedSlab, removeRawBlock, updateFinishedSlab, updateRawBlock} from '../../controllers/factoryManagement.js';
import { addLot, updateLot, getallLot, getlotById, removeLot    } from '../../controllers/lots.js';



const router = express.Router();

//Raw Blocks
router.get('/inventory/raw/get', getAllRawBlocks);

router.get('/inventory/raw/get/:id', getSingleRawBlock);

router.post('/inventory/raw/add', addRawBlock);

router.put('/inventory/raw/put/:id', updateRawBlock);

router.delete('/inventory/raw/delete/:id', removeRawBlock);

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