import express from "express";
const router = express.Router();
import {
  addExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
} from "../../controllers/accounting/gst/gst.js";

router.post("/add", addExpense);

router.get("/getall", getAllExpenses);

router.get("/getbyid/:id", getExpenseById);

router.put("/put/:id", updateExpense);

router.delete("/delete/:id", deleteExpense);

export default router;
