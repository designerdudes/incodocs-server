import mongoose from "mongoose";

// Finished Material Type Purchase
const finishedPurchaseSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "supplier" },
    // purchaseType: { type: String, enum: ["raw", "finished"] },
    invoiceNo: { type: String, required: true },
    invoiceValue: { type: Number },
    noOfSlabs: { type: Number },
    length: { type: Number },
    height: { type: Number },
    ratePerSqft: { type: Number },
    gstPercentage: { type: Number, enum: [0, 1, 5, 9, 12, 18, 28] },
    purchaseDate: { type: Date },
  },
  { timestamps: true }
);

export const finishedPurchase = mongoose.model(
  "finishedPurchase",
  finishedPurchaseSchema
);

// Raw Material Type Purchase
const rawPurchaseSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "supplier" },
    // purchaseType: { type: String, enum: ["raw", "finished"] },
    noOfBlocks: { type: Number },
    blockNo: [{ type: Number }],
    invoiceNo: { type: String, required: true },
    invoiceValue: { type: Number },
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
