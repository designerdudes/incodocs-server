import factory from "../models/factory.js";
import Organization from "../models/organization.js";

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
    await Organization.findByIdAndUpdate(
      factory.organizationId,
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
    const {organizationId}= body;
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
