import mongoose from "mongoose";

const rawInventorySchema = new mongoose.Schema({
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
  factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
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
  rawInventoryId: {
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

// const inventorySchema = new mongoose.Schema(
//   {
//     rawInventory: { type: rawInventorySchema },
//     finishedInventory: { type: finishedInventorySchema },
//     factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
//     organizationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//     },
//   },
//   { timestamps: true }
// );

// const inventory = mongoose.model('inventory', inventorySchema)

export default { rawInventory, finishedInventory};
