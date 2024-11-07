import express from 'express'
import { addRawBlock, getAllRawBlocks, getSingleRawBlock, removeRawBlock, updateRawBlock } from '../../controllers/factoryManagement.js';

const router = express.Router();

//Raw Blocks
router.get('/inventory/raw/get', getAllRawBlocks);

router.get('/inventory/raw/get/:id', getSingleRawBlock);

router.post('/inventory/raw/add', addRawBlock);

router.put('/inventory/raw/put/:id', updateRawBlock);

router.delete('/inventory/raw/delete/:id', removeRawBlock);


export default router;