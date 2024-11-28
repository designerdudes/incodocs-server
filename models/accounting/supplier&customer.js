import mongoose from "mongoose";
import { addressSchema } from "../../models/documentation/organization.js";

// Supplier collection
const supplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String },
    gstNo: { type: String },
    address: addressSchema,
    mobileNumber: { type: Number },
  },
  { timestamps: true }
);

export const supplierModel = mongoose.model("supplier", supplierSchema);

// Customer collection
const customerSchema = new mongoose.Schema(
    {
      customerName: { type: String },
      gstNo: { type: String },
      mobileNumber: { type: Number },
    },
    { timestamps: true }
  );
  
  export const customerModel = mongoose.model("customer", customerSchema);
  