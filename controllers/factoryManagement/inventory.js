import {
  blockInventory,
  slabInventory,
  lotInventory,
} from "../../models/factoryManagement/inventory.js";
import { factory } from "../../models/factoryManagement/factory.js";

// Block Inventory APIs
export const getAllBlocks = async (req, res) => {
  try {
    const Blocks = await blockInventory.find({}, { __v: 0 });
    if (Blocks.length === 0) {
      res.status(404).send("No Records Found");
    } else {
      res.status(200).send(Blocks);
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const getSingleBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const Block = await blockInventory.findById(id);
    if (!Block) {
      res.status(404).send("No Records Found");
    } else {
      res.status(200).send(Block);
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const addBlock = async (req, res) => {
  try {
    const body = req.body;
    const { lotId } = body;
    // console.log(body);
    if (!body.blockNumber || !body.lotId || !body.status) {
      res.status(400).send("Enter All The Required Fields");
      return;
    }
    const addBlock = await blockInventory.create(body);
    const findLot = await lotInventory.findByIdAndUpdate(
      lotId,
      { $push: { blocksId: addBlock._id } },
      { new: true }
    );
    if (!findLot) {
      res.status(400).send("Lot not found, please enter a valid Lot ");
      return;
    } else {
      res.status(200).send(addBlock);
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const updateBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const { lotId } = body;
    const isLotId = await blockInventory.find({ lotId: lotId });
    if (!isLotId) {
      await lotInventory.findByIdAndUpdate(
        lotId,
        { $push: { blocksId: id } },
        { new: true }
      );
    }
    const updatedBlock = await blockInventory.findByIdAndUpdate(id, body, {
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

export const removeBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const findBlock = await blockInventory.findById(id);
    if (!findBlock) {
      res.status(404).json({ message: "Block not found" });
      return;
    }
    const { lotId } = findBlock;
    const findLot = await lotInventory.findByIdAndUpdate(
      lotId,
      { $pull: { blocksId: id } },
      { new: true }
    );
    if (!findLot) {
      res.status(400).send("Lot not found, please enter a valid lot");
      return;
    }
    await blockInventory.findByIdAndDelete(id);
    res.status(200).send("Block removed successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// Finished Inventory APIs
export const getAllFinishedSlabs = async (req, res) => {
  try {
    const finishedSlabs = await slabInventory.find({}, { __v: 0 });
    if (finishedSlabs.length === 0) {
      res.status(404).send("No Records Found");
    } else {
      res.status(200).send(finishedSlabs);
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const getSingleFinishedSlab = async (req, res) => {
  try {
    const { id } = req.params;
    const FinishedSlabs = await slabInventory.findById(id);
    if (!FinishedSlabs) {
      res.status(404).send("No Records Found");
    } else {
      res.status(200).send(FinishedSlabs);
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const addFinishedSlab = async (req, res) => {
  try {
    const body = req.body;
    const { factoryId } = body;
    if (!body.BlockId || !body.factoryId || !body.status) {
      res.status(400).send("enter all the required fields");
      return;
    }
    const addFinishedSlab = await slabInventory.create(body);
    await factory.findByIdAndUpdate(
      factoryId,
      { $push: { SlabsId: addFinishedSlab._id } },
      { new: true }
    );
    res.status(200).send(addFinishedSlab);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const updateFinishedSlab = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const body = req.body;
    const isfactoryId = await slabInventory.find({ factoryId: factoryId });
    if (!isfactoryId) {
      await factory.findByIdAndUpdate(
        factoryId,
        { $push: { SlabsId: id } },
        { new: true }
      );
    }
    const updatedSlab = await slabInventory.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedSlab) {
      res.status(404).send("Slab Not Found");
      return;
    }
    res.status(200).send("updated successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const removeFinishedSlab = async (req, res) => {
  try {
    const { id } = req.params;
    const findSlab = await slabInventory.findById(id);
    if (!findSlab) {
      res.status(404).json({ message: "Slab not found" });
      return;
    }
    const { factoryId } = findSlab;
    await factory.findByIdAndUpdate(
      factoryId,
      { $pull: { SlabsId: id } },
      { new: true }
    );
    await slabInventory.findByIdAndDelete(id);
    res.status(200).send("Slab removed successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};
