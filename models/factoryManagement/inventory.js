import mongoose from "mongoose";

// Lot inventory schema
const lotSchema = new mongoose.Schema(
  {
    lotName: { type: String, required: true },
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    materialType: { type: String },
    noOfBlocks: { type: Number },
    blocksId: [{ type: mongoose.Schema.Types.ObjectId, ref: "blockInventory" }],
  },
  { timestamps: true }
);
const lotInventory = mongoose.model("lotInventory", lotSchema);

// Block inventory schema
const blockInventorySchema = new mongoose.Schema(
  {
    lotId: { type: mongoose.Schema.Types.ObjectId, ref: "lotInventory" },
    blockNumber: { type: Number, required: true, unique: true },
    materialType: { type: String },
    dimensions: {
      weight: {
        value: { type: Number, required: true },
        units: { type: String, default: "tons" },
      },
      length: {
        value: { type: Number, required: true },
        units: { type: String, default: "inch" },
      },
      breadth: {
        value: { type: Number, required: true },
        units: { type: String, default: "inch" },
      },
      height: {
        value: { type: Number, required: true },
        units: { type: String, default: "inch" },
      },
    },
    SlabsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "slabInventory" }],
    status: {
      type: String,
      enum: ["inStock", "inCutting", "polished", "completed"],
      default: "inStock",
    },
    inStock: { type: Boolean },
  },
  { timestamps: true }
);
const blockInventory = mongoose.model("blockInventory", blockInventorySchema);

// Slab inventory schema
const slabInventorySchema = new mongoose.Schema(
  {
    blockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blockInventory",
    },
    factoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "factory",
    },
    blockNumber: { type: Number, unique: true },
    productName: { type: String },
    quantity: { type: Number, required: true },
    dimensions: {
      thickness: {
        value: { type: Number },
        units: { type: String, default: "inch" },
      },
      length: {
        value: { type: Number, required: true },
        units: { type: String, default: "inch" },
      },
      breadth: {
        value: { type: Number },
        units: { type: String, default: "inch" },
      },
      height: {
        value: { type: Number, required: true },
        units: { type: String, default: "inch" },
      },
    },
    status: {
      type: String,
      enum: ["Cut", "Trimmed", "Polished"],
      default: "Cut",
    },
    inStock: { type: Boolean },
    trim: {
      length: {
        value: { type: Number },
        units: { type: String, default: "inch" },
      },
      height: {
        value: { type: Number },
        units: { type: String, default: "inch" },
      },
    },
  },
  { timestamps: true }
);
const slabInventory = mongoose.model("slabInventory", slabInventorySchema);

export { blockInventory, slabInventory, lotInventory };
