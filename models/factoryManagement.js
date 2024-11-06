import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    materialName: String,
    weight: Number,
    length: {
      value: { type: Number, required: true },
      units: { type: String, default: "ft" },
    },
    breadth: {
      value: { type: Number, required: true },
      units: { type: String, default: "ft" },
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
