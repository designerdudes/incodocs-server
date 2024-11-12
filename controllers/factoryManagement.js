import Inventory from "../models/factoryManagement.js";
import factory from "../models/factory.js";
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
    const { factoryId } = body;
    console.log(body);
    if (!body.materialName || !body.weight || !body.factoryId) {
      res.status(400).send("enter all the required fields");
      return;
    }
    const addRawBlock = await rawInventory.create(body);
    await factory.findByIdAndUpdate(
      factoryId,
      { $push: { rawBlocksId: addRawBlock._id } },
      { new: true }
    );
    res.status(200).send(addRawBlock);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

export const updateRawBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const body = req.body;

    if (!body.materialName || !body.weight) {
      res.status(400).send("Enter all the required fields");
      return;
    }
    const isfactoryId = await rawInventory.find({ factoryId: factoryId });
    // console.log(isfactoryId, "fhds");
    if (!isfactoryId) {
      await factory.findByIdAndUpdate(
        factoryId,
        { $push: { rawBlocksId: id } },
        { new: true }
      );
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
    const { factoryId } = findBlock;
    await factory.findByIdAndUpdate(
      factoryId,
      { $pull: { rawBlocksId: id } },
      { new: true }
    );
    await rawInventory.findByIdAndDelete(id);
    res.status(200).send("Block removed successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

//export const removeFactoryfromRawBlock = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { factoryId } = req.body;
//     const rawBlock = await rawInventory.findById(id);
//     if (!rawBlock) {
//       res.status(404).send("Block Not Found");
//       return;
//     }
//     // const isFactory = await factory.findById(factoryId);
//     // if(isFactory.length === 0){
//     //   res.status(404).send("factory Not Found");
//     //   return;
//     // }
//     await rawInventory.findByIdAndUpdate(
//       factoryId,
//       { $pull: { factoryId: factoryId } },
//       { new: true }
//     );
//     res.status(200).send("factory removed successfully");
//   } catch (err) {
//     res.status(500).send("Internal server error");
//   }
// };

// Finished Inventory APIs
export const getAllFinishedSlabs = async (req, res) => {
  try {
    const finishedSlabs = await finishedInventory.find({}, { __v: 0 });
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
    const FinishedSlabs = await finishedInventory.findById(id);
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
    const { rawBlockId } = body;
    console.log(body);
    if (
      !body.productName ||
      !body.weight ||
      !body.quantity ||
      !body.rawBlockId
    ) {
      res.status(400).send("enter all the required fields");
      return;
    }
    const addFinishedSlab = await finishedInventory.create(body);
    await factory.findByIdAndUpdate(
      factoryId,
      { $push: { finishedSlabsId: addFinishedSlab._id } },
      { new: true }
    );
    const rawBlock = await rawInventory.findById(rawBlockId);
    // console.log(rawBlock,'hello')
    await factory.findByIdAndUpdate(
      factoryId,
      { $pull: { rawBlocksId: rawBlock._id } },
      { new: true }
    );
    res.status(200).send(addFinishedSlab);
  } catch (err) {
    // console.log(err)
    res.status(500).send("Internal server error");
  }
};

export const updateFinishedSlab = async (req, res) => {
  try {
    const { id } = req.params;
    const { factoryId } = req.body;
    const body = req.body;

    if (!body.productName || !body.weight || !body.quantity) {
      res.status(400).send("Enter all the required fields");
      return;
    }
    const isfactoryId = await rawInventory.find({ factoryId: factoryId });
    // console.log(isfactoryId, "fhds");
    if (!isfactoryId) {
      await factory.findByIdAndUpdate(
        factoryId,
        { $push: { finishedSlabsId: id } },
        { new: true }
      );
    }
    const updatedSlab = await finishedInventory.findByIdAndUpdate(id, body, {
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
    const findSlab = await finishedInventory.findById(id);
    if (!findSlab) {
      res.status(404).json({ message: "Slab not found" });
      return;
    }
    const { factoryId } = findSlab;
    await factory.findByIdAndUpdate(
      factoryId,
      { $pull: { finishedSlabsId: id } },
      { new: true }
    );
    await finishedInventory.findByIdAndDelete(id);
    res.status(200).send("Slab removed successfully");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};
