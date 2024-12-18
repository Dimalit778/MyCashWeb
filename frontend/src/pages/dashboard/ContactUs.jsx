import BrandLogo from "components/brandLogo";
import { INPUT_STYLE } from "constants/InputStyles";
import { THEME } from "constants/Theme";

import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    // Your email sending logic here
  };

  return (
    <Container fluid className="p-4  ">
      <Row>
        <Col md={5} className="ps-5 ">
          <h1 className="display-4 mb-4" style={{ color: THEME.orange }}>
            Contact Me
          </h1>
          <h2 className="h3 mb-4 text-secondary">Get in touch</h2>
          <p>Email: Mycash@outlook.com</p>
          <p>Phone: +972 052-6731280</p>
        </Col>
        <Col md={7} className="d-flex flex-column   ">
          <div className="p-2 border border-1 border-secondary rounded opacity-75 bg-dark">
            <BrandLogo />
            <p className="mt-4 ">
              Our support team can help you with every question you have. You can contact us and our team will response
              you within 24 hours.
            </p>
          </div>
        </Col>
      </Row>
      <Row className="mt-5 justify-content-center  ">
        <Form onSubmit={sendEmail} className="col-md-8 p-4 ">
          <Form.Group className="mb-3 ">
            <Form.Control
              type="text"
              placeholder="Name.."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={INPUT_STYLE}
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email.."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={INPUT_STYLE}
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={INPUT_STYLE}
              className="form-control"
            />
          </Form.Group>
          <Button
            variant="dark"
            type="submit"
            style={{
              border: "1px solid #444",
              borderRadius: "4px",
              padding: "10px 20px",
            }}
          >
            Send
          </Button>
        </Form>
      </Row>
    </Container>
  );
};

export default ContactUs;
