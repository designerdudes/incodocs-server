import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    teamMemberName: {
      type: String,
      required: true,
      trim: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true, // Improves query performance
    },
    address: {
      location: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
    role: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    contactInformation: {
      contactPerson: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        // match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      },
      phoneNumber: {
        type: String,
        required: true,
        // match: [/^\d{10}$/, "Phone number must be 10 digits"],
      },
      alternatePhone: {
        type: String,
        // match: [/^\d{10}$/, "Alternate phone number must be 10 digits"],
      },
    },
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
