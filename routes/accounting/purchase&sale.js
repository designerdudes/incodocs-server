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
  getAllActualRawPurchasesByFactoryId,
  getAllActualRawPurchasesBySupplierId,
  getAllActualSales,
  getAllActualSalesByCustomerId,
  getAllActualSlabPurchases,
  getAllActualSlabPurchasesByFactoryId,
  getAllActualSlabPurchasesBySupplierId,
  getAllGstRawPurchasesByFactoryId,
  getAllGstRawPurchasesBySupplierId,
  getAllGstSalesByCustomerId,
  getAllGstSlabPurchasesByFactoryId,
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
} from "../../controllers/accounting/purchases&sales/purchases&sales.js";

// slab purchsase routes
router.post("/purchase/addslabgst", addSlabPurchaseByGst);

router.post("/purchase/addslab", addActualSlabPurchase);

router.get("/purchase/slabgetbyid/:id", getAnySlabPurchaseById);

router.get("/purchase/getallslabgst", getAllSlabPurchaseByGst);

router.get("/purchase/getallslab", getAllActualSlabPurchases);

router.get(
  "/purchase/getgstslabbysupplier/:id",
  getAllGstSlabPurchasesBySupplierId
);

router.get(
  "/purchase/getslabbysupplier/:id",
  getAllActualSlabPurchasesBySupplierId
);

router.get(
  "/purchase/getslabbyfactory/:id",
  getAllActualSlabPurchasesByFactoryId
);

router.get(
  "/purchase/getgstslabbyfactory/:id",
  getAllGstSlabPurchasesByFactoryId
);

router.put("/purchase/updateslab/:id", updateSlabPurchase);

router.delete("/purchase/deleteslab/:id", deleteSlabPurchase);

// raw purchase routes
router.post("/purchase/addrawgst", addRawPurchaseByGst);

router.post("/purchase/addraw", addActualRawPurchase);

router.get("/purchase/rawgetbyid/:id", getAnyRawPurchaseById);

router.get("/purchase/getallrawgst", getAllRawPurchaseByGst);

router.get("/purchase/getallraw", getAllActualRawPurchases);

router.get(
  "/purchase/getgstrawbysupplier/:id",
  getAllGstRawPurchasesBySupplierId
);

router.get(
  "/purchase/getrawbysupplier/:id",
  getAllActualRawPurchasesBySupplierId
);

router.get(
  "/purchase/getgstrawbyfactory/:id",
  getAllGstRawPurchasesByFactoryId
);

router.get(
  "/purchase/getrawbyfactory/:id",
  getAllActualRawPurchasesByFactoryId
);

router.put("/purchase/updateraw/:id", updateRawPurchase);

router.delete("/purchase/deleteraw/:id", deleteRawPurchase);

// sale routes
router.post("/sale/add", createActualSale);

router.post("/sale/addgst", createGstSale);

router.get("/sale/getbyid", getAnySaleById);

router.get("/sale/getgstsale", getAllSalesByGst);

router.get("/sale/getsale", getAllActualSales);

router.get("/sale/getgstsalebycustomer", getAllGstSalesByCustomerId);

router.get("/sale/getsalebycustomer", getAllActualSalesByCustomerId);

router.put("/sale/updatesale", updateSale);

router.delete("/sale/deletesale", deleteSale);

export default router;
