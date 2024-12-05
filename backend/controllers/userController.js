import cloudinary from "../cloudinary.js";
import User from "../models/userSchema.js";

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
  const { firstName, lastName, currentPassword, newPassword, profileImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
      return res.status(400).json({ error: "Please provide both current password and new password" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.profileImg = profileImg || user.profileImg;

    user = await user.save();

    user.password = null;

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.user._id;
  if (!userId) return res.status(404).json({ message: "User not found" });
  try {
    const deleteIncomes = await Income.deleteMany({ user: userId });
    const deleteExpenses = await Expense.deleteMany({ user: userId });
    const deleteUser = await User.findByIdAndDelete(userId);
    if (deleteUser.imageUrl) await cloudinary.uploader.destroy(deleteUser.imageUrl);

    if (deleteExpenses && deleteIncomes && deleteUser) {
      res.clearCookie("token");
      return res.status(200).json("All user data has been deleted");
    }
  } catch (err) {
    return res.status(200).json({ message: err.message });
  }
};

const uploadImage = async (req, res) => {
  const { userImage } = req.body;

  try {
    const result = await cloudinary.uploader.upload(userImage, {
      folder: "images",
      resource_type: "auto",
    });

    return res.status(200).send(result);
  } catch (error) {
    res.status(200).send({ message: error.message });
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

export { updateUser, getUser, deleteUser, uploadImage, deleteImage };
