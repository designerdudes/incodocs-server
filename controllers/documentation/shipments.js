import {
  consignee,
  forwardername,
  shippingline,
  transportername,
} from "../../models/documentation/consignee&productDetails.js";
import Organization from "../../models/documentation/organization.js";
import Shipment from "../../models/documentation/shipment.js";
import { shipmentSupplier } from "../../models/documentation/shipmentSupplier.js";

// Controller function to add a new shipment
export const addShipment = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const body = req.body;
    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }
    const newShipment = await Shipment.create(body);
    await Organization.findByIdAndUpdate(
      newShipment.organizationId,
      { $push: { shipments: newShipment._id } },
      { new: true }
    );
    res.status(200).json(newShipment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "internal server error", message: error.message });
  }
};

const deepMerge = (existingShipment, newShipmentData) => {
  for (const key of Object.keys(newShipmentData)) {
    // here key is a variable it is storing all the keys of the newshipmentData with the help of object.keys() method where as in for-in loop it directly takes keys of an oject so we dont need to do object.keys() in for-in loop
    if (key === "containers") {
      continue;
    }
    if (
      newShipmentData[key] &&
      typeof newShipmentData[key] === "object" &&
      !Array.isArray(newShipmentData[key])
    ) {
      existingShipment[key] = existingShipment[key] || {};
      deepMerge(existingShipment[key], newShipmentData[key]);
    } else {
      existingShipment[key] = newShipmentData[key];
    }
  }
  return existingShipment;
};

// Controller function to update an existing shipment
export const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const findShipment = await Shipment.findById(id);
    if (!findShipment) {
      return res.status(404).json({ message: "shipment not found" });
    }
    // const deepMerge = (existingShipment, newShipmentData) => {
    //   for (const key of Object.keys(newShipmentData)) {
    //     // here key is a variable it is storing all the keys of the newshipmentData with the help of object.keys() method where as in for-in loop it directly takes keys of an oject so we dont need to do object.keys() in for-in loop
    //     if (
    //       newShipmentData[key] &&
    //       typeof newShipmentData[key] === "object" &&
    //       !Array.isArray(newShipmentData[key])
    //     ) {
    //       existingShipment[key] = existingShipment[key] || {};
    //       deepMerge(existingShipment[key], newShipmentData[key]);
    //     } else {
    //       existingShipment[key] = newShipmentData[key];
    //     }
    //   }
    //   return existingShipment;
    // };

    const mergedData = deepMerge(findShipment.toObject(), body);

    const updatedShipment = await Shipment.findByIdAndUpdate(id, mergedData, {
      new: true,
    });
    res.status(200).json(updatedShipment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "internal server error", message: error.message });
  }
};

// Controller function to add or update booking details for a shipment
export const addOrUpdateBookingDetails = async (req, res) => {
  try {
    const { shipmentId, bookingDetails, organizationId } = req.body;

    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }

    let shipment;

    if (shipmentId) {
      const findShipment = await Shipment.findById(shipmentId);
      if (!findShipment) {
        return res.status(404).json({ message: "shipment not found" });
      }

      // Store a copy of existing containers to avoid reference issues
      const existingContainers = [
        ...(findShipment.bookingDetails?.containers || []),
      ];

      // Exclude containers while merging using rest operator
      const { containers, ...restBookingDetails } = bookingDetails || {};

      findShipment.bookingDetails = {
        ...findShipment.bookingDetails,
        ...restBookingDetails, // Merge everything except containers
      };

      // Restore the original containers
      findShipment.bookingDetails.containers = existingContainers;

      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { $set: { bookingDetails: findShipment.bookingDetails } },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ bookingDetails, organizationId });
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }
    res.status(200).json(shipment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "internal server error", message: error.message });
  }
};

// Controller function to add or update shipping details for a shipment
export const addOrUpdateShippingDetails = async (req, res) => {
  try {
    const { shipmentId, shippingDetails, organizationId } = req.body; //

    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }

    const findShipment = await Shipment.findById(shipmentId);
    if (!findShipment) {
      return res.status(404).json({ message: "shipment not found" });
    }

    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { shippingDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ shippingDetails, organizationId });
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }
    res.status(200).json(shipment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "internal server error", message: error.message });
  }
};

