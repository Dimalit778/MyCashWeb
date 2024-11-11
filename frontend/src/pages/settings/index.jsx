import React from "react";
import { Container } from "react-bootstrap";

import EditProfile from "pages/settings/components/editUser";
import UploadImage from "pages/settings/components/uploadImage";

import DeleteUser from "pages/settings/components/deleteUser";

const Settings = () => {
  return (
    <Container fluid className="d-flex flex-column py-3 gap-5 ">
      <UploadImage />
      <EditProfile />
      <DeleteUser />
    </Container>
  );
};

export default Settings;
