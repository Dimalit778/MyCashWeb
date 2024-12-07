import mongoose from "mongoose";
import { SUBSCRIPTION_TYPES } from "../config/config.js";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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
