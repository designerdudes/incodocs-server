import express from "express";
const router = express.Router();

import {
  addActualRawPurchase,
  addActualSlabPurchase,
  addRawPurchaseByGst,
  addSlabPurchaseByGst,
  createActualSale,
  createGstSale,
  deleteRawPurchase,
  deleteSale,
  deleteSlabPurchase,
  getAllActualRawPurchases,
  getAllActualRawPurchasesBySupplierId,
  getAllActualSales,
  getAllActualSalesByCustomerId,
  getAllActualSlabPurchases,
  getAllActualSlabPurchasesBySupplierId,
  getAllGstRawPurchasesBySupplierId,
  getAllGstSalesByCustomerId,
  getAllGstSlabPurchasesBySupplierId,
  getAllRawPurchaseByGst,
  getAllSalesByGst,
  getAllSlabPurchaseByGst,
  getAnyRawPurchaseById,
  getAnySaleById,
  getAnySlabPurchaseById,
  updateRawPurchase,
  updateSale,
  updateSlabPurchase,
} from "../../../controllers/accounting/purchases&sales/purchases&sales";

// slab purchsase routes
router.create("/purchase/addslabgst", addSlabPurchaseByGst);

router.create("/purchase/addslab", addActualSlabPurchase);

router.get("/purchase/slabgetbyid", getAnySlabPurchaseById);

router.get("/purchase/getallslabgst", getAllSlabPurchaseByGst);

router.get("/purchase/getallslab", getAllActualSlabPurchases);

router.get(
  "/purchase/getgstslabbysupplier",
  getAllGstSlabPurchasesBySupplierId
);

router.get(
  "/purchase/getslabbysupplier",
  getAllActualSlabPurchasesBySupplierId
);

router.put("/purchase/updateslab", updateSlabPurchase);

router.delete("/purchase/deleteslab", deleteSlabPurchase);

// raw purchase routes
router.create("/purchase/addrawgst", addRawPurchaseByGst);

router.create("/purchase/addraw", addActualRawPurchase);

router.get("/purchase/rawgetbyid", getAnyRawPurchaseById);

router.get("/purchase/getallrawgst", getAllRawPurchaseByGst);

router.get("/purchase/getallraw", getAllActualRawPurchases);

router.get("/purchase/getgstrawbysupplier", getAllGstRawPurchasesBySupplierId);

router.get("/purchase/getrawbysupplier", getAllActualRawPurchasesBySupplierId);

router.put("/purchase/updateraw", updateRawPurchase);

router.delete("/purchase/deleteraw", deleteRawPurchase);

// sale routes
router.create("/sale/add", createActualSale);

router.create("/sale/addgst", createGstSale);

router.create("/sale/getbyid", getAnySaleById);

router.create("/sale/getgstsale", getAllSalesByGst);

router.create("/sale/getsale", getAllActualSales);

router.create("/sale/getgstsalebycustomer", getAllGstSalesByCustomerId);

router.create("/sale/getsalebycustomer", getAllActualSalesByCustomerId);

router.create("/sale/updatesale", updateSale);

router.create("/sale/deletesale", deleteSale);
