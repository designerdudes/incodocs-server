import mongoose from "mongoose";

// Supplier collection
const supplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String },
    gstNo: { type: String },
    mobileNumber: { type: Number },
    state: { type: String },
    factoryAddress: { type: String },
  },
  { timestamps: true }
);

export const supplier = mongoose.model("supplier", supplierSchema);

// Customer collection
const customerSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    gstNo: { type: String },
    mobileNumber: { type: Number },
    state: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export const customer = mongoose.model("customer", customerSchema);
