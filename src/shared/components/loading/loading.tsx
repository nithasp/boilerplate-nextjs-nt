"use client";

import React from "react";
import {
  LoadingVariant,
  LoadingSize,
  LoadingProps,
} from "@/types/ui/loading.types";

export type { LoadingVariant, LoadingSize, LoadingProps };

const SIZE_MAP: Record<
  LoadingSize,
  { box: string; dot: string; bar: string; text: string; border: string }
> = {
  xs: { box: "h-4 w-4", dot: "h-1.5 w-1.5", bar: "h-3 w-1", text: "text-xs", border: "border-2" },
  sm: { box: "h-6 w-6", dot: "h-2 w-2", bar: "h-4 w-1", text: "text-sm", border: "border-2" },
  md: { box: "h-10 w-10", dot: "h-2.5 w-2.5", bar: "h-6 w-1.5", text: "text-sm", border: "border-[3px]" },
  lg: { box: "h-14 w-14", dot: "h-3 w-3", bar: "h-8 w-2", text: "text-base", border: "border-4" },
  xl: { box: "h-20 w-20", dot: "h-4 w-4", bar: "h-12 w-2.5", text: "text-lg", border: "border-4" },
};

const Loading: React.FC<LoadingProps> = ({
  variant = "spinner",
  size = "md",
  label,
  colorClassName = "text-blue-600 dark:text-blue-400",
  fullScreen = false,
  overlay = false,
  inline = false,
  className = "",
}) => {
  const dims = SIZE_MAP[size];
  const ariaLabel = label ?? "Loading";

  const indicator = (() => {
    switch (variant) {
      case "dots":
        return (
          <div
            className={`flex items-center gap-1.5 ${colorClassName}`}
            role="status"
            aria-label={ariaLabel}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`${dims.dot} rounded-full bg-current animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );

      case "bars":
        return (
          <div
            className={`flex items-end gap-1 ${colorClassName}`}
            role="status"
            aria-label={ariaLabel}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`${dims.bar} bg-current rounded-sm animate-pulse`}
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <span
            className={`block ${dims.box} rounded-full bg-current opacity-75 animate-ping ${colorClassName}`}
            role="status"
            aria-label={ariaLabel}
          />
        );

      case "spinner":
      default:
        return (
          <span
            className={`inline-block ${dims.box} ${dims.border} border-current border-t-transparent rounded-full animate-spin ${colorClassName}`}
            role="status"
            aria-label={ariaLabel}
          />
        );
    }
  })();

  if (inline) {
    if (!label) return indicator;
    return (
      <span
        className={`inline-flex items-center gap-2 ${colorClassName} ${className}`}
      >
        {indicator}
        <span className={dims.text}>{label}</span>
      </span>
    );
  }

  const renderInner = (labelClass: string) => (
    <div className="flex flex-col items-center justify-center gap-3">
      {indicator}
      {label && (
        <p className={`${dims.text} font-medium ${labelClass}`}>{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 ${className}`}
        aria-live="polite"
        aria-busy="true"
      >
        {renderInner("text-gray-100")}
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-[2px] rounded-[inherit] ${className}`}
        aria-live="polite"
        aria-busy="true"
      >
        {renderInner("text-gray-600 dark:text-gray-300")}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center w-full py-10 ${className}`}
      aria-live="polite"
      aria-busy="true"
    >
      {renderInner("text-gray-600 dark:text-gray-300")}
    </div>
  );
};

export default Loading;
