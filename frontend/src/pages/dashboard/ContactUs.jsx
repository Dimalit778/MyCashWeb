import BrandLogo from "components/brandLogo";
import TextInput from "components/ui/textInput";

import { THEME } from "constants/Theme";

import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log("Form Data:", data);
    console.log("Form Errors:", errors);
  });

  console.log("Form Errors:", errors);
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
        <Form data-cy="contact-form" onSubmit={onSubmit} className=" col-md-8 p-4 ">
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullname"
              type="text"
              {...register("fullname")}
              className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.fullname?.message}</div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="text"
              {...register("email")}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
          {/* <div className="mb-3">
            <TextInput
              data-cy="login-email"
              name="email"
              control={control}
              type="email"
              placeholder="Email"
              className="form-control"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
            />
          </div> */}

          <Button
            data-cy="contact-submit-button"
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
