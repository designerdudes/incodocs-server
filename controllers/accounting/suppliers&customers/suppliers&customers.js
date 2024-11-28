import {
  customer,
  supplier,
  supplier,
} from "../../../models/accounting/suppliers&customers.js";

// Customers APIs
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customer.find();
    if (customers.length === 0) {
      return res.status(404).json({ msg: "No Records Found" });
    }
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = await customer.findById(id);
    if (!customerData) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }
    res.status(200).json(customerData);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { customerName, gstNo, mobileNumber } = req.body;
    if (!customerName || !gstNo || !mobileNumber) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const newCustomer = new customer({ customerName, gstNo, mobileNumber });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedCustomer = await customer.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedCustomer) {
      return res.status(404).send("Customer not found");
    }
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const removeSupplier = await customer.findByIdAndDelete(id);
    if (!removeSupplier) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).send("Customer Deletd Successfully");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// Suppliers APIs
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplier.find();
    if (suppliers.length === 0) {
      return res.status(404).josn({ message: "No Records Found" });
    }
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const suppliers = await supplier.findById(id);
    if (!suppliers)
      return res.status(404).json({ message: "No Records Found" });
    else return res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

export const addSupplier = async (req, res) => {
  try {
    const { supplierName, gstNo, mobileNumber } = req.body;
    if (!supplierName || !gstNo || !mobileNumber) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const newSupplier = new supplier({
      supplierName,
      gstNo,
      mobileNumber,
      state,
      factoryAddress,
    });
    await newSupplier.save();
    res.status(200).json(newSupplier);
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedSupplier = await findByIdAndUpdate(id, body, { new: true });
    if (!updatedSupplier) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(updatedSupplier);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const removeSupplier = await supplier.findByIdAndDelete(id);
    if (!removeSupplier) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).send("Supplier Deletd Successfully");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};
