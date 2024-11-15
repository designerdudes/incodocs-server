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

//Lot Inventory APIs
export const addLot = async (req, res) => {
  try {
    const body = req.body;
    const { factoryId } = body;
    if (!body.factoryId || !body.noOfBlocks) {
      res.status(400).send("Enter All The Required Fields");
      return;
    }
    const newLot = await lotInventory.create(body);
    const findFactory = await factory.findByIdAndUpdate(
      factoryId,
      { $push: { lotId: newLot._id } },
      { new: true }
    );
    if (!findFactory) {
      res.status(400).send("Please enter a valid factory ID");
    }
    res.status(200).json(newLot);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const updateLot = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { factoryId } = body;
  try {
    const updateLot = await lotInventory.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updateLot) {
      res.status(404).send({ message: "Lot not found" });
      return;
    }
    const findFactoryId = await lotInventory.find({ factoryId: factoryId });
    if (findFactoryId.length === 0) {
      const findFactory = await factory.findByIdAndUpdate(
        factoryId,
        { $push: { lotId: id } },
        { new: true }
      );
      if (!findFactory) {
        res.status(400).send("Please enter a valid factory ID");
      }
      await factory.findOneAndUpdate(
        { lotId: id },
        { $pull: { lotId: id } },
        { new: true }
      );
    }
    res.status(200).json(updateLot);
  } catch (error) {
    res.status(404).send("Internal server error");
  }
};

export const getAllLots = async (req, res) => {
  try {
    const allLot = await lotInventory.find();
    if (allLot.length === 0) {
      res.status(404).send("No Records Found");
    } else {
      res.status(200).json(allLot);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const getLotById = async (req, res) => {
  const { id } = req.params;
  try {
    const getById = await lotInventory.findById(id);
    if (!getById) {
      res.status(404).json({ message: "No Records Found" });
    } else {
      res.status(200).json(getById);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const removeLot = async (req, res) => {
  const { id } = req.params;
  try {
    const findLot = await findById(id)
    if (!findLot) {
      res.status(404).json({ message: "Lot not found" });
    }
    await lotInventory.findByIdAndDelete(id);
    await factory.findByIdAndUpdate(
      findLot._id,
      { $pull: { lotId: id } },
      { new: true }
    );
    res.status(200).json({ message: "Lot deleted successfully " });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
