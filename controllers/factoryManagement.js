import Inventory from "../models/factoryManagement.js";
const { rawInventory, finishedInventory } = Inventory;

// Raw Inventory APIs
export const getAllRawBlocks = async (req, res) => {
  try {
    const rawBlocks = await rawInventory.find({}, { __v: 0 });
    if (rawBlocks.length === 0) {
      res.status(404).send("No Records Found");
    } else {
      res.status(200).send(rawBlocks);
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const getSingleRawBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const rawBlock = await rawInventory.findById(id);
    if (!rawBlock) {
      res.status(404).send("No Records Found");
    } else {
      res.status(200).send(rawBlock);
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const addRawBlock = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    if (!body.materialName || !body.weight) {
      res.status(400).send("enter all the required fields");
      return;
    }
    const addRawBlock = await rawInventory.create(body);
    res.status(200).send(addRawBlock);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const updateRawBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!body.materialName || !body.weight) {
      res.status(400).send("Enter all the required fields");
      return;
    }
    const updatedBlock = await rawInventory.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedBlock) {
      res.status(404).send("Block Not Found");
      return;
    }

    res.status(200).send("updated successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const removeRawBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const findBlock = await rawInventory.findById(id);
    if (!findBlock) {
      res.status(404).json({ message: "Block not found" });
      return;
    }
    await rawInventory.findByIdAndDelete(id);
    res.status(200).send("Block removed successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// Finished Inventory APIs
