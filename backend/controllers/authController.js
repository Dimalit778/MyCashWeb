import User from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import Category from "../models/categorySchema.js";
import { DEFAULT_CATEGORIES } from "../config/config.js";

const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await user.save({ session });

      await Category.create(
        [
          {
            user: user._id,
            categories: DEFAULT_CATEGORIES,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      generateTokenAndSetCookie(res, user._id);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.log("error in signup ", error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { signup, login, logout, checkAuth };
