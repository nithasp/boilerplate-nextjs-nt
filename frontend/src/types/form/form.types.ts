import { Control, FieldValues, Path } from "react-hook-form";
import { TextFieldProps, SelectProps as MuiSelectProps } from "@mui/material";

export interface InputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  size?: "small" | "medium";
  autoComplete?: string;
  autoFocus?: boolean;
  inputProps?: TextFieldProps["inputProps"];
  InputProps?: TextFieldProps["InputProps"];
  className?: string;
  borderColor?: string;
  placeholderColor?: string;
  labelColor?: string;
}

export interface SelectOption {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export interface SelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  size?: "small" | "medium";
  multiple?: boolean;
  options: SelectOption[];
  valueKey?: "id" | "name";
  displayKey?: "id" | "name";
  className?: string;
  borderColor?: string;
  labelColor?: string;
  SelectProps?: Partial<MuiSelectProps>;
}
