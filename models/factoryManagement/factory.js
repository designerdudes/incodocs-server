import mongoose from "mongoose";
import { addressSchema } from "../../models/documentation/organization.js";

// Factory Schema Model
const factorySchema = new mongoose.Schema(
  {
    factoryName: { type: String, required: true },
    address: { type: addressSchema, sparse: true },
    BlocksId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blockInventory",
      },
    ],
    finishedSlabsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "slabInventory",
      },
    ],
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);
const factory = mongoose.model("factory", factorySchema);

// Worker Schema
const workerSchema = new mongoose.Schema(
  {
    slapId: { type: mongoose.Schema.Types.ObjectId, ref: "slabInventory" },
    name: { type: String, required: true },
    totalSqftofCutting: { type: Number, default: 0 },
    totalSqftofPolishing: { type: Number, default: 0 },
    // cuttingRatePerSqft: { type: Number, default: 3.75 },
    // polishRatePerSqft: { type: Number, default: 11 },
    totalPayment: { type: Number },
  },
  { timestamps: true }
);
const worker = mongoose.model("worker", workerSchema);

export { factory, worker };
