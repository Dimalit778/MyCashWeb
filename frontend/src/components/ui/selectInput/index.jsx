import React from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import "./inputStyle.css";

const SelectInput = ({ name, control, label, options, renderOption, rules }) => {
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
            {options.map((option) => {
              const { value, label } = renderOption(option);
              return (
                <option key={value} value={value} className={option.isDeleted ? "text-muted" : ""}>
                  {label}
                </option>
              );
            })}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
        </Form.Group>
      )}
    />
  );
};
export default SelectInput;
