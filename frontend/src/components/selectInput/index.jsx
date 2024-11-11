import React from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import "./inputStyle.css";

function SelectInput({ name, control, label, options, rules, ...rest }) {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Form.Select bsPrefix="form-control form-select" {...field} isInvalid={!!error} {...rest}>
              <option value="" disabled>
                Select a {label?.toLowerCase()}
              </option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
            {error && <Form.Control.Feedback type="invalid">{error.message}</Form.Control.Feedback>}
          </>
        )}
      />
    </Form.Group>
  );
}

export default SelectInput;
