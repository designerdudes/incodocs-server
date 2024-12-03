import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// import authRoute from './routes/auth.js';

import errorHandler from "./middleware/error.js";
import userRouter from "./routes/user.js";
import organizationRouter from "./routes/documentation/organization.js";
import shipmentRouter from "./routes/documentation/shipment.js";
import inventory from "./routes/factoryManagement/inventory.js";
import factory from "./routes/factoryManagement/factory.js";
import accounting from "./routes/accounting/customers&suppliers/customer&supplier.js";
import transaction from "./controllers/accounting/purchases&sales/purchases&sales.js";

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

// Enable CORS for a specific origin
app.use(cors({ origin: "*" }));

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
//basic home route
app.get("/", (req, res) => {
  res.status(200).send("home");
});

// app.use('/auth', authRoute);
app.use("/user", userRouter);
app.use("/organizations", organizationRouter);
app.use("/shipment", shipmentRouter);
app.use("/factory", factory);
app.use("/factory-management", inventory);
app.use("/accounting", accounting);
app.use("/transaction", transaction);
// checkSubscription.start()
// createSubscriptionOrdersCron.start()

app.use(errorHandler);
