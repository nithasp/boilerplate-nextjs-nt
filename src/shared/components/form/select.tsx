"use client";

import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Box,
  Checkbox,
  ListItemText,
} from "@mui/material";
import styled from "styled-components";
import { SelectProps } from "@/types/form/form.types";

const StyledFormControl = styled(FormControl)<{
  $borderColor?: string;
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
  & .MuiSelect-select {
    color: ${({ $labelColor }) => $labelColor || "#000000"};
  }
`;

function SelectComponent<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  helperText,
  fullWidth = true,
  variant = "outlined",
  size = "medium",
  multiple = false,
  options = [],
  valueKey = "id",
  displayKey = "name",
  className,
  borderColor,
  labelColor,
  SelectProps,
}: SelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const fieldValue = field.value ?? (multiple ? [] : "");

        const renderValue = (selected: unknown): React.ReactNode => {
          const isEmpty =
            !selected || (Array.isArray(selected) && selected.length === 0);

          if (isEmpty) {
            return (
              <span style={{ color: "rgba(0, 0, 0, 0.4)" }}>{placeholder}</span>
            );
          }

          if (multiple && Array.isArray(selected)) {
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const option = options.find((opt) => opt[valueKey] === value);
                  return (
                    <Chip
                      key={String(value)}
                      label={String(option?.[displayKey] ?? value)}
                      size="small"
                    />
                  );
                })}
              </Box>
            );
          }

          const selectedOption = options.find(
            (opt) => opt[valueKey] === selected
          );
          return String(selectedOption?.[displayKey] ?? selected);
        };

        return (
          <StyledFormControl
            fullWidth={fullWidth}
            variant={variant}
            size={size}
            error={!!error}
            disabled={disabled}
            className={className}
            $borderColor={borderColor}
            $labelColor={labelColor}
            required={required}
          >
            <InputLabel shrink>{label}</InputLabel>
            <Select
              {...field}
              value={fieldValue}
              onChange={(e) => field.onChange(e.target.value)}
              label={label}
              multiple={multiple}
              displayEmpty
              notched
              renderValue={renderValue}
              {...SelectProps}
            >
              {!multiple && (
                <MenuItem value="" disabled>
                  <em>{placeholder}</em>
                </MenuItem>
              )}

              {options.map((option) => {
                const optionValue = option[valueKey];
                const optionDisplay = option[displayKey];

                if (multiple) {
                  const isSelected = Array.isArray(fieldValue)
                    ? (fieldValue as unknown[]).includes(optionValue)
                    : false;

                  return (
                    <MenuItem
                      key={String(optionValue)}
                      value={optionValue as string | number}
                    >
                      <Checkbox checked={isSelected} />
                      <ListItemText primary={String(optionDisplay)} />
                    </MenuItem>
                  );
                }

                return (
                  <MenuItem
                    key={String(optionValue)}
                    value={optionValue as string | number}
                  >
                    {String(optionDisplay)}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{error?.message || helperText}</FormHelperText>
          </StyledFormControl>
        );
      }}
    />
  );
}

export default SelectComponent;
