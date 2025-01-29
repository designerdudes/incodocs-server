import express from "express";
const router = express.Router();
import {
  addSupplier,
  createCustomer,
  deleteCustomer,
  deleteSupplier,
  getAllCustomers,
  getAllSuppliers,
  getCustomerById,
  getSupplierById,
  updateCustomer,
  updateSupplier,
} from "../../controllers/accounting/suppliers&customers/suppliers&customers.js";

// customer Routes
router.post("/customer/create", createCustomer);
router.get("/customer/getall", getAllCustomers);
router.get("/customer/getsingle/:id", getCustomerById);
router.put("/customer/update/:id", updateCustomer);
router.delete("/customer/delete/:id", deleteCustomer);

// supplier Routes
router.post("/suplier/create", addSupplier);
router.get("/suplier/getall", getAllSuppliers);
router.get("/suplier/getsingle/:id", getSupplierById);
router.put("/suplier/update/:id", updateSupplier);
router.delete("/suplier/delete/:id", deleteSupplier);

export default router;
