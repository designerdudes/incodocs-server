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
  updateContainer,
  createShippingLine,
  getSingleShippingLine,
  updateShippingLine,
  deleteShippingLine,
  createTransporter,
  getSingleTransporter,
  updateTransporter,
  deleteTransporter,
  deleteForwarder,
  updateForwarder,
  getSingleForwarder,
  createForwarder,
  createShipmentSupplier,
  getSingleShipmentSupplier,
  getShipmentSupplierByOrganizationId,
  updateShipmentSupplier,
  deleteshipmentSupplier,
  getForwarderByOrg,
  getTransporterByOrg,
  getShippingLineByOrg,
} from "../../controllers/documentation/shipments.js";

const router = express.Router();

router.post("/add", addShipment);
router.post("/booking-details", addOrUpdateBookingDetails);
router.post("/shipping-details", addOrUpdateShippingDetails);
router.post("/shipping-bill-details", addOrUpdateShippingBillDetails);
router.post("/supplier-details", addorUpdateSupplierDetails);
router.post("/sale-invoice-details", addOrUpdateSaleInvoiceDetails);
router.post("/bl-details", addOrUpdateBlDetails);
router.post("/other-details", addOrUpdatecertificateOfOriginDetails);
router.post("/addshipping-bills", addShippingBillsInShippingBillDetails);
router.post("/add-container", addContainer);

router.get("/getAll", getAllShipments);
router.get("/getbyid/:id", getShipmentById);
router.get("/getbyorg/:id", getShipmentsByOrganizationId);

router.put("/update/:id", updateShipment);
router.put("/update-container/:shipmentId/:containerId", updateContainer);

router.delete("/delete/:id", deleteShipmentById);
router.delete("/deleteall", deleteMultipleShipments);

// consignee routes
router.get("/consignee/getall", getAllConsignee);
router.get("/consignee/getbyorg/:organizationId", getAllConsigneeByOrg);
router.get("/consignee/getone/:id", getSingleConsignee);

router.post("/consignee/create", createConsignee);

router.put("/consignee/update/:id", updateConsignee);

router.delete("/consignee/delete/:id", deleteConsignee);

//shipping line routes
router.post("/shippingline/create", createShippingLine);

router.get("/shippingline/getbyorg/:id", getShippingLineByOrg);
router.get("/shippingline/getone/:id", getSingleShippingLine);

router.put("/shippingline/put/:id", updateShippingLine);

router.delete("/shippingline/delete/:id", deleteShippingLine);

//transporter line routes
router.post("/transporter/create", createTransporter);

router.get("/transporter/getbyorg/:id", getTransporterByOrg);
router.get("/transporter/getone/:id", getSingleTransporter);

router.put("/transporter/put/:id", updateTransporter);

router.delete("/transporter/delete/:id", deleteTransporter);

//forwarder line routes
router.post("/forwarder/create", createForwarder);

router.get("/forwarder/getbyorg/:id", getForwarderByOrg);
router.get("/forwarder/getone/:id", getSingleForwarder);

router.put("/forwarder/put/:id", updateForwarder);

router.delete("/forwarder/delete/:id", deleteForwarder);

// shipment supplier routes
router.get("/supplier/getbyorg/:id", getShipmentSupplierByOrganizationId);
router.get("/supplier/getbyid/:id", getSingleShipmentSupplier);
router.post("/supplier/create", createShipmentSupplier);
router.put("/supplier/update/:id", updateShipmentSupplier);
router.delete("/supplier/delete/:id", deleteshipmentSupplier);

export default router;
