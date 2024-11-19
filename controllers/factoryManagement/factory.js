import { factory, worker } from "../../models/factoryManagement/factory.js";
import Organization from "../../models/documentation/organization.js";

//Factory Controllers
export const addFactoryToOrg = async (req, res) => {
  try {
    const body = req.body;
    const { organizationId } = body;
    if (!body.organizationId || !body.factoryName) {
      res.status(400).send("Enter all the required fields");
      return;
    }
    const newFactory = await factory.create(body);
    await Organization.findByIdAndUpdate(
      organizationId,
      { $push: { factory: newFactory._id } },
      { new: true }
    );
    res.status(200).send(newFactory);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const getFactories = async (req, res) => {
  try {
    const getFactory = await factory.find({}, { __v: 0 });
    if (getFactory.length === 0) {
      res.status(404).send("No Records Found");
      return;
    }
    res.status(200).send(getFactory);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const getSingleFactory = async (req, res) => {
  try {
    const { id } = req.params;
    const getFactory = await factory.findById(id);
    if (!getFactory) {
      res.status(404).send("No Records Found");
      return;
    }
    res.status(200).send(getFactory);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const removeFactoryFrommOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const findFactory = await factory.find({ _id: id });
    if (!findFactory) {
      res.status(404).send("Factory not found");
    }
    await Organization.findOneAndUpdate(
      { factory: id },
      { $pull: { factory: id } },
      { new: true }
    );
    await factory.findByIdAndDelete(id);
    res.status(200).send("Factory removed successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const updateFactory = async (req, res) => {
  try {
    const body = req.body;
    const { id } = req.params;
    const { organizationId } = body;
    const findFactory = await factory.findById(id);
    if (!findFactory) {
      res.status(404).send("Factory not found");
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
    res.status(500).send("Internal Server Error");
  }
};

//Worker Controllers
export const addWorkerPay = async (req, res) => {
  try {
    const body = req.body;
    const addWorker = await worker.create(body);
    res.status(200).json(addWorker);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const getWorker = async (req, res) => {
  try {
    const getWorker = await worker.find();
    if (getWorker.length === 0) {
      res.status(404).send("Worker Not found");
      return;
    } else {
      res.status(200).json(getWorker);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const getSingleWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const getWorker = await worker.findById(id);
    if (!getWorker) {
      res.status(404).send("Worker Not found");
      return;
    } else {
      res.status(200).json(getWorker);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const removeWorkerPay = async (req, res) => {
  try {
    const { id } = req.params;
    const findWorker = await worker.findById(id);
    if (!findWorker) {
      res.status(404).send("Worker Not found");
      return;
    }
    await worker.findByIdAndDelete(id);
    res.status(200).send("removed Successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const updateWorkerPay = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const findWorker = await worker.findById(id);
    if (!findWorker) {
      res.status(404).send("Worker Not found");
      return;
    }
    const updateWorker = await worker.findByIdAndUpdate(id, body, {
      new: true,
    });
    res.status(200).json(updateWorker);
  } catch (err) {
    res.status(500).send('internal server error');
  }
};
