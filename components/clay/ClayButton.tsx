"use client";

import React, { forwardRef } from "react";

export interface ClayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const ClayButton = forwardRef<HTMLButtonElement, ClayButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "lg",
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-bold tracking-normal select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:outline-none focus-visible:ring-3 focus-visible:ring-[#3D5F58]/40 focus-visible:ring-offset-2";

    const sizeStyle =
      size === "lg"
        ? "min-h-[54px] py-3.5 px-6 text-base sm:text-lg rounded-[22px] gap-2.5"
        : "min-h-[48px] py-3 px-5 text-sm sm:text-base rounded-[18px] gap-2";

    const widthStyle = fullWidth ? "w-full" : "w-auto";

    const variants = {
      primary:
        "bg-[#3D5F58] hover:bg-[#304D47] active:bg-[#253C37] text-white shadow-clay-btn-primary active:scale-[0.98] border border-white/20",
      secondary:
        "bg-[#FFFDF8] hover:bg-[#F1EDE3] active:bg-[#E7E2D6] text-[#24312D] shadow-clay-btn-secondary active:scale-[0.98] border border-[#E7E2D6]/80",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${base} ${sizeStyle} ${widthStyle} ${variants[variant]} ${className}`}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

ClayButton.displayName = "ClayButton";

export default ClayButton;
