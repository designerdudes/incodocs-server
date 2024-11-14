import Organization from "../../models/documentation/organization.js";
import Shipment from "../../models/documentation/shipment.js";

// Controller function to add a new shipment
export const addShipment = async (req, res) => {
  try {
    const { organization } = req.body;
    const newShipment = await Shipment.create(req.body);
    await Organization.findByIdAndUpdate(
      organization,
      { $push: { shipments: newShipment._id } },
      { new: true }
    );
    res.status(201).json(newShipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to add or update shipping details for a shipment
export const addOrUpdateShippingDetails = async (req, res) => {
  try {
    const { shipmentId, shippingDetails } = req.body; //
    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { shippingDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ shippingDetails });
      const organizationId = shippingDetails.organization;
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }

    res.status(200).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to update an existing shipment
export const updateShipment = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const Updatedshipment = await Shipment.findByIdAndUpdate(id, payload, {
      new: true,
    });
    res.json(Updatedshipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to add or update booking details for a shipment
export const addOrUpdateBookingDetails = async (req, res) => {
  try {
    const { shipmentId, bookingDetails } = req.body;
    let shipment;
    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { bookingDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ bookingDetails });
      const organizationId = bookingDetails.organization;
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }
    res.status(200).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to add or update shipping bill details for a shipment
export const addOrUpdateShippingBillDetails = async (req, res) => {
  try {
    const { shipmentId, shippingBillDetails } = req.body;
    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { shippingBillDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ shippingBillDetails });
      const organizationId = shippingBillDetails.organization;
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }

    res.status(200).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to add or update sale invoice details for a shipment
export const addOrUpdateSaleInvoiceDetails = async (req, res) => {
  try {
    const { shipmentId, saleInvoiceDetails } = req.body;
    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { saleInvoiceDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ saleInvoiceDetails });
      const organizationId = saleInvoiceDetails.organization;
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }

    res.status(200).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to add or update BL details for a shipment
export const addOrUpdateBlDetails = async (req, res) => {
  try {
    const { shipmentId, blDetails } = req.body;
    let shipment;

    if (shipmentId) {
      shipment = await Shipment.findByIdAndUpdate(
        shipmentId,
        { blDetails },
        { new: true }
      );
    } else {
      shipment = await Shipment.create({ blDetails });
      const organizationId = blDetails.organization;
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { shipments: shipment._id } },
        { new: true }
      );
    }

    res.status(200).json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all shipments
export const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().populate("organization");
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a shipment by ID
export const getShipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const shipment = await Shipment.findById(id).populate("organization");
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get shipments by organization ID
export const getShipmentsByOrganizationId = async (req, res) => {
  const { organizationId } = req.params;
  try {
    const shipments = await Shipment.find({
      organization: organizationId,
    }).populate("organization");
    if (!shipments) {
      return res
        .status(404)
        .json({ message: "No shipments found for the organization" });
    }
    res.status(200).json(shipments);
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
      shipment.organization,
      { $pull: { shipments: id } },
      { new: true }
    );

    await Shipment.findByIdAndDelete(id);

    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// addding container in booking details
export const addContainer = async (req, res) => {
  const { shipmentId, bookingDetails } = req.body;
  try {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      return res.status(404).json({ message: "shipment not found" });
    } else {
      const containerNumber = bookingDetails.containerNumber;
      const updatedContainer = await Shipment.findByIdAndUpdate(
        shipmentId,
        {
          $push: {
            "bookingDetails.containerNumber": { $each: containerNumber }, //      { $push: { bookingDetails.containerNumber : containerNumber } },
          },
        },
        { new: true }
      );
      res.status(200).json({ updatedContainer });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const addContainerToShipment = async (req, res) => {
//   const { shipmentId } = req.params; // assuming shipment ID is passed as a URL parameter
//   const { containerNumber } = req.body; // assuming container number is passed in the request body

//   try {
//     // Find the shipment by ID
//     const shipment = await Shipment.findById(shipmentId);

//     if (!shipment) {
//       return res.status(404).json({ message: "Shipment not found" });
//     }

//     // Add the new container number to the array
//     shipment.bookingDetails.containerNumber.push(containerNumber);

//     // Save the updated shipment
//     await shipment.save();

//     res.status(200).json(shipment);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
