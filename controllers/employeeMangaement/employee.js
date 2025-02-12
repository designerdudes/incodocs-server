import Organization from "../../models/documentation/organization.js";
import { Employee } from "../../models/employeeMangaement/employee.js";


// Controller function for adding an employee
export const addEmployee = async (req, res) => {
  try {
    const { organizationId, employeeId } = req.body;

    const employeeIdExist = await Employee.findOne({ employeeId });
    if (employeeIdExist) {
      return res
        .status(400)
        .json({ message: "Employee ID exists, please try a unique ID" });
    }

    const newEmployee = await Employee.create(req.body);
    await Organization.findByIdAndUpdate(
      organizationId,
      { $push: { employees: newEmployee._id } },
      { new: true }
    );

    res.status(200).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function for getting a single employee
export const getOneEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// Controller function for getting all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, { __v: 0 });

    if (employees.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Controller function to update an employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (Object.keys(body).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const findEmployee = await Employee.findById(id);
    if (!findEmployee) {
      return res.status(404).json({ message: "No records found" });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

// Controller function to delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(200).json({ msg: "Employee deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
