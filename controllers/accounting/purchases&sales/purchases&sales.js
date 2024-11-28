import {
  sales,
  rawPurchase,
  slabPurchase,
} from "../../../models/accounting/purchases&sales";
import { supplier } from "../../../models/accounting/suppliers&customers";

export const addSlabPurchaseByGst = async (req, res) => {
  try {
    const {
      supplierId,
      invoiceNo,
      invoiceValue,
      noOfSlabs,
      length,
      height,
      ratePerSqft,
      gstPercentage,
      purchaseDate,
    } = req.body;
    if (supplierId) {
      const purchasedslab = await slabPurchase.create({
        supplierId,
        invoiceNo,
        invoiceValue,
        noOfSlabs,
        length,
        height,
        ratePerSqft,
        gstPercentage,
        purchaseDate,
      });
      return res.status(200).json(purchasedslab);
    }
    if (!supplierId || supplierId === null) {
      const { supplierName, gstNo, mobileNumber, state, factoryAddress } =
        req.body;
      const addSupplier = await supplier.create({
        supplierName,
        gstNo,
        mobileNumber,
        state,
        factoryAddress,
      });
      const purchasedslab = await slabPurchase.create({
        supplierId: addSupplier._id,
        invoiceNo,
        invoiceValue,
        noOfSlabs,
        length,
        height,
        ratePerSqft,
        gstPercentage,
        purchaseDate,
      });
      return res.status(200).json(purchasedslab);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const addActualSlabPurchase = async (req, res) => {
  try {
    const {
      supplierId,
      invoiceNo,
      actualInvoiceValue,
      noOfSlabs,
      slabIds,
      length,
      height,
      ratePerSqft,
      purchaseDate,
    } = req.body;
    
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};
