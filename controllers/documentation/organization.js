import Organization from "../../models/documentation/organization.js";
import User from "../../models/user.js";

// Controller function to add a new organization
export const addOrganization = async (req, res) => {
  try {
    const newOrganization = await Organization.create(req.body);

<<<<<<< HEAD
        const { owner } = req.body;
        const user = await User.findById(owner);
        
        if (!user) {
            return res.status(404).json({ message: `User with ID ${owner} not found` }); // Return 404 if user with the given ID is not found
        }
         
        user.owner.push(newOrganization._id);
        
        await user.save();
        
        newOrganization.owner = owner;
        
        await newOrganization.save();
        console.log(owner)
=======
    const { owner } = req.body;
    const user = await User.findById(owner);
>>>>>>> 332159ba7909b71e43f82ab8fd87b92cd06c0432

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${owner} not found` }); // Return 404 if user with the given ID is not found
    }
    user.ownedOrganizations.push(newOrganization._id);

    await user.save();

    newOrganization.owner = owner;

    await newOrganization.save();
    console.log(owner);

    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to update an existing organization
export const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, description, owner, members, address } = req.body;

  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      { name, description, owner, members, address },
      { new: true }
    );

    if (!updatedOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(updatedOrganization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to add members to an organization
export const addMembersToOrganization = async (req, res) => {
  const { organizationId } = req.params;
  const { members } = req.body;

  try {
    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    for (const memberId of members) {
      // Find the user by ID
      const user = await User.findById(memberId);

      if (!user) {
        return res
          .status(404)
          .json({ message: `User with ID ${memberId} not found` });
      }

      user.member.push(organizationId);
      await user.save();
      organization.members.push(memberId);
    }

    await organization.save();

    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all organizations
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().populate("owner members");
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get an organization by ID
export const getOrganizationById = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findById(id).populate(
      "owner members"
    );

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to remove members from an organization
export const removeMembersFromOrganization = async (req, res) => {
  const { organizationId } = req.params;
  const { members } = req.body;

  try {
    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    for (const memberId of members) {
      const index = organization.members.indexOf(memberId);
      if (index !== -1) {
        organization.members.splice(index, 1);

        await organization.save();

        const user = await User.findById(memberId);

        if (user) {
          const userIndex = user.member.indexOf(organizationId);
          if (userIndex !== -1) {
            user.member.splice(userIndex, 1);

            await user.save();
          }
        }
      }
    }

    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
