import express from "express";
const router = express.Router();

import {
  getAllGstData,
  getAllGstPurchases,
  getAllGstSales,
  getAllPurchasesGstBySupplier,
  getAllSalesGstByCustomer,
  getGstDataByDate,
  getGstDataBymonth,
} from "../../controllers/accounting/gst/gst.js";

router.get("/getall", getAllGstData);

router.get("/getbydate", getGstDataByDate);

router.get("/getbymonth", getGstDataBymonth);

router.get("/getgstpurchasesbysupplier/:id", getAllPurchasesGstBySupplier);

router.get("/getgstsalesbycustomer/:id", getAllSalesGstByCustomer);

router.get("/getgstpurchases", getAllGstPurchases);

router.get("/getgstsales", getAllGstSales);

export default router;
