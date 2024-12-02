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
    address: { type: string },
  },
  { timestamps: true }
);

export const customer = mongoose.model("customer", customerSchema);

const gstSchema = new mongoose.Schema(
  {
    date: { type: Date },
    type: { type: String, enum: ["purchase", "sale"] },
    description: { type: String, enum: ["raw material", "finished"] },
    partyName: { type: String },
    invoice: { type: String },
    amount: { type: String },
    igst: { type: Number },
    cgst: { type: Number },
    sgst: { type: Number },
  },
  { timestamps: true }
);

export const gst = mongoose.model("gst", gstSchema);
