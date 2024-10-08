import BrandLogo from "components/BrandLogo";

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

  const inputStyle = {
    backgroundColor: "#1e1e1e",
    color: "white",
    border: "1px solid #444",
    borderRadius: "4px",
    padding: "10px",
  };

  return (
    <Container fluid className="bg-primary text-light ">
      <Row>
        <Col md={5}>
          <h1 className="display-4 mb-5">Contact Me</h1>
          <h2 className="h3 mb-4">Get in touch</h2>
          <p>Email: Mycash@outlook.com</p>
          <p>Phone: +972 052-6731280</p>
        </Col>
        <Col md={7} className="d-flex flex-column justify-content-center ">
          <div className="p-2 border border-1 border-secondary rounded opacity-75">
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
              style={inputStyle}
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
              style={inputStyle}
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
              style={inputStyle}
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
