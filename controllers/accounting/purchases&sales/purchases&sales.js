import {
  sales,
  rawPurchase,
  slabPurchase,
} from "../../../models/accounting/purchases&sales";
import { supplier } from "../../../models/accounting/suppliers&customers";
import { slabInventory } from "../../../models/factoryManagement/inventory";

export const addSlabPurchaseByGst = async (req, res) => {
  try {
    const {
      supplierId,
      factoryId,
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
        factoryId,
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
        factoryId,
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
      factoryId,
      invoiceNo,
      actualInvoiceValue,
      noOfSlabs,
      length,
      height,
      ratePerSqft,
      purchaseDate,
      slabs,
    } = req.body;
    if (supplierId) {
      const addSlabs = slabs.map((slab) => ({
        factoryId: slab.factoryId,
        productName: slab.productName,
        dimensions: slab.dimensions,
        status: slab.status,
        inStock: slab.inStock,
      }));
      const addSlab = await slabInventory.insertMany(addSlabs);
      const getSlabsIDs = addSlab.map((slab) => slab._id);
      const purchasedslab = await slabPurchase.create({
        supplierId,
        factoryId,
        invoiceNo,
        actualInvoiceValue,
        noOfSlabs,
        slabIds: getSlabsIDs,
        length,
        height,
        ratePerSqft,
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
      const addSlabs = slabs.map((slab) => ({
        factoryId: slab.factoryId,
        productName: slab.productName,
        dimensions: slab.dimensions,
        status: slab.status,
        inStock: slab.inStock,
      }));
      const addSlab = await slabInventory.insertMany(addSlabs);
      const getSlabsIDs = addSlab.map((slab) => slab._id);
      const purchasedslab = await slabPurchase.create({
        supplierId: addSupplier._id,
        factoryId,
        invoiceNo,
        actualInvoiceValue,
        noOfSlabs,
        slabIds: getSlabsIDs,
        length,
        height,
        ratePerSqft,
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

export const getAnyPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const getPurchase = await slabPurchase.find({
      factoryId: factoryId,
      _id: id,
    });
    if (!getPurchase) {
      return res.status(404).json({ message: "No Records Found" });
    } else {
      res.status(200).json({ getPurchase });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllPurchaseByGst = async (req, res) => {
  try {
    const purchaseByGst = await slabPurchase.find({
      gstPercentage: { $exists: true, $ne: null }, // finds the purchases who has gstPercentage and excludes the purchases who's gstPercentage is null
    });
    if (purchaseByGst.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(purchaseByGst);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllActualPurchases = async (req, res) => {
  try {
    const actualPurchase = await slabPurchase.find({
      actualInvoiceValue: { $exists: true, $ne: null }, // finds the purchases who has actualInvoiceValue and excludes the purchases who's actualInvoiceValue is null
    });
    if (actualPurchase.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(actualPurchase);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllGstPurchasesBySupplierId = async (req, res) => {
  try {
    const { id } = req.params;
    const purchases = await slabPurchase.find({
      supplierId: id,
      gstPercentage: { $exists: true, $ne: null },
    });
    if (purchases.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(purchases);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getAllActualPurchasesBySupplierId = async (req, res) => {};
