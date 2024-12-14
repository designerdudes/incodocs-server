import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserOTP } from "../models/otp.js";
import { emailVerificationEmail } from "../config/sendMail.js";

// Controller function to add a new user
export const addUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    let OTP = Math.floor(Math.random() * 900000) + 100000;
    // Create a new UserOTP instance
    let otp = new UserOTP({
      email: email,
      otp: OTP,
      createdAt: new Date(),
      expireAt: new Date(Date.now() + 86400000),
    });
    await otp.save(); // Save the OTP to the database
    await emailVerificationEmail(email, OTP, existingUser.fullName); // sending mail for otp

    res.status(201).json({
      message: "User created and email sent successfully",
      newUser: newUser,
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
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified)
      return res.status(400).json({ message: "Email not verified" });

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRETKEY
    );

    // Set token as a cookie
    res.cookie("accessToken", token, { httpOnly: true });
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: user,
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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "no records found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

// Controller function to update an existing user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    email,
    role,
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
        role,
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
