import mongoose from "mongoose";

const bookingDetailsSchema = new mongoose.Schema({
  containerNumber: [String],
  portOfLoading: String,
  destinationPort: String,
  vesselSailingDate: Date,
  vesselArrivingDate: Date,
  truckNumber: String,
  truckDriverNumber: String,
});


const shippingDetailsSchema = new mongoose.Schema({
  shippingLine: String,
  forwarder: String,
  forwarderInvoice: String,
  valueOfForwarderInvoice: String,
  transporter: String,
  transporterInvoice: String,
  valueOfTransporterInvoice: String,
});

const shippingBillDetailsSchema = new mongoose.Schema({
  shippingBillNumber: String,
  shippingBillDate: Date,
  uploadShippingBill: String,
  cbName: String,
});

const supplierDetailsSchema = new mongoose.Schema({
  supplierName: String,
  actualSupplierName: String,
  supplierGSTIN: String,
  supplierInvoiceNumber: String,
  supplierInvoiceDate: Date,
  supplierInvoiceValueWithOutGST: String,
  supplierInvoiceValueWithGST: String,
  uploadSupplierInvoice: String,
  actualSupplierInvoice: String,
  actualSupplierInvoiceValue: String,
});

const saleInvoiceDetailsSchema = new mongoose.Schema({
  commercialInvoiceNumber: String,
  commercialInvoiceDate: Date,
  consigneeDetails: String,
  actualBuyer: String,
});

const blDetailsSchema = new mongoose.Schema({
  blNumber: String,
  blDate: Date,
  telexDate: Date,
  uploadBL: String,
});

const shipmentSchema = new mongoose.Schema(
  {
    bookingDetails: bookingDetailsSchema,
    shippingDetails: shippingDetailsSchema,
    shippingBillDetails: shippingBillDetailsSchema,
    supplierDetails: supplierDetailsSchema,
    saleInvoiceDetails: saleInvoiceDetailsSchema,
    blDetails: blDetailsSchema,
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
