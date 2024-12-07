import { gst } from "../../../models/accounting/purchases&sales.js";

export const getAllGstData = async (req, res) => {
  try {
    const data = await gst.find();
    if (data.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getGstDataByDate = async (req, res) => {
  try {
    const { date } = req.body;
    const data = await gst.find({ date });
    if (data.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getGstDataBymonth = async (req, res) => {
  try {
    const { month } = req.body;
    const data = await gst.find({
      $expr: { $eq: [{ $month: "$date" }, month] },
    });
    if (data.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllPurchasesGstBySupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await gst.find({ party: id, type: "purchase" });
    if (data.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllSalesGstByCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await gst.find({ party: id, type: "sale" });
    if (data.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllGstPurchases = async (req, res) => {
  try {
    const data = await gst.find({ type: "purchase" });
    if (data.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllGstSales = async (req, res) => {
  try {
    const data = await gst.find({ type: "sale" });
    if (data.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};
