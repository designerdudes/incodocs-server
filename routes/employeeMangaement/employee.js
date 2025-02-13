import express from "express";
import {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getOneEmployee,
} from "../../controllers/employeeMangaement/employee.js";

const router = express.Router();

router.post("/add", addEmployee);
router.get("/getall", getEmployees);
router.get("/getone/:id", getOneEmployee);
router.put("/put/:id", updateEmployee);
router.delete("/delete/:id", deleteEmployee);

export default router;
