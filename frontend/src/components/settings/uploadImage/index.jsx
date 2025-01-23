import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { currentUser } from "services/reducers/userSlice";
import { useUpdateUserMutation } from "services/api/userApi";
import uploadUserImg from "assets/uploadUserImg.png";
import MyButton from "components/ui/button";
import { Col, Container, Row } from "react-bootstrap";
import { THEME } from "constants/Theme";
import CloudImage from "components/ui/cloudImage";
import LoadingOverlay from "components/LoadingLayout";

const UploadImage = () => {
  const [userImage, setUserImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const user = useSelector(currentUser);

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
      await updateUser({ profileImage: null }).unwrap();
      toast.success("Photo was deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete photo");
    }
  };

  const handleSave = async () => {
    if (!userImage) return toast.error("Please add an image");
    try {
      await updateUser({ profileImage: userImage }).unwrap();
      toast.success("Profile updated successfully");
      setImagePreview("");
      setUserImage("");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <LoadingOverlay show={isUpdating}>
      <Container fluid data-cy="upload-image" className="bg-dark border border-1 border-secondary rounded p-3">
        <Row className="gy-4">
          {/* Profile Image Column */}
          <Col xs={12} md={6}>
            <div className="d-flex flex-column align-items-center">
              {/* Image Container */}
              <div
                className="position-relative mb-3"
                style={{
                  width: "200px",
                  height: "200px",
                  maxWidth: "100%",
                  aspectRatio: "1/1",
                }}
              >
                <div className="w-100 h-100 overflow-hidden rounded" style={{ backgroundColor: THEME.dark }}>
                  {user.profileImage && !imagePreview ? (
                    <CloudImage publicId={user.profileImage} />
                  ) : imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-100 h-100 object-fit-cover" />
                  ) : (
                    <img src={uploadUserImg} alt="Upload" className="w-100 h-100 object-fit-cover" />
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-3">
                {imagePreview ? (
                  <>
                    <MyButton bgColor={THEME.orange} onClick={handleSave}>
                      Save
                    </MyButton>
                    <MyButton bgColor="red" size="sm" onClick={() => setImagePreview(null)}>
                      Cancel
                    </MyButton>
                  </>
                ) : (
                  <>
                    <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="d-none" />
                    <MyButton
                      type="button"
                      size="sm"
                      bgColor={THEME.secondary}
                      onClick={() => document.getElementById("fileInput").click()}
                    >
                      Upload
                    </MyButton>
                    {user.profileImage && (
                      <MyButton bgColor="red" size="sm" onClick={handleDeleteImage}>
                        Delete
                      </MyButton>
                    )}
                  </>
                )}
              </div>
            </div>
          </Col>

          {/* User Info Column */}
          <Col xs={12} md={6}>
            <div className="h-100 d-flex flex-column justify-content-between">
              <div className="text-center text-md-start">
                <h2 className="text-white h3 mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-light mb-3 opacity-75">{user.email}</p>
              </div>
              <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-2">
                <span className="text-light">Subscription:</span>
                <span className="badge bg-primary px-3">{user.subscription}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </LoadingOverlay>
  );
};

export default UploadImage;
