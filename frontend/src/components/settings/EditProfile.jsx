import MyButton from "components/ui/button";
import TextInput from "components/ui/textInput";

import { THEME } from "constants/Theme";
import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "services/api/userApi";

import { currentUser } from "services/reducers/userSlice";

export default function EditProfile() {
  const userInfo = useSelector(currentUser);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,

    formState: { isDirty },
  } = useForm({
    defaultValues: {
      firstName: userInfo?.firstName || "",
      lastName: userInfo?.lastName || "",
      currentPassword: "",
      newPassword: "",
    },
    mode: "all",
  });

  const [currentPassword, newPassword] = watch(["currentPassword", "newPassword"]);

  useEffect(() => {
    reset({
      firstName: userInfo?.firstName || "",
      lastName: userInfo?.lastName || "",
      currentPassword: "",
      newPassword: "",
    });
  }, [userInfo, reset, isEditing]);

  const onSubmit = async (data) => {
    try {
      await updateUser({
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const renderFormFields = () => (
    <>
      <Row className="d-flex border-bottom border-secondary">
        <Col md={6}>
          <TextInput
            data-cy="first-name-input"
            name="firstName"
            control={control}
            label="First Name"
            disabled={!isEditing}
            rules={{
              required: {
                value: true,
                message: "First Name is required",
              },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "First Name can only contain letters",
              },
            }}
          />
        </Col>
        <Col md={6}>
          <TextInput
            data-cy="last-name-input"
            name="lastName"
            type="text"
            control={control}
            label="Last Name"
            disabled={!isEditing}
            rules={{
              required: {
                value: true,
                message: "Last Name is required",
              },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "last Name can only contain letters",
              },
            }}
          />
        </Col>
      </Row>

      {isEditing && (
        <Row data-cy="edit-password-form" className="d-flex py-3 mt-3 border-bottom border-secondary">
          <Col md={6}>
            <TextInput
              data-cy="current-password-input"
              name="currentPassword"
              control={control}
              label="Current Password"
              type="password"
              rules={{
                required: {
                  value: newPassword,
                  message: "Please enter current password",
                },
              }}
            />
          </Col>
          <Col md={6}>
            <TextInput
              data-cy="new-password-input"
              name="newPassword"
              control={control}
              label="New Password"
              type="password"
              rules={{
                required: {
                  value: currentPassword,
                  message: "Please enter New password",
                },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (value) =>
                  !value ||
                  !currentPassword ||
                  value !== currentPassword ||
                  "New password must be different from current password",
              }}
            />
          </Col>
        </Row>
      )}
    </>
  );

  return (
    <Container fluid data-cy="editProfile-container" className="p-4 bg-dark border border-1 border-secondary rounded">
      <Form onSubmit={handleSubmit(onSubmit)}>
        {renderFormFields()}

        <div className="py-3 mx-3 d-flex justify-content-end gap-3">
          {isEditing ? (
            <>
              <MyButton
                data-cy="profile-cancel-btn"
                type="button"
                bgColor={THEME.dark}
                color={THEME.light}
                border={THEME.light}
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
              >
                Cancel
              </MyButton>
              <MyButton
                data-cy="profile-save-btn"
                type="submit"
                bgColor={THEME.dark}
                color={THEME.light}
                border={THEME.light}
                isLoading={isLoading}
                disabled={!isDirty || isLoading}
              >
                Save Changes
              </MyButton>
            </>
          ) : (
            <MyButton
              data-cy="profile-edit-btn"
              type="button"
              bgColor={THEME.dark}
              color={THEME.light}
              border={THEME.light}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </MyButton>
          )}
        </div>
      </Form>
    </Container>
  );
}
