import {
  gst,
  rawPurchase,
  sales,
  slabPurchase,
} from "../../../models/accounting/purchases&sales";

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
    const findrawPurchase = await rawPurchase.find({ purchaseDate: date });
    const findslabPurchase = await slabPurchase.find({ purchaseDate: date });
    const findSale = await sales.find({ saleDate: date });
    const data = await gst.find({});
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
