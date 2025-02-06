import {
  blockInventory,
  slabInventory,
  lotInventory,
} from "../../models/factoryManagement/inventory.js";
import { factory } from "../../models/factoryManagement/factory.js";

// Block Inventory APIs
export const getAllBlocks = async (req, res) => {
  try {
    const Blocks = await blockInventory
      .find({}, { __v: 0 })
      .populate("lotId", "lotName materialType")
      .populate("SlabsId", "slabNumber");
    if (Blocks.length === 0) {
      res.status(404).json({ msg: "No Records Found" });
    } else {
      res.status(200).send(Blocks);
    }
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Internal server error", message: err.message });
  }
};

export const getSingleBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const Block = await blockInventory
      .findById(id)
      .populate("lotId", "lotName materialType")
      .populate("SlabsId");
    if (!Block) {
      res.status(404).json({ msg: "No Records Found" });
    } else {
      res.status(200).send(Block);
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const addBlock = async (req, res) => {
  try {
    const body = req.body;
    const { lotId, factoryId } = body;
    if (!body.lotId || !body.status) {
      res.status(400).json({ msg: "Enter All The Required Fields" });
      return;
    }

    // // Get the highest blockNumber from the database
    // const lastBlock = await blockInventory.findOne().sort({ blockNumber: -1 }); // it will sort the data in decending order and and takes the lars=gest blockNumber block
    // const newBlockNumber = lastBlock ? lastBlock.blockNumber + 1 : 1;

    const addBlock = await blockInventory.create(body);
    await lotInventory.findByIdAndUpdate(
      lotId,
      { $push: { blocksId: addBlock._id } },
      { new: true }
    );
    await factory.findByIdAndUpdate(
      factoryId,
      { $push: { BlocksId: addBlock._id } },
      { new: true }
    );
    res.status(200).send(addBlock);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedBlock = await blockInventory.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedBlock) {
      res.status(404).json({ msg: "Block Not Found" });
      return;
    }
    res.status(200).json({ msg: "updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Internal server error", message: err.message });
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

    const { lotId, factoryId, SlabsId } = findBlock;

    await factory.findByIdAndUpdate(
      factoryId,
      {
        $pull: {
          BlocksId: findBlock._id,
          SlabsId: { $in: SlabsId },
        },
      },
      { new: true }
    );

    await lotInventory.findByIdAndUpdate(
      lotId,
      { $pull: { blocksId: findBlock._id } },
      { new: true }
    );

    if (SlabsId && SlabsId.length > 0) {
      await slabInventory.deleteMany({ _id: { $in: SlabsId } });
    }

    await blockInventory.findByIdAndDelete(id);

    res.status(200).json({ msg: "Block removed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Finished Inventory APIs
export const getAllFinishedSlabs = async (req, res) => {
  try {
    const finishedSlabs = await slabInventory.find({}, { __v: 0 }).populate({
      path: "blockId",
      select: "lotId",
      populate: { path: "lotId", select: "materialType" },
    });
    if (finishedSlabs.length === 0) {
      res.status(404).json({ msg: "No Records Found" });
    } else {
      res.status(200).send(finishedSlabs);
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getSingleFinishedSlab = async (req, res) => {
  try {
    const { id } = req.params;
    const FinishedSlabs = await slabInventory.findById(id).populate({
      path: "blockId",
      select: "lotId",
      populate: { path: "lotId", select: "materialType" },
    });
    if (!FinishedSlabs) {
      res.status(404).json({ msg: "No Records Found" });
    } else {
      res.status(200).send(FinishedSlabs);
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const addFinishedSlab = async (req, res) => {
  try {
    const body = req.body;
    const { factoryId, blockId } = body;
    // if (!body.blockId || !body.factoryId || !body.status) {
    //   return res.status(400).json({ msg: "enter all the required fields" });
    // }
    const findBlock = await blockInventory.findById(blockId);
    const findFactory = await factory.findById(factoryId);
    // const findLot = await lotInventory.findOne({ _id: findBlock.lotId });
    if (!findBlock || !findFactory) {
      return res
        .status(404)
        .json({ msg: "factory Id or block Id is incorrect" });
    }
    if (findBlock.status !== "cut") {
      return res
        .status(400)
        .json({ msg: "cannot add slab, block is not completed" });
    }
    // if (factoryId != findLot.factoryId) {
    //   return res.status(404).json({
    //     msg: "slap factory and block factory doesn't coincide, make sure you entered valid factory Id",
    //   });
    // }
    const addFinishedSlab = await slabInventory.create({
      ...body,
      blockNumber: findBlock.blockNumber,
    });
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
    res.status(200).json(addFinishedSlab);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

export const updateFinishedSlab = async (req, res) => {
  try {
    const { id } = req.params;
    // const { factoryId } = req.body;
    const body = req.body;
    // const isfactoryId = await slabInventory.find({ factoryId: factoryId });
    // if (!isfactoryId) {
    //   await factory.findByIdAndUpdate(
    //     factoryId,
    //     { $push: { SlabsId: id } },
    //     { new: true }
    //   );
    // }
    const updatedSlab = await slabInventory.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedSlab) {
      res.status(404).json({ msg: "Slab Not Found" });
      return;
    }
    res.status(200).json({ msg: "updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
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
    const { factoryId, blockId } = findSlab;
    await factory.findByIdAndUpdate(
      factoryId,
      { $pull: { SlabsId: findSlab._id } },
      { new: true }
    );
    await blockInventory.findByIdAndUpdate(
      blockId,
      { $pull: { SlabsId: findSlab._id } },
      { new: true }
    );
    await slabInventory.findByIdAndDelete(id);
    res.status(200).json({ msg: "Slab removed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//Lot Inventory APIs
export const addLot = async (req, res) => {
  try {
    const body = req.body;
    const { factoryId } = body;
    if (!body.factoryId || !body.noOfBlocks) {
      res.status(400).json({ msg: "Enter All The Required Fields" });
      return;
    }
    const newLot = await lotInventory.create(body);
    const findFactory = await factory.findByIdAndUpdate(
      factoryId,
      { $push: { lotId: newLot._id } },
      { new: true }
    );
    if (!findFactory) {
      res.status(400).json({ msg: "Please enter a valid factory ID" });
    }
    res.status(200).json(newLot);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateLot = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const findLot = await lotInventory.findById(id);
    if (!findLot) {
      res.status(404).json({ msg: "Lot not found" });
      return;
    }
    const updateLot = await lotInventory.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(200).json(updateLot);
  } catch (error) {
    res.status(404).json({ msg: "Internal server error" });
  }
};

export const getAllLots = async (req, res) => {
  try {
    const allLot = await lotInventory
      .find()
      .populate("factoryId", "factoryName");
    if (allLot.length === 0) {
      res.status(404).json({ msg: "No Records Found" });
    } else {
      res.status(200).json(allLot);
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getLotById = async (req, res) => {
  const { id } = req.params;
  try {
    const getById = await lotInventory
      .findById(id)
      .populate("factoryId", "factoryName");
    if (!getById) {
      res.status(404).json({ msg: "No Records Found" });
    } else {
      res.status(200).json(getById);
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const removeLot = async (req, res) => {
  try {
    const { id } = req.params;
    const findLot = await lotInventory.findById(id);
    if (!findLot) {
      res.status(404).json({ msg: "Lot not found" });
      return;
    }

    const blockIds = findLot.blocksId || [];

    await factory.findOneAndUpdate(
      { lotId: findLot._id },
      { $pull: { lotId: findLot._id } }
    );

    // Pull the block IDs from the factory (if they are linked to this lot)
    await factory.updateMany(
      { BlocksId: { $in: blockIds } },
      { $pull: { BlocksId: { $in: blockIds } } }
    );

    const slabs = await blockInventory.find(
      { _id: { $in: blockIds } },
      "SlabsId"
    );
    const slabIds = slabs.flatMap((block) => block.SlabsId).filter(Boolean); // Ensure no null values

    // console.log("Slab IDs to be removed:", slabIds);

    // Pull the slab IDs from the factory (if they are linked to the blocks)
    if (slabIds.length > 0) {
      await factory.updateMany(
        { SlabsId: { $in: slabIds } },
        { $pull: { SlabsId: { $in: slabIds } } }
      );
    }

    await slabInventory.deleteMany({ blockId: { $in: blockIds } });

    await blockInventory.deleteMany({ lotId: id });

    await lotInventory.findByIdAndDelete(id);

    res.status(200).json({ msg: "Lot deleted successfully " });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// get Lot by factory id
export const getLotByFactory = async (req, res) => {
  try {
    const { id } = req.params;
    const factoryData = await factory.findOne({ _id: id }).populate("lotId");

    if (!factoryData) {
      return res.status(404).json({ msg: "Factory not found" });
    }
    const lots = factoryData.lotId;
    if (lots.length === 0) {
      res.status(404).json({ msg: "No records found" });
      return;
    }
    res.status(200).json(lots);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

// delete Lot by factory id
export const deleteLotsInFactory = async (req, res) => {
  try {
    const { id } = req.params;
    const factoryData = await factory.findOne({ _id: id });
    if (!factoryData) {
      return res.status(404).json({ msg: "Factory not found" });
    }

    const lotIds = factoryData.lotId;

    const blocks = await blockInventory.find({ lotId: { $in: lotIds } });
    const blockIds = blocks.map((block) => block._id);
    const slabIds = blocks.flatMap((block) => block.SlabsId);

    await slabInventory.deleteMany({ _id: { $in: slabIds } });

    await blockInventory.deleteMany({ lotId: { $in: lotIds } });

    await lotInventory.deleteMany({ _id: { $in: lotIds } });

    await factory.findByIdAndUpdate(
      id,
      {
        $pull: {
          lotId: { $in: lotIds },
          BlocksId: { $in: blockIds },
          SlabsId: { $in: slabIds },
        },
      },
      { new: true }
    );

    factoryData.lotId = [];
    await factoryData.save();

    res.status(200).json({ message: "lot deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get blocks by lot id
export const getBlocksByLot = async (req, res) => {
  try {
    const { id } = req.params;
    const findLot = await lotInventory.findById(id).populate("blocksId");
    if (!findLot) {
      return res.status(404).json({ msg: "Lot not found" });
    }
    const blocks = findLot.blocksId;
    if (blocks.length === 0) {
      return res.status(404).json({ msg: "No records found" });
    }
    const updatedBlocks = blocks.map((block) => ({
      ...block.toObject(),
      lotName: findLot.lotName,
      materialType: findLot.materialType,
    }));
    res.status(200).json(updatedBlocks);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteBlocksInLot = async (req, res) => {
  try {
    const { id } = req.params;
    const lotData = await lotInventory.findOne({ _id: id });

    if (!lotData) {
      return res.status(404).json({ msg: "Lots not found" });
    }

    const blocksIds = lotData.blocksId;

    const blocks = await blockInventory.find({ _id: { $in: blocksIds } });
    const slabIds = blocks.flatMap((block) => block.SlabsId);

    await factory.findOneAndUpdate(
      { lotId: lotData._id },
      { $pull: { BlocksId: { $in: blocksIds }, SlabsId: { $in: slabIds } } },
      { new: true }
    );

    await slabInventory.deleteMany({ blockId: { $in: blocksIds } });
    await blockInventory.deleteMany({ _id: { $in: blocksIds } });

    lotData.blocksId = [];
    await lotData.save();

    res.status(200).json({ message: "blocks deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
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
      return res.status(404).json({ msg: "Block not found" });
    }
    const slabs = blockData.SlabsId;
    const updatedSlabs = slabs.map((e) => ({
      ...e.toObject(),
      materialType: blockData.materialType,
    }));
    if (slabs.length === 0) {
      res.status(404).json({ msg: "No records found" });
      return;
    }
    res.status(200).json(updatedSlabs);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const deleteSlabsInBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const blockData = await blockInventory.findOne({ _id: id });
    if (!blockData) {
      return res.status(404).json({ msg: "Factory not found" });
    }

    const slabs = blockData.SlabsId;
    if (slabs.length === 0) {
      return res.status(404).json({ msg: "No records found" });
    }

    await factory.findOneAndUpdate(
      { _id: blockData.factoryId },
      { $pull: { SlabsId: { $in: slabs } } },
      { new: true }
    );

    await slabInventory.deleteMany({ _id: { $in: slabs } });

    blockData.SlabsId = [];
    await blockData.save();
    res.status(200).json({ msg: "slabs deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
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
      materialCost,
      markerCost,
      transportCost,
      markerOperatorName,
      noOfBlocks,
      blocks,
    } = req.body;

    if (!factoryId || !noOfBlocks) {
      return res
        .status(400)
        .json({ msg: "factory Id and number of blocks required" });
    }
    // creating lot here
    const addLot = new lotInventory({
      factoryId,
      lotName,
      organizationId,
      materialType,
      materialCost,
      markerCost,
      transportCost,
      markerOperatorName,
      noOfBlocks,
    });
    await addLot.save();

    // creating blocks here
    if (blocks) {
      // Fetch the highest blockNumber
      const lastBlock = await blockInventory
        .findOne()
        .sort({ blockNumber: -1 });
      let nextBlockNumber = lastBlock ? lastBlock.blockNumber + 1 : 1;

      const blocksData = blocks.map((block) => ({
        lotId: addLot._id,
        factoryId: addLot.factoryId,
        blockNumber: nextBlockNumber++,
        materialType: block.materialType,
        vehicleNumber: block.vehicleNumber,
        dimensions: block.dimensions,
        status: block.status,
        inStock: block.inStock,
      }));
      var insertedBlocks = await blockInventory.insertMany(blocksData);

      const blocksIds = insertedBlocks.map((block) => block._id);
      addLot.blocksId = blocksIds;
      var newlot = await addLot.save();
      await factory.findByIdAndUpdate(addLot.factoryId, {
        $push: { BlocksId: blocksIds },
      });
    }

    await factory.findByIdAndUpdate(factoryId, {
      $push: { lotId: addLot._id },
    });

    res.status(200).json({
      msg: "Lot and blocks added successfully!",
      newlot,
      insertedBlocks,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

// Update block and add slabs
export const updateBlockCreateSlab = async (req, res) => {
  try {
    var { id } = req.params;
    const exitstingBlock = await blockInventory.findById(id);
    const {
      lotId,
      factoryId,
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
      factoryId: factoryId ?? exitstingBlock.factoryId,
      blockNumber: blockNumber ?? exitstingBlock.blockNumber,
      materialType: materialType ?? exitstingBlock.materialType,
      dimensions: dimensions ?? exitstingBlock.dimensions,
      SlabsId: SlabsId ?? exitstingBlock.SlabsId,
      status: status ?? exitstingBlock.status,
      inStock: inStock ?? exitstingBlock.inStock,
    };
    var updateBlock = await blockInventory.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updateBlock) {
      return res.status(404).json({ msg: "Block not found" });
    }

    // adding/creating slabs
    if (updateBlock.status === "cut") {
      // const findLot = await lotInventory.findOne({ _id: exitstingBlock.lotId });
      // const findFactoryId = findLot.factoryId;

      // Fetch the highest slabkNumber
      const lastSlab = await slabInventory.findOne().sort({ slabNumber: -1 });
      let nextSlabkNumber = lastSlab ? lastSlab.slabNumber + 1 : 1;

      const addSlabs = slabs.map((slab) => ({
        blockId: id,
        factoryId: updateBlock.factoryId,
        blockNumber: updateBlock.blockNumber,
        slabNumber: nextSlabkNumber++,
        productName: slab.productName,
        dimensions: slab.dimensions,
        status: slab.status,
        inStock: slab.inStock,
      }));
      var addSlab = await slabInventory.insertMany(addSlabs);
      const getSlabsId = addSlab.map((slab) => slab._id);
      var updatedBlock = await blockInventory.findByIdAndUpdate(
        id,
        { $push: { SlabsId: { $each: getSlabsId } }, inStock: false },
        { new: true }
      );
      await factory.findByIdAndUpdate(
        updateBlock.factoryId,
        { $push: { SlabsId: { $each: getSlabsId } } },
        { new: true }
      );
    }
    res
      .status(200)
      .json({ msg: "updated successfully", updatedBlock, addedSlab: addSlab });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

// add trim data when status is polished
export const updateSlabAddTrimData = async (req, res) => {
  try {
    const { id } = req.params;
    const exitstingSlab = await slabInventory.findById(id);
    const {
      blockId,
      factoryId,
      blockNumber,
      productName,
      quantity,
      dimensions,
      status,
      inStock,
    } = req.body;
    var { trim } = req.body;
    const payload = {
      blockId: blockId ?? exitstingSlab.blockId,
      factoryId: factoryId ?? exitstingSlab.factoryId,
      blockNumber: blockNumber ?? exitstingSlab.blockNumber,
      productName: productName ?? exitstingSlab.productName,
      quantity: quantity ?? exitstingSlab.quantity,
      dimensions: dimensions ?? exitstingSlab.dimensions,
      status: status ?? exitstingSlab.status,
      inStock: inStock ?? exitstingSlab.inStock,
    };
    const updateSlab = await slabInventory.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updateSlab) {
      return res.status(404).json({ msg: "Block not found" });
    }
    if (updateSlab.status === "polished") {
      var updatedTrimInSlab = await slabInventory.findByIdAndUpdate(
        id,
        { trim },
        {
          new: true,
        }
      );
    }
    res.status(200).json(updatedTrimInSlab);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// display blocks according to their status
export const getBlocksBystatus = async (req, res) => {
  try {
    const { status } = req.body;
    const findBlock = await blockInventory.find({ status: status });
    if (findBlock.length === 0)
      return res.status(404).json({ msg: "No records found" });
    res.status(200).json(findBlock);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

// display Slabs according to their status
export const getSlabsBystatus = async (req, res) => {
  try {
    const { status } = req.body;
    const findSlab = await slabInventory.find({ status: status });
    if (findSlab.length === 0)
      return res.status(404).json({ msg: "No records found" });
    res.status(200).json(findSlab);
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

// get blocks by factoryId
export const getBlocksByFactoryId = async (req, res) => {
  try {
    const { id } = req.params;
    const findBlocks = await factory.findById(id).populate({
      path: "BlocksId",
      populate: [
        { path: "SlabsId" }, // Populate slabs
        { path: "lotId", select: "lotName materialType" }, // Populate lots
      ],
    });
    if (!findBlocks) {
      return res.status(404).json({ message: "No Records Found" });
    }
    res.status(200).json(findBlocks.BlocksId);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

// get slabss by factoryId
export const getSlabsByFactoryId = async (req, res) => {
  try {
    const { id } = req.params;
    const findFactory = await factory.findById(id).populate({
      path: "SlabsId",
      populate: {
        path: "blockId",
        select: "_id",
        populate: {
          path: "lotId",
          select: "materialType",
        },
      },
    });
    if (!findFactory) {
      return res.status(404).json({ message: "No Recors Found" });
    }
    const getSlabs = findFactory.SlabsId;
    if (getSlabs.length === 0) {
      return res.status(404).json({ msg: "No records found" });
    }
    const updatedSlabs = getSlabs.map((e) => ({
      ...e.toObject(),
      workersCuttingPay: findFactory.workersCuttingPay,
      workersPolishingPay: findFactory.workersPolishingPay,
    }));
    res.status(200).json(updatedSlabs);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

export const updateMultipleSlabs = async (req, res) => {
  try {
    const { slabNumbers, status } = req.body;
    await slabInventory.updateMany(
      { slabNumber: { $in: slabNumbers } },
      { $set: { status } },
      { new: true }
    );
    res.status(200).json({ message: "updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const updateMultipleSlabsValue = async (req, res) => {
  try {
    const { slabNumbers, dimensions } = req.body;

    await slabInventory.updateMany(
      { slabNumber: { $in: slabNumbers } }, // Filtering slabs by slabNumbers array
      { $set: { dimensions } } // Updating length, height, and status
    );

    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const deleteMultipleLots = async (req, res) => {
  try {
    const { ids } = req.body;
    const findlots = await lotInventory.find({ _id: ids }).populate("blocksId");
    if (findlots.length === 0) {
      return res.status(404).json({ message: "no lots found" });
    }
    const blockIds = findlots.flatMap((lot) =>
      lot.blocksId.map((block) => block._id)
    );
    const slabIds = findlots.flatMap((lot) =>
      lot.blocksId.map((block) => block.SlabsId || [])
    );
    const finalslabid = slabIds.flat();

    // console.log(ids, "lotid");
    // console.log(blockIds, "blocks id");
    // console.log(finalslabid, "slabids");

    await factory.updateMany(
      { lotId: { $in: ids } }, // Match factories that have these lotIds
      {
        $pull: {
          lotId: { $in: ids },
          BlocksId: { $in: blockIds },
          SlabsId: { $in: finalslabid },
        },
      } // Remove the lotId from the factory
    );

    await slabInventory.deleteMany({ _id: { $in: finalslabid } });
    await blockInventory.deleteMany({ _id: { $in: blockIds } });
    const deleteLot = await lotInventory.deleteMany({ _id: { $in: ids } });

    if (!deleteLot) {
      return res.status(404).json({ message: "no lots found" });
    }

    res
      .status(200)
      .json({ message: "Lots, blocks, and slabs deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

export const deleteMultipleBlocks = async (req, res) => {
  try {
    const { ids } = req.body;
    const findBlocks = await blockInventory.find({ _id: ids });
    if (!findBlocks.length) {
      return res.status(404).json({ message: "No blocks found" });
    }

    // Extract SlabsId from blocks
    const slabIds = findBlocks
      .flatMap((block) => block.SlabsId)
      .map((slab) => slab._id);

    const lotIds = findBlocks.map((block) => block.lotId);
    const factoryIds = findBlocks.map((block) => block.factoryId);

    await lotInventory.updateMany(
      { _id: { $in: lotIds } },
      { $pull: { blocksId: { $in: ids } } }
    );

    await factory.updateMany(
      { _id: { $in: factoryIds } },
      {
        $pull: {
          BlocksId: { $in: ids },
          SlabsId: { $in: slabIds }, // Also pull slabs from factory
        },
      }
    );

    if (slabIds.length > 0) {
      await slabInventory.deleteMany({ _id: { $in: slabIds } });
    }

    await blockInventory.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

export const deleteMultipleSlabs = async (req, res) => {
  try {
    const { ids } = req.body;

    const findSlabs = await slabInventory.find({ _id: { $in: ids } });

    if (findSlabs.length === 0) {
      return res.status(404).json({ message: "No slabs found" });
    }

    const blockIds = findSlabs.map((slab) => slab.blockId);
    const factoryIds = findSlabs.map((slab) => slab.factoryId);

    await blockInventory.updateMany(
      { _id: { $in: blockIds } },
      { $pull: { SlabsId: { $in: ids } } }
    );

    await factory.updateMany(
      { _id: { $in: factoryIds } },
      { $pull: { SlabsId: { $in: ids } } }
    );

    const deleteSlabs = await slabInventory.deleteMany({ _id: { $in: ids } });
    if (!deleteSlabs) {
      return res.status(200).json({ message: "slabs not found" });
    }
    res.status(200).json({ message: "slabs deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};
