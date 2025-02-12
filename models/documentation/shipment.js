import mongoose from "mongoose";

const productDetailsSchema = new mongoose.Schema({
  productCategory: { type: String, enum: ["Granite & marble", "Ceramic"] },
  graniteAndMarble: { type: String, enum: ["tiles", "Slabs"] },
  tiles: {
    noOfBoxes: Number,
    noOfPiecesPerBoxes: Number,
    sizePerTile: {
      length: {
        value: { type: Number },
        units: { type: String, enum: ["inch", "cm"] },
      },
      breadth: {
        value: { type: Number },
        units: { type: String, enum: ["inch", "cm"] },
      },
    },
  },
  slabs: {
    noOfBundles: Number,
    noOfSlabsPerBundle: Number,
    uploadMeasurementSheetUrl: String,
    totalSQMTRorSQFTwithAllowance: String,
    totalSQMTRorSMFTwithoutAllowance: String,
  },
});

const containersSchema = new mongoose.Schema({
  containerNumber: { type: Number },
  truckNumber: { type: String },
  trukDriverContactNumber: { type: Number },
  addProductDetails: productDetailsSchema,
});

const bookingDetailsSchema = new mongoose.Schema({
  bookingNumber: String,
  portOfLoading: String,
  destinationPort: String,
  vesselSailingDate: Date,
  vesselArrivingDate: Date,
  containers: [containersSchema],
});

const shippingDetailsSchema = new mongoose.Schema({
  shippingLine: String,
  forwarderName: String,
  forwarderInvoice: String,
  valueOfForwarderInvoice: String,
  transporter: String,
  transporterInvoice: String,
  valueOfTransporterInvoice: String,
});

const shippingBillSchema = new mongoose.Schema({
  shippingBillUrl: { type: String },
  shippingBillNumber: { type: String },
  shippingBillDate: { type: Date },
  drawbackValue: { type: String },
  roadtepValue: { type: String },
});

const shippingBillDetailsSchema = new mongoose.Schema({
  portCode: { type: String },
  cbName: { type: String },
  cdCode: { type: String },
  ShippingBills: [shippingBillSchema],
});

const clearanceSchema = new mongoose.Schema({
  supplierName: String,
  supplierGSTN: String,
  supplierInvoiceNumber: String,
  supplierInvoiceDate: Date,
  supplierInvoiceValueWithGST: String,
  supplierInvoiceValueWithOutGST: String,
  clearanceSupplierInvoiceUrl: String,
});

const actualSchema = new mongoose.Schema({
  actualSupplierName: String,
  actualSupplierInvoiceValue: String,
  actualSupplierInvoiceUrl: String,
  shippingBillUrl: String,
});

const supplierDetailsSchema = new mongoose.Schema({
  clearance: clearanceSchema,
  actual: actualSchema,
});

const commercialInvoiceSchema = new mongoose.Schema({
  commercialInvoiceNumber: String,
  clearanceCommercialInvoiceUrl: String,
  actualCommercialInvoiceUrl: String,
  saberInvoiceUrl: String,
});

const saleInvoiceDetailsSchema = new mongoose.Schema({
  consignee: { type: mongoose.Schema.Types.ObjectId, ref: "consignee" },
  actualBuyer: String,
  commercialInvoices: commercialInvoiceSchema,
});

const blDetailsSchema = new mongoose.Schema({
  blNumber: String,
  blDate: Date,
  telexDate: Date,
  uploadBLUrl: String,
});

const certificateOfOriginSchema = new mongoose.Schema({
  certificateOfOriginNumber: String,
  date: Date,
  issuerOfCOO: String,
  uploadCopyOfFumigationCertificate: String,
});

const shipmentSchema = new mongoose.Schema(
  {
    bookingDetails: bookingDetailsSchema,
    shippingDetails: shippingDetailsSchema,
    shippingBillDetails: shippingBillDetailsSchema,
    supplierDetails: supplierDetailsSchema,
    saleInvoiceDetails: saleInvoiceDetailsSchema,
    blDetails: blDetailsSchema,
    certificateOfOriginDetails: certificateOfOriginSchema,
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
