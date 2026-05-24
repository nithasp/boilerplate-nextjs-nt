"use client";

import React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";
import styled from "styled-components";
import { ButtonProps } from "@/types/ui/button.types";

const StyledButton = styled(MuiButton)<{
  $bgColor?: string;
  $textColor?: string;
}>`
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${(props) =>
    props.$bgColor &&
    `
    background-color: ${props.$bgColor} !important;

    &:hover {
      background-color: ${props.$bgColor} !important;
      filter: brightness(0.9);
    }
  `}

  ${(props) =>
    props.$textColor &&
    `
    color: ${props.$textColor} !important;
  `}

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.Mui-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }

  & .MuiCircularProgress-root {
    margin-right: 8px;
  }
`;

const SPINNER_SIZE = { small: 16, medium: 20, large: 24 } as const;

const Button: React.FC<ButtonProps> = ({
  text,
  loading = false,
  variant = "contained",
  size = "medium",
  color = "primary",
  backgroundColor,
  textColor,
  startIcon,
  endIcon,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  children,
  className,
  ...props
}) => {
  const displayStartIcon = loading ? (
    <CircularProgress size={SPINNER_SIZE[size]} color="inherit" />
  ) : (
    startIcon
  );

  return (
    <StyledButton
      variant={variant}
      size={size}
      color={color}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      startIcon={displayStartIcon}
      endIcon={!loading ? endIcon : undefined}
      className={className}
      $bgColor={backgroundColor}
      $textColor={textColor}
      {...props}
    >
      {children || text}
    </StyledButton>
  );
};

export default Button;
