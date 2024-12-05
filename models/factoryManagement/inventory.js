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
    factoryId: { type: mongoose.Schema.Types.ObjectId, ref: "factory" },
    blockNumber: { type: Number, unique: true },
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
      enum: ["inStock", "inCutting", "cut"],
      default: "inStock",
    },
    inStock: { type: Boolean },
  },
  { timestamps: true }
);

// Middleware to auto-generate unique blockNumber
blockInventorySchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastBlock = await this.constructor.findOne().sort({ blockNumber: -1 });
    this.blockNumber = lastBlock ? lastBlock.blockNumber + 1 : 1; // Start with 1 if no blocks exist
  }
  next();
});

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
    slabNumber: { type: Number },
    blockNumber: { type: Number },
    productName: { type: String },
    dimensions: {
      length: {
        value: { type: Number },
        units: { type: String, default: "inch" },
      },
      height: {
        value: { type: Number },
        units: { type: String, default: "inch" },
      },
    },
    status: {
      type: String,
      enum: ["readyForPolish", "inPolishing", "polished"],
      default: "readyForPolish",
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

// Middleware to auto-generate unique slabNumber
slabInventorySchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastBlock = await this.constructor.findOne().sort({ slabNumber: -1 });
    this.slabNumber = lastBlock ? lastBlock.slabNumber + 1 : 1; // Start with 1 if no slab exist
  }
  next();
});

const slabInventory = mongoose.model("slabInventory", slabInventorySchema);

export { blockInventory, slabInventory, lotInventory };
