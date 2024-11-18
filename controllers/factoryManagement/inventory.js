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
    res.status(500).send(err);
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
    await lotInventory.findByIdAndUpdate(
      lotId,
      { $pull: { blocksId: id } },
      { new: true }
    );
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
    const { factoryId, blockId } = body;
    if (!body.blockId || !body.factoryId || !body.status) {
      res.status(400).send("enter all the required fields");
      return;
    }
    const findBlock = await blockInventory.findById(blockId);
    const findFactory = await factory.findById(factoryId);
    const findLot = await lotInventory.findById(findBlock.lotId);
    if (!findBlock || !findFactory) {
      res.status(404).send("factory Id or block Id is incorrect");
      return;
    }
    if (findBlock.status !== "cut") {
      res.status(400).send("cannot add slab, block is not completed");
      return;
    }
    if (factoryId !== findLot.factoryId) {
      res
        .status(404)
        .send(
          "slap factory and block factory doesn't coincide, make sure you entered valid factory Id"
        );
      return;
    }
    const addFinishedSlab = await slabInventory.create(body);
    await factory.findByIdAndUpdate(
      factoryId,
      { $push: { SlabsId: addFinishedSlab._id } },
      { new: true }
    );
    await blockInventory.findByIdAndUpdate(
      blockId,
      { inStock: false, $push: { SlabsId: addFinishedSlab._id } },
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
    const findLot = await lotInventory.findById(id);
    if (!findLot) {
      res.status(404).send({ message: "Lot not found" });
      return;
    }
    const findFactoryId = await lotInventory.find({ factoryId: factoryId });
    console.log(findFactoryId);
    if (findFactoryId.length === 0) {
      const findFactory = await factory.findByIdAndUpdate(
        factoryId,
        { $push: { lotId: id } },
        { new: true }
      );
      if (!findFactory) {
        res.status(400).send("Please enter a valid factory ID");
        return;
      }
    }
    const updateLot = await lotInventory.findByIdAndUpdate(id, body, {
      new: true,
    });
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
    const findLot = await lotInventory.findById(id);
    if (!findLot) {
      res.status(404).send("Lot not found");
      return;
    }
    await lotInventory.findByIdAndDelete(id);
    await blockInventory.deleteMany({ lotId: id });
    await factory.findOneAndUpdate(
      { lotId: findLot._id },
      { $pull: { lotId: id } },
      { new: true }
    );
    res.status(200).json({ message: "Lot deleted successfully " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get Lot by factory id
export const getLotByFactory = async (req, res) => {
  try {
    const { id } = req.params;
    const factoryData = await factory.findOne({ _id: id }).populate("lotId");

    if (!factoryData) {
      return res.status(404).send("Factory not found");
    }
    const lots = factoryData.lotId;
    if (lots.length === 0) {
      res.status(404).send("No records found");
      return;
    }
    res.status(200).send(lots);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const deleteLotsInFactory = async (req, res) => {
  try {
    const { id } = req.params;
    const factoryData = await factory.findOne({ _id: id });
    if (!factoryData) {
      return res.status(404).send("Factory not found");
    }

    const lotIds = factoryData.lotId;

    await lotInventory.deleteMany({ _id: { $in: lotIds } });

    factoryData.lotId = [];
    await factoryData.save();
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// get blocks by lot id
export const getBlocksByLot = async (req, res) => {
  try {
    const { id } = req.params;
    const findLot = await lotInventory
      .findOne({ _id: id })
      .populate("blocksId");
    if (!findLot) {
      return res.status(404).send("Lot not found");
    }
    const blocks = findLot.blocksId;
    if (blocks.length === 0) {
      return res.status(404).send("No records found");
    }
    res.status(200).send(blocks);
  } catch (err) {
    res.status(500).send("Innternal Server Error");
  }
};

export const deleteBlocksInLot = async (req, res) => {
  try {
    const { id } = req.params;
    const lotData = await lotInventory.findOne({ _id: id });
    if (!lotData) {
      return res.status(404).send("Lots not found");
    }

    const blocksIds = lotData.blocksId;

    await blockInventory.deleteMany({ _id: { $in: blocksIds } });

    lotData.blocksId = [];
    await lotData.save();
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// get slabs by block id
export const getSlabsByBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const blockData = await blockInventory
      .findOne({ _id: id })
      .populate("SlabsId");

    if (!blockData) {
      return res.status(404).send("Block not found");
    }
    const slabs = blockData.SlabsId;
    if (slabs.length === 0) {
      res.status(404).send("No records found");
      return;
    }
    res.status(200).send(slabs);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const deleteSlabsInBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const blockData = await blockInventory.findOne({ _id: id });
    if (!blockData) {
      return res.status(404).send("Factory not found");
    }

    const slabs = blockData.SlabsId;

    await slabInventory.deleteMany({ _id: { $in: slabs } });

    blockData.SlabsId = [];
    await blockData.save();
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

// Add Lot with Blocks inventory
export const addLotAndBlocks = async (req, res) => {
  try {
    const {
      lotName,
      factoryId,
      organizationId,
      materialType,
      noOfBlocks,
      blocks,
    } = req.body;

    if (!factoryId || noOfBlocks) {
      return res.status(400).send("factory Id and number of blocks required");
    }
    // creating lot here
    const addLot = new lotInventory({
      factoryId,
      lotName,
      organizationId,
      materialType,
      noOfBlocks,
    });
    await addLot.save();

    // creating blocks here
    if (blocks) {
      const blocksData = blocks.map((block) => ({
        lotId: addLot._id,
        blockNumber: block.blockNumber,
        materialType: block.materialType,
        dimensions: block.dimensions,
        SlabsId: block.SlabsId,
        status: block.status,
        inStock: block.inStock,
      }));
      const insertedBlocks = await blockInventory.insertMany(blocksData);

      const blocksIds = insertedBlocks.map((block) => block._id);
      addLot.blocksId = blocksIds;
      await addLot.save();
    }

    await factory.findByIdAndUpdate(factoryId, {
      $push: { lotId: addLot._id },
    });

    res.status(201).json({ message: "Lot and blocks added successfully!" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

// Update block and add slabs
export const updateBlockCreateSlab = async (req, res) => {
  try {
    const { id } = req.params;
    const exitstingBlock = await blockInventory.findById(id);
    const {
      lotId,
      blockNumber,
      materialType,
      dimensions,
      SlabsId,
      status,
      inStock,
      slabs,
    } = req.body;
    const payload = {
      lotId: lotId ?? exitstingBlock.lotId,
      blockNumber: blockNumber ?? exitstingBlock.blockNumber,
      materialType: materialType ?? exitstingBlock.materialType,
      dimensions: dimensions ?? exitstingBlock.dimensions,
      SlabsId: SlabsId ?? exitstingBlock.SlabsId,
      status: status ?? exitstingBlock.status,
      inStock: inStock ?? exitstingBlock.inStock,
    };
    const updateBlock = await blockInventory.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updateBlock) {
      return res.status(404).send("Block not found");
    }

    // adding/creating slabs
    if (status === "cut") {
      const findLot = await lotInventory.findOne({ _id: exitstingBlock.lotId });
      const findFactoryId = findLot.factoryId;
      const addSlabs = slabs.map((slab) => ({
        blockId: id,
        factoryId: findFactoryId,
        blockNumber: slab.blockNumber,
        productName: slab.productName,
        quantity: slab.quantity,
        dimensions: slab.dimensions,
        status: slab.status,
        inStock: slab.inStock,
      }));
      const addSlab = await slabInventory.insertMany(addSlabs);
      const getSlabsId = addSlab.map((slab) => slab._id);
      await blockInventory.findByIdAndUpdate(
        id,
        { $push: { SlabsId: getSlabsId } },
        { new: true }
      );
      await factory.findByIdAndUpdate(
        findFactoryId,
        { $push: { SlabsId: getSlabsId } },
        { new: true }
      );
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

// add trim data when status is trimmed
export const updateSlabAddTrimData = async (req, res) => {
  try {
    const { id } = req.params;
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
