import express from 'express';
import { addUser, getUserByIdAndPopulateAll, updateUser } from '../controllers/user.js';

const router = express.Router();

// Route to add a new user
router.post('/add', addUser);

// Route to update an existing user
router.put('/:id', updateUser);

router.get('/:id', getUserByIdAndPopulateAll);

export default router;
