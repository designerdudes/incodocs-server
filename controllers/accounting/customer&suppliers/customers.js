import { customer } from "../../../models/accounting/supplier&customer.js";

export const getallcustomers = async (req, res) => {
    try {
        const customers = await customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

export const createcustomer = async (req, res) => {
    const { customerName, gstNo, mobileNumber} = req.body;

    if (!customerName || !gstNo || !mobileNumber) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newcustomer = new customer({ customerName, gstNo, mobileNumber });
   
    try {
        await newcustomer.save();
        res.status(201).json(newcustomer);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
}


export const getCustomerById = async (req, res) => {
    try {
    const { id } = req.params;
    console.log(id);
        const customerData = await customer.findById(id);
        if (!customerData) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }
        res.status(200).json(customerData);
    } catch (error) {
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
}