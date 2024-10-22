import React from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";

function SelectInput({
  name,
  control,
  label,
  options,
  rules,
  className = "bg-secondary text-black border-dark",
  ...rest
}) {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Form.Select {...field} className={className} isInvalid={!!error} {...rest}>
              <option value="">Select a {label.toLowerCase()}</option>
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
