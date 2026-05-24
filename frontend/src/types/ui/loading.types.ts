export type LoadingVariant = "spinner" | "dots" | "bars" | "pulse";
export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  label?: string;
  colorClassName?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  inline?: boolean;
  className?: string;
}
