import express from 'express';
import { addUser, getCurrentUser, getUserByIdAndPopulateAll, loginUser, updateUser } from '../controllers/user.js';

const router = express.Router();

// Route to add a new user
router.post('/add', addUser);  

router.post('/login', loginUser);  


router.get('/currentUser', getCurrentUser);


// Route to update an existing user
router.put('/:id', updateUser);

router.get('/:id', getUserByIdAndPopulateAll);

export default router;
