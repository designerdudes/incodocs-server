import express from "express";
import {
  addUser,
  getAllUsers,
  getCurrentUser,
  getUserByIdAndPopulateAll,
  loginUser,
  updateUser,
} from "../controllers/user.js";

const router = express.Router();

// Route to add a new user
router.post("/add", addUser);

router.post("/login", loginUser);

router.get("/getall", getAllUsers);

router.get("/currentUser", getCurrentUser);

// Route to update an existing user
router.put("/:id", updateUser);

router.get("/populate/:id", getUserByIdAndPopulateAll);

export default router;
