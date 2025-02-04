import { factory, worker } from "../../models/factoryManagement/factory.js";
import Organization from "../../models/documentation/organization.js";

//Factory Controllers
export const addFactoryToOrg = async (req, res) => {
  try {
    const body = req.body;
    const { organizationId } = body;
    if (!body.organizationId || !body.factoryName) {
      res.status(400).json({ msg: "Enter all the required fields" });
      return;
    }
    const newFactory = new factory(body);
    newFactory.userId = req.user.id;
    await newFactory.save();
    // console.log(newFactory);
    await Organization.findByIdAndUpdate(
      organizationId,
      { $push: { factory: newFactory._id } },
      { new: true }
    );
    res.status(200).send(newFactory);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getFactories = async (req, res) => {
  try {
    const getFactory = await factory.find({}, { __v: 0 });
    if (getFactory.length === 0) {
      return res.status(404).send("No Records Found");
    }
    res.status(200).send(getFactory);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getFactoriesByUser = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.id; // Populated by the middleware

    const getFactory = await factory.find(
      { userId: userId }, // Fetch factories only for this organization
      { __v: 0 }
    );

    if (getFactory.length === 0) {
      return res.status(404).json({ msg: "No Records Found" });
    }

    res.status(200).send(getFactory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getSingleFactory = async (req, res) => {
  try {
    const { id } = req.params;
    const getFactory = await factory.findById(id);
    if (!getFactory) {
      res.status(404).json({ msg: "No Records Found" });
      return;
    }
    res.status(200).send(getFactory);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const removeFactoryFrommOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const findFactory = await factory.find({ _id: id });
    if (!findFactory) {
      res.status(404).json({ msg: "Factory not found" });
    }
    await Organization.findOneAndUpdate(
      { factory: id },
      { $pull: { factory: id } },
      { new: true }
    );
    await factory.findByIdAndDelete(id);
    res.status(200).json({ msg: "Factory removed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateFactory = async (req, res) => {
  try {
    const body = req.body;
    const { id } = req.params;
    const { organizationId } = body;
    const findFactory = await factory.findById(id);
    if (!findFactory) {
      return res.status(404).json({ msg: "Factory not found" });
    }
    const isOrgId = await factory.findById(organizationId);
    if (!isOrgId) {
      await Organization.findByIdAndUpdate(
        organizationId,
        { $push: { factory: id } },
        { new: true }
      );
    }
    const updatedFactory = await factory.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(200).send(updatedFactory);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//Worker Controllers
export const addWorkerPay = async (req, res) => {
  try {
    const body = req.body;
    const addWorker = await worker.create(body);
    res.status(200).json(addWorker);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getWorker = async (req, res) => {
  try {
    const getWorker = await worker.find();
    if (getWorker.length === 0) {
      res.status(404).json({ msg: "Worker Not found" });
      return;
    } else {
      res.status(200).json(getWorker);
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getSingleWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const getWorker = await worker.findById(id);
    if (!getWorker) {
      res.status(404).json({ msg: "Worker Not found" });
      return;
    } else {
      res.status(200).json(getWorker);
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const removeWorkerPay = async (req, res) => {
  try {
    const { id } = req.params;
    const findWorker = await worker.findById(id);
    if (!findWorker) {
      res.status(404).json({ msg: "Worker Not found" });
      return;
    }
    await worker.findByIdAndDelete(id);
    res.status(200).json({ msg: "removed Successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const updateWorkerPay = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const findWorker = await worker.findById(id);
    if (!findWorker) {
      res.status(404).json({ msg: "Worker Not found" });
      return;
    }
    const updateWorker = await worker.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(200).json(updateWorker);
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
