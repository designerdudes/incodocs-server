import Inventory from "../models/factoryManagement.js";

export const getAllRawSlabs = async (req, res) => {
  try {
    const rawSlabs = await Inventory.find({}, { __v: 0 });
    res.status(200).send(rawSlabs);
  } catch (err) {
    res.status(500).send("internal server error");
  }
};

export const getSingleRawSlabs = async (req, res) => {
  try {
    const { id } = req.params;
    const rawSlabs = await Inventory.findById(id);
    res.status(200).send(rawSlabs);
  } catch (err) {
    res.status(500).send("internal server error");
  }
};

export const addRawSlabs = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    if (!body.materialName || !body.weight) {
      res.send(204).send("enter all the required fields");
      return;
    }
    const addinventory = await Inventory.create(body);
    res.status(200).send(addinventory);
  } catch (err) {
    res.status(500).send("internal server error");
  }
};

export const updateRawSlabs = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    await Inventory.updateOne({ _id: id }, body);
    
    res.status(200).send("updated successfully");
  } catch (err) {
    res.status(500).send("internal server error");
  }
};

export const removeRawSlabs = async (req, res) => {
  try {
    const { id } = req.params;
    const findSlab = await Inventory.findById(id);
    if (!findSlab) {
      res.status(404).json({ message: "slab not found" });
      return;
    }
    await Inventory.findByIdAndDelete(id);
    res.status(200).send("slab removed successfully");
  } catch (err) {
    res.status(500).send("internal server error");
  }
};
