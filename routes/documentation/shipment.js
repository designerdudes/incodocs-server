import express from 'express'; 
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
    addContainer
} from '../../controllers/shipments.js'; 


const router = express.Router();

// Routes for adding, updating, and deleting shipments
router.post('/add', addShipment);
router.put('/:id', updateShipment);
router.delete('/:id', deleteShipmentById);

// Routes for adding or updating shipment details
router.post('/booking-details', addOrUpdateBookingDetails);
router.post('/shipping-details', addOrUpdateShippingDetails);
router.post('/shipping-bill-details', addOrUpdateShippingBillDetails);
router.post('/sale-invoice-details', addOrUpdateSaleInvoiceDetails);
router.post('/bl-details', addOrUpdateBlDetails);
router.post('/add-container', addContainer)

// Routes for fetching shipments
router.get('/getAll', getAllShipments);
router.get('/get/:id', getShipmentById);
router.get('/organization/:organizationId', getShipmentsByOrganizationId);

export default router;
