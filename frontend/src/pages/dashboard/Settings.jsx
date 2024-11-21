import React from "react";
import { Container } from "react-bootstrap";

import EditProfile from "components/settings/editUser";
import UploadImage from "components/settings/uploadImage";

import DeleteUser from "components/settings/deleteUser";

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
