import mongoose from "mongoose";

const shipmentSupplierSchema = new mongoose.Schema(
  {
    supplierName: { type: String },
    gstNo: { type: String },
    address: { type: String },
    responsiblePerson: { type: String },
    mobileNumber: { type: Number },
    state: { type: String },
    factoryAddress: { type: String },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

export const shipmentSupplier = mongoose.model(
  "shipmentsupplier",
  shipmentSupplierSchema
);
