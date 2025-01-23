import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import EditProfile from "components/settings/editUser";
import UploadImage from "components/settings/uploadImage";

import DeleteUser from "components/settings/deleteUser";

const Settings = () => {
  return (
    <Container fluid className="p-3 min-vh-100 d-flex flex-column">
      <Row className="g-4">
        <Col xs={12} lg={5}>
          <UploadImage />
        </Col>
        <Col xs={12} lg={7}>
          <EditProfile />
        </Col>
      </Row>
      <div className="mt-auto">
        <DeleteUser />
      </div>
    </Container>
  );
};

export default Settings;
