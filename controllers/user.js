import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Controller function to add a new user
export const addUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with hashed password
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRETKEY
    );

    // Set token as a cookie
    res.cookie("accessToken", token, { httpOnly: true });

    // Return success response with token and user details
    res.status(201).json({
      message: "User created",
      token: token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profileImg: newUser.profileImg,
        ownedOrganizations: newUser.ownedOrganizations,
        organizationMembers: newUser.organizationMembers,
        isFactoryManagementEnabled: newUser.isFactoryManagementEnabled,
        isExportDocumentationEnabled: newUser.isExportDocumentationEnabled,
        isAccountingEnabled: newUser.isAccountingEnabled,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function for user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRETKEY
    );

    // Set token as a cookie
    res.cookie("accessToken", token, { httpOnly: true });

    // Return success response with token and user details
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImg: user.profileImg,
        ownedOrganizations: user.ownedOrganizations,
        organizationMembers: user.organizationMembers,
        isFactoryManagementEnabled: user.isFactoryManagementEnabled,
        isExportDocumentationEnabled: user.isExportDocumentationEnabled,
        isAccountingEnabled: user.isAccountingEnabled,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get the current user
export const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Bearer token not provided" });
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);
    const userId = decodedToken.id;

    const user = await User.findById(userId)
      .populate("ownedOrganizations")
      .populate("organizationMembers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update an existing user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    email,
    mobileNumber,
    address,
    profileImg,
    isFactoryManagementEnabled,
    isExportDocumentationEnabled,
    isAccountingEnabled,
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        mobileNumber,
        address,
        profileImg,
        isFactoryManagementEnabled,
        isExportDocumentationEnabled,
        isAccountingEnabled,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get a user by ID and populate all fields
export const getUserByIdAndPopulateAll = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .populate({
        path: "ownedOrganizations",
        model: "Organization",
      })
      .populate({
        path: "organizationMembers",
        model: "Organization",
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
