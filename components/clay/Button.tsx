"use client";

import React, { forwardRef } from "react";
import { FiLoader } from "react-icons/fi";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "ghost"
  | "sage"
  | "sky";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isFloating?: boolean;
  isIconOnly?: boolean;
  isPill?: boolean;
}

export const ClayButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      isFloating = false,
      isIconOnly = false,
      isPill = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: soft 3D molded clay feel, tactile transition
    const baseStyles =
      "inline-flex items-center justify-center font-medium select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-primary/40 focus-visible:ring-offset-2";

    // Shape
    const shapeStyles = isPill
      ? "rounded-clay-pill"
      : isIconOnly
      ? "rounded-clay-lg"
      : "rounded-clay-md";

    // Size styles
    const sizeStyles = {
      sm: isIconOnly
        ? "w-9 h-9 p-0 text-sm"
        : "text-xs px-3.5 py-1.5 gap-1.5 h-8",
      md: isIconOnly
        ? "w-11 h-11 p-0 text-base"
        : "text-sm px-5 py-2.5 gap-2 h-11",
      lg: isIconOnly
        ? "w-14 h-14 p-0 text-xl"
        : "text-base px-7 py-3 gap-2.5 h-13",
    }[size];

    // Clay tactile variants
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[#D96B43] text-white shadow-clay-primary hover:bg-[#CA5E37] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_3px_3px_6px_rgba(140,50,20,0.45),inset_-2px_-2px_5px_rgba(255,255,255,0.3)]",
      secondary:
        "bg-[#EFECE5] text-[#2B2D42] shadow-clay-sm border border-white/60 hover:bg-[#E7E2D9] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-clay-pressed",
      tertiary:
        "bg-[#FBF9F5] text-[#4F5D73] shadow-clay-sm border border-white/80 hover:bg-[#F3EFE7] hover:text-[#2B2D42] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-clay-pressed",
      destructive:
        "bg-[#C94A4A] text-white shadow-[6px_7px_16px_rgba(201,74,74,0.35),-4px_-4px_12px_#FFFFFF,inset_2px_2px_4px_rgba(255,255,255,0.45),inset_-2px_-2px_4px_rgba(140,40,40,0.3)] hover:bg-[#B53C3C] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_3px_3px_6px_rgba(110,20,20,0.45)]",
      ghost:
        "bg-transparent text-[#5C6479] hover:bg-[#EFECE5] hover:text-[#2B2D42] hover:shadow-clay-sm active:shadow-clay-inset-sm",
      sage:
        "bg-[#588B76] text-white shadow-[6px_7px_16px_rgba(88,139,118,0.35),-4px_-4px_12px_#FFFFFF,inset_2px_2px_4px_rgba(255,255,255,0.45),inset_-2px_-2px_4px_rgba(45,85,68,0.3)] hover:bg-[#4A7A66] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_3px_3px_6px_rgba(30,70,50,0.45)]",
      sky:
        "bg-[#4F8CA5] text-white shadow-[6px_7px_16px_rgba(79,140,165,0.35),-4px_-4px_12px_#FFFFFF,inset_2px_2px_4px_rgba(255,255,255,0.45),inset_-2px_-2px_4px_rgba(40,90,110,0.3)] hover:bg-[#437A91] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[inset_3px_3px_6px_rgba(25,65,85,0.45)]",
    };

    // Floating action button style override
    const floatingStyle = isFloating
      ? "shadow-clay-floating hover:shadow-[18px_24px_40px_rgba(175,165,150,0.42),-12px_-12px_28px_#FFFFFF] hover:-translate-y-1 active:translate-y-0.5"
      : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${shapeStyles} ${sizeStyles} ${variantStyles[variant]} ${floatingStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <FiLoader className="animate-spin text-current shrink-0 mr-1.5" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

ClayButton.displayName = "ClayButton";

export default ClayButton;
