import express from 'express'
import { addRawSlabs, getAllRawSlabs, getSingleRawSlabs, removeRawSlabs, updateRawSlabs } from '../../controllers/factoryManagement.js';

const router = express.Router();

router.get('/get', getAllRawSlabs);

router.get('/get/:id', getSingleRawSlabs);

router.post('/add', addRawSlabs);

router.put('/put/:id', updateRawSlabs);

router.delete('/delete/:id', removeRawSlabs);


export default router;