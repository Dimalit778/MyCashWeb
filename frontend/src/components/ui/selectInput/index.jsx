import React from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import "./inputStyle.css";

const SelectInput = ({ name, control, label, options = [], rules }) => {
  console.log(options);
  if (Array.isArray(options)) console.log("yes");
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Form.Group>
          <Form.Label>{label}</Form.Label>
          <Form.Select {...field} isInvalid={!!error} className="bg-dark text-light">
            <option value="">Select {label}</option>
            {Array.isArray(options) &&
              options.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
        </Form.Group>
      )}
    />
  );
};
export default SelectInput;