// Controller function to add or update shipping bill details for a shipment
export const addOrUpdateShippingBillDetails = async (req, res) => {
  try {
    const { shipmentId, shippingBillDetails, organizationId } = req.body;

    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }

    const findShipment = await Shipment.findById(shipmentId);
    if (!findShipment) {
      return res.status(404).json({ message: "shiopment not found" });
    }

    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { shippingBillDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ shippingBillDetails, organizationId });
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }
    res.status(200).json(shipment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "internal server error", message: error.message });
  }
};

// controller function to add or update supplier details for a shipment
export const addorUpdateSupplierDetails = async (req, res) => {
  try {
    const { shipmentId, supplierDetails, organizationId } = req.body;

    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }

    const findShipment = await Shipment.findById(shipmentId);
    if (!findShipment) {
      return res.status(404).json({ message: "shiopment not found" });
    }

    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { supplierDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ supplierDetails, organizationId });
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }
    res.status(200).json(shipment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

// Controller function to add or update sale invoice details for a shipment
export const addOrUpdateSaleInvoiceDetails = async (req, res) => {
  try {
    const { shipmentId, saleInvoiceDetails, organizationId } = req.body;

    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }

    const findShipment = await Shipment.findById(shipmentId);
    if (!findShipment) {
      return res.status(404).json({ message: "shiopment not found" });
    }

    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { saleInvoiceDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ saleInvoiceDetails, organizationId });
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }
    res.status(200).json(shipment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "internal server error", message: error.message });
  }
};

// Controller function to add or update BL details for a shipment
export const addOrUpdateBlDetails = async (req, res) => {
  try {
    const { shipmentId, blDetails, organizationId } = req.body;

    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }

    const findShipment = await Shipment.findById(shipmentId);
    if (!findShipment) {
      return res.status(404).json({ message: "shiopment not found" });
    }

    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { blDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ blDetails, organizationId });
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }
    res.status(200).json(shipment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "internal server error", message: error.message });
  }
};

export const addOrUpdatecertificateOfOriginDetails = async (req, res) => {
  try {
    const { shipmentId, certificateOfOriginDetails, organizationId } = req.body;

    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }

    const findShipment = await Shipment.findById(shipmentId);
    if (!findShipment) {
      return res.status(404).json({ message: "shiopment not found" });
    }

    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { certificateOfOriginDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({
        certificateOfOriginDetails,
        organizationId,
      });
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }
    res.status(200).json(shipment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "internal server error", message: error.message });
  }
};

// Controller function to get all shipments
export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate("shippingDetails.transporterName")
      .populate("shippingDetails.forwarderName")
      .populate("shippingDetails.shippingLineName")
      .populate("supplierDetails.clearance.supplierName")
      .populate("saleInvoiceDetails.consignee")
      .populate("organizationId");
    if (shipments.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(shipments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "internal server error", message: error.message });
  }
};

// get shipments by organization Id
export const getShipmentsByOrganizationId = async (req, res) => {
  try {
    const { id } = req.params;
    const findOrg = await Organization.findById(id);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }
    const shipments = await Shipment.find({ organizationId: id })
      .populate("shippingDetails.transporterName")
      .populate("shippingDetails.forwarderName")
      .populate("shippingDetails.shippingLineName")
      .populate("supplierDetails.clearance.supplierName")
      .populate("saleInvoiceDetails.consignee")
      .populate("organizationId");
    if (shipments.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(shipments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "internal server error", message: error.message });
  }
};

// Controller function to get a shipment by ID
export const getShipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findById(id)
      .populate("shippingDetails.transporterName")
      .populate("shippingDetails.forwarderName")
      .populate("shippingDetails.shippingLineName")
      .populate("supplierDetails.clearance.supplierName")
      .populate("saleInvoiceDetails.consignee")
      .populate("organizationId");
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a shipment by ID
export const deleteShipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    await Organization.findByIdAndUpdate(
      shipment.organizationId,
      { $pull: { shipments: id } },
      { new: true }
    );

    await Shipment.findByIdAndDelete(id);

    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// addding containers in booking details
