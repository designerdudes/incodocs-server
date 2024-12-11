import { expense, gst } from "../../../models/accounting/purchases&sales.js";

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

// expense API's

export const addExpense = async (req, res) => {
  try {
    const { expenseName, expenseValue, gstPercentage, expenseDate, gstType } =
      req.body;
    const gstValue = (expenseValue * gstPercentage) / 100;
    const newExpense = await expense.create(
      expenseName,
      expenseValue,
      gstPercentage,
      expenseDate
    );
    if (gstType === "igst") {
      var newGst = await gst.create({
        date: newExpense.expenseDate,
        transaction: newExpense._id,
        type: "expense",
        igst: gstValue,
      });
    } else if (!gstType || gstType === "null") {
      var newGst = await gst.create({
        date: newExpense.expenseDate,
        transaction: newExpense._id,
        type: "expense",
        cgst: gstValue / 2,
        sgst: gstValue / 2,
      });
    }
    res.status(200).json({ newExpense, newGst });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expense.find();
    if (expenses.length === 0)
      return res.status(404).json({ message: "no records found" });
    res.status(200).json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await expense.findById(id);
    console.log(expenses);
    if (!expenses) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const expenses = await expense.findByIdAndUpdate(id, body, { new: true });
    if (!expenses) return res.status(404).json({ message: "no records found" });
    res.status(200).json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await expense.findByIdAndDelete(id);
    if (!expenses) return res.status(404).json({ message: "no records found" });
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};
