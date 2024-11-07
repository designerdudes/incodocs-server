import mongoose from "mongoose";

const rawInventorySchema = new mongoose.Schema(
  {
    materialName: String,
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
  },
  { timestamps: true }
);

const finishedInventorySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const rawInventory = mongoose.model("Inventory", rawInventorySchema);
const finishedInventory = mongoose.model(
  "finishedInventory",
  finishedInventorySchema
);
export default { rawInventory, finishedInventory };
