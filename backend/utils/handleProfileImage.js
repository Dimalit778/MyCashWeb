import cloudinary from "../cloudinary.js";
async function handleProfileImage(user, profileImage) {
  if (!profileImage && profileImage !== null) {
    return;
  }

  if (profileImage === null) {
    if (user.profileImage) {
      const publicId = user.profileImage;
      await cloudinary.uploader.destroy(publicId);
    }
    user.profileImage = null;
    return;
  }

  // Upload new image
  try {
    if (user.profileImage) {
      const publicId = user.profileImage;
      await cloudinary.uploader.destroy(publicId);
    }

    // Upload new image
    const uploadedResponse = await cloudinary.uploader.upload(profileImage, {
      folder: "images",
      resource_type: "auto",
    });

    // Update user profile with new image
    user.profileImage = uploadedResponse.public_id;
  } catch (error) {
    throw new Error("Failed to process profile image: " + error.message);
  }
}
export default handleProfileImage;
