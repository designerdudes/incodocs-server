import express from "express";
import {
  addShipment,
  updateShipment,
  addOrUpdateBookingDetails,
  addOrUpdateShippingDetails,
  addOrUpdateShippingBillDetails,
  addOrUpdateSaleInvoiceDetails,
  addOrUpdateBlDetails,
  getAllShipments,
  getShipmentById,
  getShipmentsByOrganizationId,
  deleteShipmentById,
  addContainer,
  deleteMultipleShipments,
  addorUpdateSupplierDetails,
  addOrUpdatecertificateOfOriginDetails,
  addShippingBillsInShippingBillDetails,
  createConsignee,
  getAllConsignee,
  getAllConsigneeByOrg,
  getSingleConsignee,
  updateConsignee,
  deleteConsignee,
} from "../../controllers/documentation/shipments.js";

const router = express.Router();

router.post("/add", addShipment);
router.post("/booking-details", addOrUpdateBookingDetails);
router.post("/shipping-details", addOrUpdateShippingDetails);
router.post("/shipping-bill-details", addOrUpdateShippingBillDetails);
router.post("/supplier-details", addorUpdateSupplierDetails);
router.post("/sale-invoice-details", addOrUpdateSaleInvoiceDetails);
router.post("/bl-details", addOrUpdateBlDetails);
router.post("coo-details", addOrUpdatecertificateOfOriginDetails);
router.post("/addshipping-bills", addShippingBillsInShippingBillDetails);
router.post("/add-container", addContainer);

router.get("/getAll", getAllShipments);
router.get("/getbyid/:id", getShipmentById);
router.get("/getbyorg/:id", getShipmentsByOrganizationId);

router.put("/update/:id", updateShipment);

router.delete("/delete/:id", deleteShipmentById);
router.delete("/deleteall", deleteMultipleShipments);

// consignee routes
router.get("/consignee/getall", getAllConsignee);
router.get("/consignee/getbyorg/:organizationId", getAllConsigneeByOrg);
router.get("/consignee/getone/:id", getSingleConsignee);

router.post("/consignee/create", createConsignee);

router.put("/consignee/update/:id", updateConsignee);

router.delete("/consignee/delete/:id", deleteConsignee);

export default router;
