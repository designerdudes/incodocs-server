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






export const getEmployeeByOrganizationId = async (req, res) => {
  try {
    const { id } = req.params;
    const findOrg = await Organization.findById(id);
    if (!findOrg) {
      return res.status(404).json({ message: "organization not found" });
    }
    const employees = await Employee.find({ organizationId: id }).populate(
      "organizationId"
    );
    if (employees.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ error: "internal server error", message: error.message });
  }
};



export const deleteMultipleEmployees = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid or empty employee IDs" });
    }
    const findEmployee = await Employee.find({ _id: { $in: ids } });
    if (findEmployee.length === 0) {
      return res.status(404).json({ message: "No records found to delete" });
    }
    const orgIds = findEmployee.map((employee) => employee.organizationId);
    await Organization.updateMany(
      { _id: { $in: orgIds } },
      { $pull: { employee: { $in: ids } } }
    );
    const deleteResult = await Employee.deleteMany({ _id: { $in: ids } });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "No employees were deleted" });
    }

    res.status(200).json({ message: "Employees deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
