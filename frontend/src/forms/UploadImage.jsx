import { setCredentials } from "api/slicesApi/authSlice";
import { Image, Transformation } from "cloudinary-react";
import { useDeleteImageMutation, useUpdateUserMutation, useUploadImageMutation } from "api/slicesApi/userApiSlice";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import uploadUserImg from "./../assets/uploadUserImg.png";
import Loader from "components/Loader";

const UploadImage = () => {
  const [userImage, setUserImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    transformFile(file);
  };
  // DELETE IMAGE FROM CLOUDINARY
  const handleDeleteImage = async (e) => {
    e.preventDefault();
    try {
      const { imageUrl } = userInfo;
      if (!imageUrl) return toast.error("No image for this user");

      await deleteImage({ imageUrl });

      const res = await updateUser({
        imageUrl: null,
      }).unwrap();
      if (!res) return toast.error("User update failed");

      // add to userInfo in the local storage  the imageUrl
      dispatch(setCredentials({ ...res }));

      return toast.success("Photo was deleted ");
    } catch (e) {
      return toast.error(e.message);
    }
  };

  const transformFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
    } else {
      setUserImage("");
    }
  };
  // UPLOAD IMAGE TO CLOUDINARY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userImage) return toast.error("Please add an image");
    try {
      // Upload the image file to Cloudinary database
      const res = await uploadImage({ userImage });

      //?  Update image to User Schema
      if (res) {
        // if upload successfully -> update the user with imageUrl
        const result = await updateUser({
          imageUrl: res.data.public_id,
        }).unwrap();
        // add to userInfo in the local storage  the imageUrl
        dispatch(
          setCredentials({
            ...result,
          })
        );
        toast.success("Profile updated successfully");
        setImagePreview("");
        setUserImage("");
      }
    } catch (err) {
      toast.error("Error");
      console.log("err");
    }
  };
  return (
    <form className="text-center " onSubmit={handleSubmit}>
      {/* --- IMAGE DIV  ---- */}
      <div>
        {/* ---- USER USER IMAGE ----- */}
        {userInfo.imageUrl && !imagePreview && (
          <Image cloudName="dx6oxmki4" publicId={userInfo.imageUrl} className="cloudImage">
            <Transformation width="200" height="200" gravity="auto" crop="fill" quality="auto" />
          </Image>
        )}
        {/* ---- USER HAS IMAGE OR SELECTED IMAGE ----- */}
        {imagePreview && <img style={{ height: "20vh", widows: "20vw" }} src={imagePreview} alt="imagePreview"></img>}
        {/*  SHOW AVATAR IMAGE */}
        {!imagePreview && !userInfo.imageUrl && (
          <img style={{ height: "150px" }} src={uploadUserImg} alt="uploadUserImg" />
        )}
      </div>
      {isLoading && <Loader />}
      {/* upload button */}
      <div className=" mt-3">
        <label className="me-4">
          <input
            style={{ display: "none" }}
            className=" mx-auto ps-5"
            type="file"
            accept="image/"
            onChange={handleChange}
          />
          <span className="searchImage">Add Image</span>
        </label>
        <button
          style={{
            backgroundColor: "grey",
            border: "2px solid black",
            color: "white",
            padding: "3px",
            borderRadius: "5px",
            width: "75px",
            fontStyle: "600",
          }}
          className="mx-auto"
          type="submit"
        >
          SAVE
        </button>
      </div>
      {userInfo?.imageUrl && (
        <div className="mt-3">
          <button className="deletePhotoBth" onClick={(e) => handleDeleteImage(e)}>
            Delete Photo
          </button>
        </div>
      )}
    </form>
  );
};

export default UploadImage;
