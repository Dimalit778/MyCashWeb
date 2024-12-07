import User from "../models/userSchema.js";
import Transaction from "../models/transactionSchema.js";
import Category from "../models/categorySchema.js";
import mongoose from "mongoose";
import handlePasswordUpdate from "../utils/handleUpdatePassword.js";
import handleProfileImage from "../utils/handleProfileImage.js";
const getUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { firstName, lastName, currentPassword, newPassword, profileImage } = req.body;
  const userId = req.user._id;

  try {
    // First, find and validate the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle password updates if provided
    if (await handlePasswordUpdate(user, currentPassword, newPassword)) {
      return res.status(400).json({
        error:
          "Password validation failed. Please check your current password and ensure new password is at least 6 characters.",
      });
    }

    // Handle profile image updates
    await handleProfileImage(user, profileImage);

    // Update basic user information
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    // Save updates and return response
    await user.save();

    // Remove sensitive data before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      error: "Failed to update user profile. Please try again.",
    });
  }
};
const deleteUser = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedTransactions = await Transaction.deleteMany({ user: userId }).session(session);
    const deletedCategory = await Category.deleteOne({ user: userId }).session(session);
    const deletedUser = await User.findByIdAndDelete(userId).session(session);

    if (!deletedUser) {
      throw new Error("User not found");
    }
    if (deletedUser.imageUrl) {
      await cloudinary.uploader.destroy(deletedUser.imageUrl);
    }
    await session.commitTransaction();
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "All user data has been deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error deleting user data:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user data. Please try again.",
    });
  } finally {
    await session.endSession();
  }
};

const deleteImage = async (req, res) => {
  const { imageUrl } = req.body;
  try {
    await cloudinary.uploader.destroy(imageUrl);

    res.status(200).send(" Image deleted successfully");
  } catch (error) {
    res.status(200).send({ message: error.message });
  }
};

export { updateUser, getUser, deleteUser, deleteImage };
