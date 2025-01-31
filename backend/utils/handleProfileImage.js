import cloudinary from "../cloudinary.js";
async function handleProfileImage(user, image) {
  if (!image && image !== null) {
    return;
  }

  if (image === null) {
    if (user.imageUrl) {
      const publicId = user.imageUrl;
      await cloudinary.uploader.destroy(publicId);
    }
    user.imageUrl = null;
    return;
  }

  // Upload new image
  try {
    if (user.imageUrl) {
      const publicId = user.imageUrl;
      await cloudinary.uploader.destroy(publicId);
    }

    // Upload new image
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      folder: "images",
      resource_type: "auto",
    });

    // Update user profile with new image
    user.imageUrl = uploadedResponse.public_id;
  } catch (error) {
    throw new Error("Failed to process profile image: " + error.message);
  }
}
export default handleProfileImage;
