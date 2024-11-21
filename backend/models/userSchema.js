import mongoose from "mongoose";
import { SUBSCRIPTION_TYPES } from "../config/config.js";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [2, "First name must be at least 2 characters"],
      maxLength: [20, "First name cannot exceed 20 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minLength: [2, "Last name must be at least 2 characters"],
      maxLength: [20, "Last name cannot exceed 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxLength: [50, "Email cannot exceed 50 characters"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
    },
    profileImage: {
      type: String,
      default: null,
    },
    subscription: {
      type: String,
      enum: Object.values(SUBSCRIPTION_TYPES),
      default: SUBSCRIPTION_TYPES.FREE,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "user",
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
