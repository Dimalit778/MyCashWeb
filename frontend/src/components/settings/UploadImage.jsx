import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Transformation } from "cloudinary-react";
import toast from "react-hot-toast";
import { setCredentials } from "config/authSlice";
import { useDeleteImageMutation, useUpdateUserMutation, useUploadImageMutation } from "api/slicesApi/userApiSlice";
import uploadUserImg from "assets/uploadUserImg.png";
import MyButton from "components/custom/MyButton";
import { Col, Container, Row } from "react-bootstrap";
import { Theme } from "constants/colors";

const UploadImage = () => {
  const [userImage, setUserImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setUserImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    if (!userInfo.imageUrl) return toast.error("No image for this user");
    try {
      await deleteImage({ imageUrl: userInfo.imageUrl });
      const res = await updateUser({ imageUrl: null }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Photo was deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete photo");
    }
  };

  const handleSubmit = async () => {
    if (!userImage) return toast.error("Please add an image");
    try {
      const res = await uploadImage({ userImage }).unwrap();
      const result = await updateUser({ imageUrl: res.public_id }).unwrap();
      dispatch(setCredentials({ ...result }));
      toast.success("Profile updated successfully");
      setImagePreview("");
      setUserImage("");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const isLoading = isUploading || isDeleting || isUpdating;

  return (
    <Container className="darkCard">
      <Row className="g-5">
        <Col md={6}>
          <div className="d-flex ms-3">
            {userInfo.imageUrl && !imagePreview ? (
              <Image cloudName="dx6oxmki4" publicId={userInfo.imageUrl} className="cloudImage">
                <Transformation width="200" height="200" gravity="auto" crop="fill" quality="auto" />
              </Image>
            ) : imagePreview ? (
              <img style={{ height: "20vh", width: "20vw" }} src={imagePreview} alt="Preview" />
            ) : (
              <img style={{ height: "100px" }} src={uploadUserImg} alt="Upload" />
            )}
            <h5 className="ms-5 mt-3">Profile Image</h5>
          </div>
        </Col>

        <Col md={6} className="d-flex align-items-center justify-content-lg-end justify-content-center ">
          <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          <label htmlFor="fileInput" className="me-4">
            <MyButton
              bgColor={Theme.secondary}
              disabled={isLoading}
              onClick={() => document.getElementById("fileInput").click()}
            >
              Upload Image
            </MyButton>
          </label>
          <MyButton type="button" bgColor={Theme.orange} disabled={isLoading} onClick={handleSubmit}>
            Save
          </MyButton>

          {userInfo?.imageUrl && (
            <div className="mt-3">
              <MyButton
                buttonText="Delete Photo"
                onClick={handleDeleteImage}
                disabled={isLoading}
                color="red"
                size="large"
              />
            </div>
          )}
        </Col>
      </Row>
      {isLoading && <div className="mt-3">Loading...</div>}
    </Container>
  );
};

export default UploadImage;
