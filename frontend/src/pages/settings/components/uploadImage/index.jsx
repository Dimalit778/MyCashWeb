import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Transformation } from "cloudinary-react";
import toast from "react-hot-toast";
import { currentUser, setCredentials } from "services/store/userSlice";
import { useDeleteImageMutation, useUpdateUserMutation, useUploadImageMutation } from "api/slicesApi/userApiSlice";
import uploadUserImg from "assets/uploadUserImg.png";
import MyButton from "components/button";
import { Col, Container, Row } from "react-bootstrap";
import { THEME } from "constants/Theme";

const UploadImage = () => {
  const [userImage, setUserImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const user = useSelector(currentUser);
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
    if (!user.profileImage) return toast.error("No image for this user");
    try {
      await deleteImage({ profileImage: user.profileImage });
      const res = await updateUser({ profileImage: null }).unwrap();
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
      const result = await updateUser({ profileImage: res.public_id }).unwrap();
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
    <Container className="p-3 border border-1 border-secondary rounded bg-dark">
      <Row className="g-5">
        <Col md={6}>
          <div className="d-flex ms-3">
            {user.profileImage && !imagePreview ? (
              <Image cloudName="dx6oxmki4" publicId={user.profileImage} className="cloudImage">
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
              bgColor={THEME.secondary}
              disabled={isLoading}
              onClick={() => document.getElementById("fileInput").click()}
            >
              Upload Image
            </MyButton>
          </label>
          <MyButton type="button" bgColor={THEME.orange} disabled={isLoading} onClick={handleSubmit}>
            Save
          </MyButton>

          {user?.profileImage && (
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
