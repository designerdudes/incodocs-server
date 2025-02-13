import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
  location: String,
  coordinates: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  pincode: {
    type: String,
  },
});

addressSchema.index({ coordinates: "2dsphere" });

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true, // Ensures uniqueness of the name field
      required: true,
    },
    description: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    address: {
      type: addressSchema,
      sparse: true,
    },
    shipments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shipment",
      },
    ],
    factory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "factory",
      },
    ],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
