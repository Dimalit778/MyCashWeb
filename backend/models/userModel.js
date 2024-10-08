import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      max: 30,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profileImage: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
