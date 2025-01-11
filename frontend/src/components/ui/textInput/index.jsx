import React from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";

function TextInput({
  name,
  control,
  label,
  type = "text",
  placeholder,
  rules,
  className = "bg-secondary text-black border-dark",
  endAdornment,
  ...rest
}) {
  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      <div className="position-relative">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <>
              <Form.Control
                {...field}
                type={type}
                placeholder={placeholder}
                className={`${className} ${error ? "is-invalid" : ""}`}
                {...rest}
              />
              {endAdornment && (
                <div className="position-absolute" style={{ right: 10, top: 5 }}>
                  {endAdornment}
                </div>
              )}
              {error && (
                <Form.Control.Feedback type="invalid" tooltip data-test="error-message">
                  {error.message}
                </Form.Control.Feedback>
              )}
            </>
          )}
        />
      </div>
    </Form.Group>
  );
}

export default TextInput;
