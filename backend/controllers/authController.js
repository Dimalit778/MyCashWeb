import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Category from "../models/categorySchema.js";
import { DEFAULT_CATEGORIES } from "../config/config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateTokenAndSetCookie = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate token");
  }
};
const signup = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    throw new ApiError(400, "All fields are required");
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new ApiError(400, "User already exists");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
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

    return res.status(201).json(
      new ApiResponse(
        200,
        {
          user: {
            ...user._doc,
          },
        },
        "User created successfully"
      )
    );
  } catch (error) {
    await session.abortTransaction();
    throw new ApiError(500, "Failed to create user", error.stack);
  } finally {
    session.endSession();
  }
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token").clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateTokenAndSetCookie(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("token", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export { signup, login, logout };
