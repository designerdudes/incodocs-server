import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Storage } from "@google-cloud/storage";

import authRoute from "./routes/auth.js";
// import {
//   authenticateToken,
//   adminAuthenticateToken,
// } from "./middleware/authToken.js";

import errorHandler from "./middleware/error.js";
import userRouter from "./routes/user.js";
import organizationRouter from "./routes/documentation/organization.js";
import shipmentRouter from "./routes/documentation/shipment.js";
import inventory from "./routes/factoryManagement/inventory.js";
import factory from "./routes/factoryManagement/factory.js";
import customerAndSupplier from "./routes/accounting/customer&supplier.js";
import purchasesAndSales from "./routes/accounting/purchase&sale.js";
import gst from "./routes/accounting/gst.js";
import expense from "./routes/accounting/expenses.js";
import otps from "./routes/otp.js";
import uploadFiles from "./routes/uploadfile/upload.js";

dotenv.config();

const connectWithRetry = () => {
  return mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.error(
        "Error connecting to the database, retry after 5 seconds",
        err
      );
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

const app = express();
app.use(express.json());

app.use(cors({ origin: "*" }));

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
storage
  .getBuckets()
  .then((results) =>
    console.log(
      "Buckets:",
      results[0].map((bucket) => bucket.name)
    )
  )
  .catch((err) => console.error("Error fetching buckets:", err));

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});

app.get("/", (req, res) => {
  res.status(200).send("home");
});

app.use("/otp", otps);
app.use("/user", userRouter);
app.use("/auth", authRoute);
// app.use(authenticateToken);
app.use("/organizations", organizationRouter);
app.use("/shipment", shipmentRouter);
app.use("/factory", factory);
// app.use(adminAuthenticateToken);
app.use("/factory-management", inventory);
app.use("/accounting", customerAndSupplier);
app.use("/transaction", purchasesAndSales);
app.use("/gst", gst);
app.use("/expense", expense);
app.use("/shipmentdocsfile", uploadFiles);
// checkSubscription.start()
// createSubscriptionOrdersCron.start()
app.use(errorHandler);
