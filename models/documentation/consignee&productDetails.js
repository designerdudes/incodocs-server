import mongoose from "mongoose";

const consigneeSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    responsiblePerson: String,
    mobileNo: Number,
    email: String,
    vatNo: String,
    taxId: String,
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

export const consignee = mongoose.model("consignee", consigneeSchema);

const shippingLineSchema = new mongoose.Schema(
  {
    shippingLineName: { type: String },
    address: { type: String },
    responsiblePerson: { type: String },
    mobileNo: { type: Number },
    email: { type: String },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

export const shippingline = mongoose.model("shippingline", shippingLineSchema);

const forwarderSchema = new mongoose.Schema(
  {
    forwarderName: { type: String },
    address: { type: String },
    responsiblePerson: { type: String },
    mobileNo: { type: Number },
    email: { type: String },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

export const forwardername = mongoose.model("forwardername", forwarderSchema);

const transporterSchema = new mongoose.Schema(
  {
    transporterName: { type: String },
    address: { type: String },
    responsiblePerson: { type: String },
    mobileNo: { type: Number },
    email: { type: String },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

export const transportername = mongoose.model(
  "transportername",
  transporterSchema
);
