import mongoose from "mongoose";

// Finished Material Type Purchase
const slabPurchaseSchema = new mongoose.Schema(
  {
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
    // purchaseType: { type: String, enum: ["raw", "finished"] },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "supplier" },
    invoiceNo: { type: String, required: true },
    invoiceValue: { type: Number },
    actualInvoiceValue: { type: Number },
    noOfSlabs: { type: Number },
    slabIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "slabInventory" }],
    length: { type: Number },
    height: { type: Number },
    ratePerSqft: { type: Number },
    gstPercentage: { type: Number, enum: [0, 1, 5, 9, 12, 18, 28] },
    purchaseDate: { type: Date },
  },
  { timestamps: true }
);

export const slabPurchase = mongoose.model("slabPurchase", slabPurchaseSchema);

// Raw Material Type Purchase
const rawPurchaseSchema = new mongoose.Schema(
  {
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "supplier" },
    noOfBlocks: { type: Number },
    blockIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "blockInventory" }],
    blockNo: [{ type: Number }],
    invoiceNo: { type: String, required: true },
    invoiceValue: { type: Number },
    actualInvoiceValue: { type: Number },
    materialTYpe: { type: String },
    volumeQuantity: { type: Number },
    length: { type: Number },
    height: { type: Number },
    breadth: { type: Number },
    weight: { type: Number },
    ratePerCubicVolume: { type: Number },
    gstPercentage: { type: Number, enum: [0, 1, 5, 9, 12, 18, 28] },
    purchaseDate: { type: Date },
  },
  { timestamps: true }
);

export const rawPurchase = mongoose.model("rawPurchase", rawPurchaseSchema);

// sales collection
const salesSchema = new mongoose.Schema(
  {
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
    noOfSlabs: { type: Number },
    slabIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "slabInventory" }],
    length: { type: Number },
    height: { type: Number },
    invoiceValue: { type: Number },
    actualInvoiceValue: { type: Number },
    gstPercentage: { type: Number },
    saleDate: { type: Date },
  },
  { timestamps: true }
);

export const sales = mongoose.model("sales", salesSchema);

const gstSchema = new mongoose.Schema(
  {
    // date: { type: Date },
    // description: { type: String, enum: ["raw material", "finished"] },
    // partyName: { type: String },
    // invoice: { type: String },
    // amount: { type: String },
    party: { type: mongoose.Schema.Types.ObjectId, refPath: "partyType" },
    partyType: { type: String, enum: ["supplier", "customer"] },
    type: { type: String, enum: ["purchase", "sale"] },
    igst: { type: Number },
    cgst: { type: Number },
    sgst: { type: Number },
  },
  { timestamps: true }
);

export const gst = mongoose.model("gst", gstSchema);
