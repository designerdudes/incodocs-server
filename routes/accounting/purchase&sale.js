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
  getAllActualSalesByFactoryId,
  getAllActualSlabPurchases,
  getAllActualSlabPurchasesByFactoryId,
  getAllActualSlabPurchasesBySupplierId,
  getAllGstRawPurchasesByFactoryId,
  getAllGstRawPurchasesBySupplierId,
  getAllGstSalesByCustomerId,
  getAllGstSalesByFactoryId,
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

router.get("/purchase/slabgetbyid/:id/:factoryId", getAnySlabPurchaseById);

router.get("/purchase/getallslabgst/:factoryId", getAllSlabPurchaseByGst);

router.get("/purchase/getallslab/:factoryId", getAllActualSlabPurchases);

router.get(
  "/purchase/getgstslabbysupplier/:id/:factoryId",
  getAllGstSlabPurchasesBySupplierId
);

router.get(
  "/purchase/getslabbysupplier/:id/:factoryId",
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

router.put("/purchase/updateslab/:id/:factoryId", updateSlabPurchase);

router.delete("/purchase/deleteslab/:id/:factoryId", deleteSlabPurchase);

// raw purchase routes
router.post("/purchase/addrawgst", addRawPurchaseByGst);

router.post("/purchase/addraw", addActualRawPurchase);

router.get("/purchase/rawgetbyid/:id/:factoryId", getAnyRawPurchaseById);

router.get("/purchase/getallrawgst/:factoryId", getAllRawPurchaseByGst);

router.get("/purchase/getallraw/:factoryId", getAllActualRawPurchases);

router.get(
  "/purchase/getgstrawbysupplier/:id/:factoryId",
  getAllGstRawPurchasesBySupplierId
);

router.get(
  "/purchase/getrawbysupplier/:id/:factoryId",
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

router.put("/purchase/updateraw/:id/:factoryId", updateRawPurchase);

router.delete("/purchase/deleteraw/:id/:factoryId", deleteRawPurchase);

// sale routes
router.post("/sale/add", createActualSale);

router.post("/sale/addgst", createGstSale);

router.get("/sale/getbyid/:id/:factoryId", getAnySaleById);

router.get("/sale/getgstsale/:factoryId", getAllSalesByGst);

router.get("/sale/getsale/:factoryId", getAllActualSales);

router.get(
  "/sale/getgstsalebycustomer/:id/:factoryId",
  getAllGstSalesByCustomerId
);

router.get(
  "/sale/getsalebycustomer/:id/:factoryId",
  getAllActualSalesByCustomerId
);

router.get("/sale/getsalebyfactory/:id", getAllActualSalesByFactoryId);

router.get("/sale/getgstsalebyfactory/:id", getAllGstSalesByFactoryId);

router.put("/sale/updatesale/:id/:factoryId", updateSale);

router.delete("/sale/deletesale/:id/:factoryId", deleteSale);

export default router;
