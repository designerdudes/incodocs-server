import mongoose from "mongoose";

const rawInventorySchema = new mongoose.Schema({
  blockNumber: { type: Number },
  lotId: { type: mongoose.Schema.Types.ObjectId, ref: "lot" },
  materialName: { type: String, required: true },
  materialType: { type: String, required: true },
  quantity: { type: Number, required: true },
  weight: {
    value: { type: Number },
    units: { type: String, default: "tons" },
  },
  length: {
    value: { type: Number },
    units: { type: String, default: "ft" },
  },
  breadth: {
    value: { type: Number },
    units: { type: String, default: "ft" },
  },
  height: {
    value: { type: Number },
    units: { type: String, default: "ft" },
  },
  status: { type: String, enum: ["ready for cutting", "ready for polishing"] },
});
const rawInventory = mongoose.model("rawInventory", rawInventorySchema);

const finishedInventorySchema = new mongoose.Schema({
  productName: String,
  quantity: { type: Number, required: true },
  weight: {
    value: { type: Number },
    units: { type: String, default: "tons" },
  },
  thickness: {
    value: { type: Number },
    units: { type: String, default: "cm" },
  },
  length: {
    value: { type: Number },
    units: { type: String, default: "ft" },
  },
  breadth: {
    value: { type: Number },
    units: { type: String, default: "ft" },
  },
  rawBlockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
  },
  factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
});
const finishedInventory = mongoose.model(
  "finishedInventory",
  finishedInventorySchema
);

const lotSchema = new mongoose.Schema(
  {
    lotName: { type: String, required: true },
    noOfBlocks: { type: Number },
    blocksId: [{ type: mongoose.Schema.Types.ObjectId, ref: "rawInventory" }],
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

const lot = mongoose.model("lot", lotSchema);

export default { rawInventory, finishedInventory, lot };
