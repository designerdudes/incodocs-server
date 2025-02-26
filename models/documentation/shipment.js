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
  containerNumber: { type: String },
  truckNumber: { type: String },
  trukDriverContactNumber: { type: Number },
  addProductDetails: productDetailsSchema,
});

const bookingDetailsSchema = new mongoose.Schema({
  review: String,
  bookingNumber: String,
  portOfLoading: String,
  destinationPort: String,
  vesselSailingDate: Date,
  vesselArrivingDate: Date,
  containers: [containersSchema],
});

const shippingLineSchema = new mongoose.Schema({
  invoiceNumber: { type: String },
  uploadInvoiceUrl: { type: String },
  date: { type: Date },
  valueWithGst: { type: Number },
  valueWithoutGst: { type: Number },
});
const transporterInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String },
  uploadInvoiceUrl: { type: String },
  date: { type: Date },
  valueWithGst: { type: Number },
  valueWithoutGst: { type: Number },
});
const forwarderInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String },
  uploadInvoiceUrl: { type: String },
  date: { type: Date },
  valueWithGst: { type: Number },
  valueWithoutGst: { type: Number },
});

const shippingDetailsSchema = new mongoose.Schema({
  review: String,
  shippingLineName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shippingline",
  },
  noOfShipmentinvoices: { type: Number },
  shippingLineInvoices: [shippingLineSchema],

  transporterName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transportername",
  },
  noOftransportinvoices: { type: Number },
  transporterInvoices: [transporterInvoiceSchema],

  forwarderName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "forwardername",
  },
  noOfForwarderinvoices: { type: Number },
  forwarderInvoices: [forwarderInvoiceSchema],
});

const shippingBillSchema = new mongoose.Schema({
  shippingBillUrl: { type: String },
  shippingBillNumber: { type: String },
  shippingBillDate: { type: Date },
  drawbackValue: { type: String },
  rodtepValue: { type: String },
});

const shippingBillDetailsSchema = new mongoose.Schema({
  review: String,
  portCode: { type: String },
  cbName: { type: String },
  cdCode: { type: String },
  ShippingBills: [shippingBillSchema],
});

const clearanceSchema = new mongoose.Schema({
  supplierName: { type: mongoose.Schema.Types.ObjectId, ref: "shipmentsupplier" },
  noOfInvoices: { type: Number },
  invoices: [
    {
      supplierGSTN: String,
      supplierInvoiceNumber: String,
      supplierInvoiceDate: Date,
      supplierInvoiceValueWithGST: String,
      supplierInvoiceValueWithOutGST: String,
      clearanceSupplierInvoiceUrl: String,
    },
  ],
});

const actualSchema = new mongoose.Schema({
  actualSupplierName: String,
  actualSupplierInvoiceValue: String,
  actualSupplierInvoiceUrl: String,
  shippingBillUrl: String,
});

const supplierDetailsSchema = new mongoose.Schema({
  review: String,
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
  review: String,
  consignee: { type: mongoose.Schema.Types.ObjectId, ref: "consignee" },
  actualBuyer: String,
  commercialInvoices: [commercialInvoiceSchema],
});

const blDetailsSchema = new mongoose.Schema({
  review: String,
  blNumber: String,
  blDate: Date,
  telexDate: Date,
  uploadBLUrl: String,
});

const otherDetailsSchema = new mongoose.Schema({
  review: String,
  certificateName: String,
  certificateNumber: String,
  date: Date,
  issuerOfCertificate: String,
  uploadCopyOfCertificate: String,
});

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: String,
    bookingDetails: bookingDetailsSchema,
    shippingDetails: shippingDetailsSchema,
    shippingBillDetails: shippingBillDetailsSchema,
    supplierDetails: supplierDetailsSchema,
    saleInvoiceDetails: saleInvoiceDetailsSchema,
    blDetails: blDetailsSchema,
    otherDetails: [otherDetailsSchema],
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

shipmentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastShipment = await this.constructor
      .findOne()
      .sort({ shipmentId: -1 })
      .select("shipmentId");

    let lastNumber = 0;

    if (lastShipment && lastShipment.shipmentId) {
      const match = lastShipment.shipmentId.match(/\d+$/); //  \d+ → Matches one or more digits (0-9).    $ → Ensures the match is at the end of the string.
      if (match) {
        lastNumber = parseInt(match[0], 10); // match returns an array thats why we are doing match[0] example: if shipmentId number was 10 so match stores ['10'] thats why we have to use parseInt
      }
    }
    this.shipmentId = `JE${lastNumber + 1}`;
  }
  next();
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
