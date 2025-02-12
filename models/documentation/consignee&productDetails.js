import mongoose from "mongoose";

// const tileSchema = new mongoose.Schema({
//   noOfBoxes: Number,
//   noOfPiecesPerBoxes: Number,
//   sizePerTile: {
//     length: {
//       value: { type: Number },
//       units: { type: String, enum: ["inch", "cm"] },
//     },
//     breadth: {
//       value: { type: Number },
//       units: { type: String, enum: ["inch", "cm"] },
//     },
//   },
// });

// const slabSchema = new mongoose.Schema({
//   noOfBundles: Number,
//   noOfSlabsPerBundle: Number,
//   uploadMeasurementSheetUrl: String,
//   totalSQMTRorSQFTwithAllowance: String,
//   totalSQMTRorSMFTwithoutAllowance: String,
// });

// const productDetailsSchema = new mongoose.Schema(
//   {
//     productCategory: { type: String, enum: ["Granite & marble", "Ceramic"] },
//     graniteAndMarble: { type: String, enum: ["tiles", "Slabs"] },
//     tiles: tileSchema,
//     slabs: slabSchema,
//   },
//   { timestamps: true }
// );

// const productDetails = mongoose.model("productDetails", productDetailsSchema);

const consigneeSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    TelephoneNo: Number,
    email: String,
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

const consignee = mongoose.model("consignee", consigneeSchema);

export default consignee ; //, productDetails
