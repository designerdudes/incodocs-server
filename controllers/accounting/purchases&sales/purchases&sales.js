import {
  sales,
  rawPurchase,
  slabPurchase,
  gst,
} from "../../../models/accounting/purchases&sales.js";
import {
  customer,
  supplier,
} from "../../../models/accounting/suppliers&customers.js";
import {
  blockInventory,
  slabInventory,
} from "../../../models/factoryManagement/inventory.js";
import { factory } from "../../../models/factoryManagement/factory.js";

// Slab Purchase API's
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
    const findFactory = await factory.findById(factoryId);
    if (!findFactory)
      return res.status(404).json({ message: "factory not found" });
    if (supplierId) {
      const findSupplier = await supplier.findById(supplierId);
      if (!findSupplier) {
        return res.status(404).json({ message: "supplier Id is invalid" });
      }
      // creating purchase
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

      // getting gst value
      const gstValue = (invoiceValue * gstPercentage) / 100;
      // Extract the first two letters
      const supplierPrefix = findSupplier.gstNo.slice(0, 2).toUpperCase();
      const factoryPrefix = findFactory.gstNo.slice(0, 2).toUpperCase();
      if (supplierPrefix === factoryPrefix) {
        var newGst = await gst.create({
          party: supplierId,
          partyType: "supplier",
          transaction: purchasedslab._id,
          type: "purchase",
          igst: gstValue,
        });
      } else if (supplierPrefix !== factoryPrefix) {
        var newGst = await gst.create({
          party: supplierId,
          partyType: "supplier",
          transaction: purchasedslab._id,
          type: "purchase",
          cgst: gstValue / 2,
          sgst: gstValue / 2,
        });
      }
      return res.status(200).json({ purchasedslab, newGst });
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

      // creating purchase
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
      
      // getting gst value
      const gstValue = (invoiceValue * gstPercentage) / 100;
      // Extract the first two letters
      const supplierPrefix = addSupplier.gstNo.slice(0, 2).toUpperCase();
      const factoryPrefix = findFactory.gstNo.slice(0, 2).toUpperCase();
      if (supplierPrefix === factoryPrefix) {
        var newGst = await gst.create({
          party: addSupplier._id,
          partyType: "supplier",
          transaction: purchasedslab._id,
          type: "purchase",
          igst: gstValue,
        });
      } else if (supplierPrefix !== factoryPrefix) {
        var newGst = await gst.create({
          party: addSupplier._id,
          partyType: "supplier",
          transaction: purchasedslab._id,
          type: "purchase",
          cgst: gstValue / 2,
          sgst: gstValue / 2,
        });
      }
      return res.status(200).json({ purchasedslab, newGst });
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
        factoryId: factoryId,
        slabNumber: slab.slabNumber,
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
        slabNumber: slab.slabNumber,
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

export const getAnySlabPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const getPurchase = await slabPurchase.find({
      factoryId: factoryId,
      _id: id,
    });
    if (getPurchase.length === 0) {
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

export const getAllSlabPurchaseByGst = async (req, res) => {
  try {
    const { factoryId } = req.body;
    const purchaseByGst = await slabPurchase.find({
      factoryId: factoryId,
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

export const getAllActualSlabPurchases = async (req, res) => {
  try {
    const { factoryId } = req.body;
    const actualPurchase = await slabPurchase.find({
      factoryId: factoryId,
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

export const getAllGstSlabPurchasesBySupplierId = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const purchases = await slabPurchase.find({
      supplierId: id,
      factoryId: factoryId,
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

export const getAllActualSlabPurchasesBySupplierId = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const purchases = await slabPurchase.find({
      supplierId: id,
      factoryId: factoryId,
      actualInvoiceValue: { $exists: true, $ne: null },
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

export const updateSlabPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const body = req.body;
    const findPurchase = await slabPurchase.find({
      factoryId: factoryId,
      _id: id,
    });
    if (findPurchase.length === 0) {
      return res.status(400).json({ message: "No Records Found" });
    }
    const updatedPurchase = await slabPurchase.findByIdAndDelete(id, body, {
      new: true,
    });
    res.status(200).json(updatedPurchase);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const deleteSlabPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const findPurchase = await slabPurchase.find({
      factoryId: factoryId,
      _id: id,
    });
    if (findPurchase.length === 0) {
      return res.status(400).json({ message: "No Records Found TO Delete" });
    }
    await slabPurchase.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

// Raw Purchase APi's
export const addRawPurchaseByGst = async (req, res) => {
  try {
    const {
      factoryId,
      supplierId,
      noOfBlocks,
      invoiceNo,
      invoiceValue,
      materialTYpe,
      volumeQuantity,
      length,
      height,
      breadth,
      weight,
      ratePerCubicVolume,
      gstPercentage,
      purchaseDate,
    } = req.body;
    const findFactory = await factory.findById(factoryId);
    if (!findFactory)
      return res.status(404).json({ message: "factory not found" });
    if (supplierId) {
      const findSupplier = await supplier.findById(supplierId);
      if (!findSupplier) {
        return res.status(404).json({ message: "supplier Id is invalid" });
      }

      // creating purchase
      const purchasedBlock = await rawPurchase.create({
        factoryId,
        supplierId,
        noOfBlocks,
        invoiceNo,
        invoiceValue,
        materialTYpe,
        volumeQuantity,
        length,
        height,
        breadth,
        weight,
        ratePerCubicVolume,
        gstPercentage,
        purchaseDate,
      });
      // getting gst value
      const gstValue = (invoiceValue * gstPercentage) / 100;
      // Extract the first two letters
      const supplierPrefix = findSupplier.gstNo.slice(0, 2).toUpperCase();
      const factoryPrefix = findFactory.gstNo.slice(0, 2).toUpperCase();
      if (supplierPrefix === factoryPrefix) {
        var newGst = await gst.create({
          party: supplierId,
          partyType: "supplier",
          transaction: purchasedBlock._id,
          type: "purchase",
          igst: gstValue,
        });
      } else if (supplierPrefix !== factoryPrefix) {
        var newGst = await gst.create({
          party: supplierId,
          partyType: "supplier",
          transaction: purchasedBlock._id,
          type: "purchase",
          cgst: gstValue / 2,
          sgst: gstValue / 2,
        });
      }
      return res.status(200).json({ purchasedBlock, newGst });
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
      const purchasedBlock = await rawPurchase.create({
        factoryId,
        supplierId: addSupplier._id,
        noOfBlocks,
        invoiceNo,
        invoiceValue,
        materialTYpe,
        volumeQuantity,
        length,
        height,
        breadth,
        weight,
        ratePerCubicVolume,
        gstPercentage,
        purchaseDate,
      });
      // getting gst value
      const gstValue = (invoiceValue * gstPercentage) / 100;
      // Extract the first two letters
      const supplierPrefix = addSupplier.gstNo.slice(0, 2).toUpperCase();
      const factoryPrefix = findFactory.gstNo.slice(0, 2).toUpperCase();
      if (supplierPrefix === factoryPrefix) {
        var newGst = await gst.create({
          party: addSupplier._id,
          partyType: "supplier",
          transaction: purchasedBlock._id,
          type: "purchase",
          igst: gstValue,
        });
      } else if (supplierPrefix !== factoryPrefix) {
        var newGst = await gst.create({
          party: addSupplier._id,
          partyType: "supplier",
          transaction: purchasedBlock._id,
          type: "purchase",
          cgst: gstValue / 2,
          sgst: gstValue / 2,
        });
      }
      return res.status(200).json({ purchasedBlock, newGst });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const addActualRawPurchase = async (req, res) => {
  try {
    const {
      supplierId,
      factoryId,
      noOfBlocks,
      invoiceNo,
      actualInvoiceValue,
      materialTYpe,
      volumeQuantity,
      length,
      height,
      breadth,
      weight,
      ratePerCubicVolume,
      purchaseDate,
      blocks,
    } = req.body;
    if (supplierId) {
      const addBlocks = blocks.map((block) => ({
        factoryId: block.factoryId,
        blockNumber: block.blockNumber,
        materialType: block.materialType,
        dimensions: slab.dimensions,
        status: slab.status,
        inStock: slab.inStock,
      }));
      const addBlock = await blockInventory.insertMany(addBlocks);
      const getBlocksIDs = addBlock.map((block) => block._id);
      const getBlockNos = addBlock.map((block) => block.blockNumber);
      const purchasedBlock = await rawPurchase.create({
        supplierId,
        factoryId,
        noOfBlocks,
        blockIds: getBlocksIDs,
        blockNo: getBlockNos,
        invoiceNo,
        actualInvoiceValue,
        materialTYpe,
        volumeQuantity,
        length,
        height,
        breadth,
        weight,
        ratePerCubicVolume,
        purchaseDate,
      });
      return res.status(200).json(purchasedBlock);
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
      const addBlocks = blocks.map((block) => ({
        factoryId: block.factoryId,
        blockNumber: block.blockNumber,
        materialType: block.materialType,
        dimensions: slab.dimensions,
        status: slab.status,
        inStock: slab.inStock,
      }));
      const addBlock = await blockInventory.insertMany(addBlocks);
      const getBlocksIDs = addBlock.map((block) => block._id);
      const getBlockNos = addBlock.map((block) => block.blockNumber);
      const purchasedBlock = await rawPurchase.create({
        supplierId: addSupplier._id,
        factoryId,
        noOfBlocks,
        blockIds: getBlocksIDs,
        blockNo: getBlockNos,
        invoiceNo,
        actualInvoiceValue,
        materialTYpe,
        volumeQuantity,
        length,
        height,
        breadth,
        weight,
        ratePerCubicVolume,
        purchaseDate,
      });
      return res.status(200).json(purchasedBlock);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getAnyRawPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const getPurchase = await rawPurchase.find({
      factoryId: factoryId,
      _id: id,
    });
    if (getPurchase.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    } else {
      res.status(200).json({ getPurchase });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getAllRawPurchaseByGst = async (req, res) => {
  try {
    const { factoryId } = req.body;
    const purchaseByGst = await rawPurchase.find({
      factoryId: factoryId,
      gstPercentage: { $exists: true, $ne: null }, // finds the purchases who has gstPercentage and excludes the purchases who's gstPercentage is null
    });
    if (purchaseByGst.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(purchaseByGst);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getAllActualRawPurchases = async (req, res) => {
  try {
    const { factoryId } = req.body;
    const actualPurchase = await rawPurchase.find({
      factoryId: factoryId,
      actualInvoiceValue: { $exists: true, $ne: null }, // finds the purchases who has actualInvoiceValue and excludes the purchases who's actualInvoiceValue is null
    });
    if (actualPurchase.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(actualPurchase);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getAllGstRawPurchasesBySupplierId = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const purchases = await rawPurchase.find({
      supplierId: id,
      factoryId: factoryId,
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

export const getAllActualRawPurchasesBySupplierId = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const purchases = await rawPurchase.find({
      supplierId: id,
      factoryId: factoryId,
      actualInvoiceValue: { $exists: true, $ne: null },
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

export const updateRawPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const body = req.body;
    const findPurchase = await rawPurchase.find({
      factoryId: factoryId,
      _id: id,
    });
    if (findPurchase.length === 0) {
      return res.status(400).json({ message: "No Records Found" });
    }
    const updatedPurchase = await rawPurchase.findByIdAndDelete(id, body, {
      new: true,
    });
    res.status(200).json(updatedPurchase);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const deleteRawPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const findPurchase = await rawPurchase.find({
      factoryId: factoryId,
      _id: id,
    });
    if (findPurchase.length === 0) {
      return res.status(400).json({ message: "No Records Found TO Delete" });
    }
    await rawPurchase.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

// Sales API's
export const createGstSale = async (req, res) => {
  try {
    const {
      factoryId,
      customerId,
      noOfSlabs,
      length,
      height,
      invoiceValue,
      gstPercentage,
      saleDate,
    } = req.body;
    const findFactory = await factory.findById(factoryId);
    if (!findFactory)
      return res.status(404).json({ message: "factory not found" });
    if (customerId) {
      const findcustomerId = await customer.findById(customerId);
      if (!findcustomerId) {
        return res.status(404).json({ message: "customer Id is invalid" });
      }
      // creating sale
      const addSale = await sales.create({
        factoryId,
        customerId,
        noOfSlabs,
        length,
        height,
        invoiceValue,
        gstPercentage,
        saleDate,
      });
      // getting gst value
      const gstValue = (invoiceValue * gstPercentage) / 100;
      // Extract the first two letters
      const supplierPrefix = findcustomerId.gstNo.slice(0, 2).toUpperCase();
      const factoryPrefix = findFactory.gstNo.slice(0, 2).toUpperCase();
      if (supplierPrefix === factoryPrefix) {
        var newGst = await gst.create({
          party: customerId,
          partyType: "customer",
          transaction: addSale._id,
          type: "sale",
          igst: gstValue,
        });
      } else if (supplierPrefix !== factoryPrefix) {
        var newGst = await gst.create({
          party: customerId,
          partyType: "customer",
          transaction: addSale._id,
          type: "sale",
          cgst: gstValue / 2,
          sgst: gstValue / 2,
        });
      }
      return res.status(200).json({ addSale, newGst });
    }
    if (!customerId || customerId === null) {
      const { customerName, gstNo, mobileNumber, state, address } = req.body;
      const addCustomer = await customer.create({
        customerName,
        gstNo,
        mobileNumber,
        state,
        address,
      });

      // creating sale
      const addSale = await sales.create({
        factoryId,
        customerId: addCustomer._id,
        noOfSlabs,
        length,
        height,
        invoiceValue,
        gstPercentage,
        saleDate,
      });
      // getting gst value
      const gstValue = (invoiceValue * gstPercentage) / 100;
      // Extract the first two letters
      const supplierPrefix = addCustomer.gstNo.slice(0, 2).toUpperCase();
      const factoryPrefix = findFactory.gstNo.slice(0, 2).toUpperCase();
      if (supplierPrefix === factoryPrefix) {
        var newGst = await gst.create({
          party: addCustomer._id,
          partyType: "customer",
          transaction: addSale._id,
          type: "sale",
          igst: gstValue,
        });
      } else if (supplierPrefix !== factoryPrefix) {
        var newGst = await gst.create({
          party: addCustomer._id,
          partyType: "customer",
          transaction: addSale._id,
          type: "sale",
          cgst: gstValue / 2,
          sgst: gstValue / 2,
        });
      }
      res.status(200).json({ addSale, newGst });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const createActualSale = async (req, res) => {
  try {
    const {
      factoryId,
      customerId,
      noOfSlabs,
      slabIds,
      length,
      height,
      actualInvoiceValue,
      saleDate,
    } = req.body;
    if (customerId) {
      const sale = await sales.create({
        factoryId,
        customerId,
        noOfSlabs,
        slabIds,
        length,
        height,
        actualInvoiceValue,
        saleDate,
      });
      return res.status(200).json(sale);
    }
    if (!customerId || customerId === null) {
      const { customerName, gstNo, mobileNumber, state, address } = req.body;
      const addCustomer = await customer.create({
        customerName,
        gstNo,
        mobileNumber,
        state,
        address,
      });
      const sale = await sales.create({
        factoryId,
        customerId: addCustomer._id,
        noOfSlabs,
        slabIds,
        length,
        height,
        actualInvoiceValue,
        saleDate,
      });
      return res.status(200).json(sale);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getAnySaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const getSale = await sales.find({
      factoryId: factoryId,
      _id: id,
    });
    if (getSale.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    } else {
      res.status(200).json(getSale);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllSalesByGst = async (req, res) => {
  try {
    const { factoryId } = req.body;
    const slawsByGst = await sales.find({
      factoryId: factoryId,
      gstPercentage: { $exists: true, $ne: null },
    });
    if (slawsByGst.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(slawsByGst);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllActualSales = async (req, res) => {
  try {
    const { factoryId } = req.body;
    const actualSales = await sales.find({
      factoryId: factoryId,
      actualInvoiceValue: { $exists: true, $ne: null },
    });
    if (actualSales.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(actualSales);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getAllGstSalesByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const sale = await sales.find({
      customerId: id,
      factoryId: factoryId,
      gstPercentage: { $exists: true, $ne: null },
    });
    if (sale.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(sale);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const getAllActualSalesByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const sale = await sales.find({
      customerId: id,
      factoryId: factoryId,
      actualInvoiceValue: { $exists: true, $ne: null },
    });
    if (sale.length === 0) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(sale);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const body = req.body;
    const findSale = await sales.find({
      factoryId: factoryId,
      _id: id,
    });
    if (findSale.length === 0) {
      return res.status(400).json({ message: "No Records Found" });
    }
    const updatedSale = await sales.findByIdAndDelete(id, body, {
      new: true,
    });
    res.status(200).json({ status: "Updated Successfully ", updatedSale });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const findSale = await sales.find({
      factoryId: factoryId,
      _id: id,
    });
    if (findSale.length === 0) {
      return res.status(400).json({ message: "No Records Found TO Delete" });
    }
    await sales.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};
