import express from "express";
import {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getOneEmployee,
  getEmployeeByOrganizationId,
  deleteMultipleEmployees,
} from "../../controllers/employeeMangaement/employee.js";

const router = express.Router();

router.get("/getall", getEmployees);
router.get("/getone/:id", getOneEmployee);
router.get("/getbyorg/:id", getEmployeeByOrganizationId);

router.post("/add", addEmployee);
router.put("/put/:id", updateEmployee);


router.delete("/deleteall", deleteMultipleEmployees);
router.delete("/delete/:id", deleteEmployee);



export default router;
