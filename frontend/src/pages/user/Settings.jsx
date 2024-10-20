import React from "react";
import { Container } from "react-bootstrap";

import EditProfile from "components/settings/EditProfile";
import UploadImage from "components/settings/UploadImage";
import EditCategories from "components/settings/EditCategories";

import DeleteUser from "components/settings/DeleteUser";

const Settings = () => {
  return (
    <Container fluid className="d-flex flex-column py-3 gap-5 ">
      <UploadImage />
      <EditProfile />
      <EditCategories />
      <DeleteUser />
    </Container>
  );
};

export default Settings;
