"use client";

import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styled from "styled-components";
import { InputProps } from "@/types/form/form.types";

const StyledTextField = styled(TextField)<{
  $borderColor?: string;
  $placeholderColor?: string;
  $labelColor?: string;
}>`
  & .MuiOutlinedInput-root {
    border-radius: 8px;
    transition: all 0.3s ease;
    fieldset {
      border-color: ${({ $borderColor }) => $borderColor || "#000000"};
    }
    &:hover fieldset {
      border-color: ${({ $borderColor }) => $borderColor || "#000000"};
    }
    &.Mui-focused fieldset {
      border-color: ${({ $borderColor }) => $borderColor || "#000000"};
      border-width: 2px;
    }
  }
  & .MuiInputLabel-root {
    color: ${({ $labelColor }) => $labelColor || "#000000"};
    &.Mui-focused {
      color: ${({ $labelColor }) => $labelColor || "#000000"};
    }
    &.MuiInputLabel-shrink {
      color: ${({ $labelColor }) => $labelColor || "#000000"};
    }
    &.Mui-error {
      color: #d32f2f;
    }
  }
  & .MuiInputBase-input {
    color: ${({ $labelColor }) => $labelColor || "#000000"};
    &::placeholder {
      color: ${({ $placeholderColor }) =>
        $placeholderColor || "rgba(0, 0, 0, 0.4)"};
      opacity: 1;
    }
    &:disabled {
      cursor: not-allowed;
    }
  }
`;

function Input<T extends FieldValues>({
  name,
  control,
  type = "text",
  fullWidth = true,
  variant = "outlined",
  size = "medium",
  InputProps,
  borderColor,
  placeholderColor,
  labelColor,
  ...restProps
}: InputProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordField = type === "password";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <StyledTextField
          {...field}
          {...restProps}
          type={isPasswordField && showPassword ? "text" : type}
          error={!!error}
          helperText={error?.message || restProps.helperText}
          fullWidth={fullWidth}
          variant={variant}
          size={size}
          InputProps={{
            ...InputProps,
            endAdornment: isPasswordField ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((s) => !s)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                  disabled={restProps.disabled}
                  size={size === "small" ? "small" : "medium"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : (
              InputProps?.endAdornment
            ),
          }}
          InputLabelProps={{ shrink: true }}
          $borderColor={borderColor}
          $placeholderColor={placeholderColor}
          $labelColor={labelColor}
          value={field.value ?? ""}
          onChange={(e) =>
            field.onChange(
              type === "number" && e.target.value
                ? Number(e.target.value)
                : e.target.value
            )
          }
        />
      )}
    />
  );
}

export default Input;
