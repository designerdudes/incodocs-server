import mongoose from "mongoose";
import { addressSchema } from "../../models/documentation/organization.js";

const supplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String },
    gstNo: { type: String },
    address: addressSchema,
    mobileNumber: { type: Number },
  },
  { timestamps: true }
);

export const supplier= mongoose.model("supplier", supplierSchema);

const customerSchema = new mongoose.Schema(
    {
      customerName: { type: String },
      gstNo: { type: String },
      mobileNumber: { type: Number },
    },
    { timestamps: true }
  );
  
  export const customer = mongoose.model("customer", customerSchema);
  