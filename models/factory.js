import mongoose from "mongoose";
import { addressSchema } from "./organization.js";

const factorySchema = new mongoose.Schema(
  {
    factoryName: String,
    address: { type: addressSchema, sparse: true },
    rawBlocksId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "rawInventory",
    }],
    finishedSlabsId:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "finishedInventory",
    }],
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);
const factory = mongoose.model("factory", factorySchema);

export default factory;