export const addContainer = async (req, res) => {
  const { shipmentId, bookingDetails } = req.body;
  try {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ message: "shipment not found" });
    }

    const containers = bookingDetails.containers;
    const updatedContainer = await Shipment.findByIdAndUpdate(
      shipmentId,
      {
        $push: {
          "bookingDetails.containers": { $each: containers },
        },
      },
      { new: true }
    );
    res.status(200).json({ updatedContainer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMultipleShipments = async (req, res) => {
  try {
    const { ids } = req.body;
    const findShipments = await Shipment.find({ _id: { $in: ids } });
    const orgId = findShipments.map((shipment) => shipment.organizationId);
    if (findShipments.length === 0) {
      return res.status(404).json({ message: "no records found to delete" });
    }
    await Organization.updateMany(
      { _id: { $in: orgId } },
      { $pull: { shipments: { $in: ids } } },
      { new: true }
    );
    await Shipment.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "shipments deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

export const addShippingBillsInShippingBillDetails = async (req, res) => {
  try {
    const { shipmentId, shippingBillDetails } = req.body;
    const findShipment = await Shipment.findById(shipmentId);
    if (!findShipment) {
      return res.status(404).json({ message: "no shipment found" });
    }
    const shippingBills = shippingBillDetails.ShippingBills;
    const addedShipmentBill = await Shipment.findByIdAndUpdate(shipmentId, {
      $push: { "shippingBillDetails.ShippingBills": { $each: shippingBills } },
    });
    res.status(200).json(addedShipmentBill);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateContainer = async (req, res) => {
  try {
    const { shipmentId, containerId } = req.params;
    const updateData = req.body;

    const shipment = await Shipment.findById(shipmentId); // this shipment variable has become a mongoose document which means it has special Mongoose functions like .save().
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const container = shipment.bookingDetails.containers.find(
      (c) => c._id.toString() === containerId
    );

    if (!container) {
      return res.status(404).json({ message: "Container not found" });
    }

    // Merge new data into the existing container (without overwriting the entire object)
    Object.assign(container, updateData);

    // Save the updated shipment document
    await shipment.save();

    res
      .status(200)
      .json({ message: "Container updated successfully", container });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

// consignee controllers
export const createConsignee = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const body = req.body;
    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(200).json({ message: "orgagnization not found" });
    }
    const addedConsignee = await consignee.create(body);
    res.status(200).json(addedConsignee);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getAllConsignee = async (req, res) => {
  try {
    const getConsignee = await consignee.find();
    if (getConsignee.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(getConsignee);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getAllConsigneeByOrg = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const findOrg = await Organization.findById(organizationId);
    if (!findOrg) {
      return res.status(404).json({ message: "no records found" });
    }
    const getConsignee = await consignee.find({
      organizationId: organizationId,
    });
    if (getConsignee.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(getConsignee);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getSingleConsignee = async (req, res) => {
  try {
    const { id } = req.params;
    const getConsignee = await consignee.findById(id);
    if (!getConsignee) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(getConsignee);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateConsignee = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const getConsignee = await consignee.findById(id);
    if (!getConsignee) {
      return res.status(404).json({ message: "consignee not found" });
    }
    const updatedConsignee = await consignee.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(200).json(updatedConsignee);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const deleteConsignee = async (req, res) => {
  try {
    const { id } = req.params;
    const getConsignee = await consignee.findByIdAndDelete(id);
    if (!getConsignee) {
      return res.status(404).json({ message: "consignee not found to delete" });
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

// shipmentLine controllers
export const createShippingLine = async (req, res) => {
  try {
    const body = req.body;
    const { organizationId } = req.body;
    if (!organizationId)
      return res.status(400).json({ message: "organization ID required" });
    const newShipmentLine = await shippingline.create(body);
    res.status(200).json(newShipmentLine);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getShippingLineByOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const shipmentLine = await shippingline.find({ organizationId: id });
    if (shipmentLine.length < 1) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(shipmentLine);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getSingleShippingLine = async (req, res) => {
  try {
    const { id } = req.params;
    const shipmentLine = await shippingline.findById(id);
    if (!shipmentLine) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(shipmentLine);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateShippingLine = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const shipmentLine = await shippingline.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!shipmentLine) {
      return res.status(404).json({ message: "no records found to update" });
    }
    res.status(200).json(shipmentLine);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const deleteShippingLine = async (req, res) => {
  try {
    const { id } = req.params;
    const findshipingline = await shippingline.findById(id);
    if (!findshipingline) {
      return res.status(404).json({ message: "not found" });
    }
    await shippingline.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

// transporter controllers
export const createTransporter = async (req, res) => {
  try {
    const body = req.body;
    const { organizationId } = req.body;
    if (!organizationId)
      return res.status(400).json({ message: "organization ID required" });
    const newTransporter = await transportername.create(body);
    res.status(200).json(newTransporter);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getTransporterByOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const findTransporter = await transportername.find({ organizationId: id });
    if (findTransporter.length < 1) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findTransporter);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getSingleTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const findTransporter = await transportername.findById(id);
    if (!findTransporter) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findTransporter);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedTransporter = await transportername.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      }
    );
    if (!updatedTransporter) {
      return res.status(404).json({ message: "no records found to update" });
    }
    res.status(200).json(updatedTransporter);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const deleteTransporter = async (req, res) => {
  try {
    const { id } = req.params;
    const findTransporter = await transportername.findById(id);
    if (!findTransporter) {
      return res.status(404).json({ message: "not found" });
    }
    await transportername.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

// forwarder controllers
export const createForwarder = async (req, res) => {
  try {
    const body = req.body;
    const { organizationId } = req.body;
    if (!organizationId)
      return res.status(400).json({ message: "organization ID required" });
    const newForwarder = await forwardername.create(body);
    res.status(200).json(newForwarder);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getForwarderByOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const findForwarder = await forwardername.find({ organizationId: id });
    if (findForwarder.length < 1) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findForwarder);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getSingleForwarder = async (req, res) => {
  try {
    const { id } = req.params;
    const findForwarder = await forwardername.findById(id);
    if (!findForwarder) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findForwarder);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateForwarder = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedForwarder = await forwardername.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedForwarder) {
      return res.status(404).json({ message: "no records found to update" });
    }
    res.status(200).json(updatedForwarder);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const deleteForwarder = async (req, res) => {
  try {
    const { id } = req.params;
    const findForwarder = await forwardername.findById(id);
    if (!findForwarder) {
      return res.status(404).json({ message: "not found" });
    }
    await forwardername.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

// shipment supplier schema
export const createShipmentSupplier = async (req, res) => {
  try {
    const body = req.body;
    const { organizationId } = req.body;
    if (!organizationId)
      return res.status(400).json({ message: "organization ID required" });
    const newShipmentSupplier = await shipmentSupplier.create(body);
    res.status(200).json(newShipmentSupplier);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getShipmentSupplierByOrganizationId = async (req, res) => {
  try {
    const { id } = req.params;
    const findsupplier = await shipmentSupplier.find({ organizationId: id });
    if (findsupplier.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findsupplier);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const getSingleShipmentSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const findsupplier = await shipmentSupplier.findById(id);
    if (!findsupplier) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(findsupplier);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const updateShipmentSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const findSupplier = await shipmentSupplier.findById(id);
    if (!findSupplier) {
      return res.status(404).json({ message: "shipment Supplier not found" });
    }
    const updatesupplier = await shipmentSupplier.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatesupplier);
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};

export const deleteshipmentSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const findSupplier = await shipmentSupplier.findById(id);
    if (!findSupplier) {
      return res.status(404).json({ message: "no records found to delete" });
    }
    await shipmentSupplier.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", message: err.message });
  }
};
