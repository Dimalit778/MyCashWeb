import MyButton from "components/ui/button";
import TextInput from "components/ui/textInput";
import { THEME } from "constants/Theme";
import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "services/api/userApi";

import { currentUser } from "services/reducers/userSlice";

export default function EditProfile() {
  const userInfo = useSelector(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateUser] = useUpdateUserMutation();

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      firstName: userInfo?.firstName || "",
      lastName: userInfo?.lastName || "",
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (userInfo) {
      reset({
        firstName: userInfo?.firstName || "",
        lastName: userInfo?.lastName || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [userInfo, reset]);

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const changedValues = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== userInfo[key] && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
      if (Object.keys(changedValues).length === 0) return;

      await updateUser(changedValues).unwrap();
      setIsEditing(false);
      reset();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4 bg-dark border border-1 border-secondary rounded">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3 border-bottom border-secondary ">
          <Col className="mb-3 ">
            <TextInput
              name="firstName"
              control={control}
              label="First Name"
              disabled={!isEditing}
              rules={{
                required: "First Name is required",
                minLength: {
                  value: 2,
                  message: "First Name must be at least 2 characters",
                },
              }}
            />
          </Col>
          <Col className="mb-3 ">
            <TextInput
              name="lastName"
              control={control}
              label="Last Name"
              disabled={!isEditing}
              rules={{
                required: "Last Name is required",
                minLength: {
                  value: 2,
                  message: "Last Name must be at least 2 characters",
                },
              }}
            />
          </Col>
        </Row>

        {isEditing && (
          <Row className="py-3 mt-3 gap-3   border-bottom border-secondary  ">
            <Col md={6}>
              <TextInput
                name="currentPassword"
                control={control}
                label="Current Password"
                type="password"
                rules={{
                  required: {
                    value: !!newPassword,
                    message: "Current password is required ",
                  },
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />
            </Col>
            <Col md={6}>
              <TextInput
                name="newPassword"
                control={control}
                label="New Password"
                type="password"
                rules={{
                  required: {
                    value: !!currentPassword,
                    message: "New password is required ",
                  },
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />
            </Col>
          </Row>
        )}

        <div className="py-3 mx-3 ">
          {isEditing ? (
            <>
              <MyButton
                type="button"
                bgColor="red"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
              >
                Cancel
              </MyButton>
              <MyButton className="ms-3" bgColor={THEME.orange} isLoading={loading} type="submit">
                Save Changes
              </MyButton>
            </>
          ) : (
            <MyButton type="button" onClick={() => setIsEditing(true)} bgColor={THEME.orange}>
              Edit Profile
            </MyButton>
          )}
        </div>
      </Form>
    </Container>
  );
}
