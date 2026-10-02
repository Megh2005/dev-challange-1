"use client";

import React, { forwardRef } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  inset?: boolean;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  radius?: "md" | "lg" | "xl" | "2xl" | "pill";
  variant?: "default" | "warm" | "sage" | "sky" | "amber" | "terracotta";
}

export const ClayCard = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      elevated = false,
      inset = false,
      interactive = false,
      padding = "md",
      radius = "xl",
      variant = "default",
      className = "",
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      none: "p-0",
      sm: "p-3 sm:p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
      xl: "p-8 sm:p-10",
    }[padding];

    const radiusStyles = {
      md: "rounded-clay-md",
      lg: "rounded-clay-lg",
      xl: "rounded-clay-xl",
      "2xl": "rounded-clay-2xl",
      pill: "rounded-clay-pill",
    }[radius];

    // Backgrounds for subtle tinting if desired
    const variantBg = {
      default: inset ? "bg-[#EAE6DD]" : elevated ? "bg-[#FAF8F4]" : "bg-[#F4F1EA]",
      warm: inset ? "bg-[#F0EBE0]" : elevated ? "bg-[#FDFBF7]" : "bg-[#F7F3EB]",
      sage: inset ? "bg-[#DFEAE4]" : elevated ? "bg-[#F3FAF6]" : "bg-[#EAF4EF]",
      sky: inset ? "bg-[#DEEBF1]" : elevated ? "bg-[#F2F8FB]" : "bg-[#E8F2F6]",
      amber: inset ? "bg-[#F5EDDD]" : elevated ? "bg-[#FCF7ED]" : "bg-[#FAF2E4]",
      terracotta: inset ? "bg-[#F5E6E0]" : elevated ? "bg-[#FDF5F2]" : "bg-[#FAEDE8]",
    }[variant];

    // Shadow style
    const shadowStyle = inset
      ? "shadow-clay-inset border border-black/[0.03]"
      : elevated
      ? "shadow-clay-elevated border border-white/70"
      : "shadow-clay border border-white/60";

    const interactiveStyles = interactive
      ? "transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-clay-elevated active:translate-y-0.5 active:shadow-clay-pressed"
      : "";

    return (
      <div
        ref={ref}
        className={`${variantBg} ${radiusStyles} ${shadowStyle} ${paddingStyles} ${interactiveStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ClayCard.displayName = "ClayCard";

export const ClayInset = forwardRef<
  HTMLDivElement,
  Omit<CardProps, "inset" | "elevated">
>((props, ref) => <ClayCard ref={ref} inset {...props} />);

ClayInset.displayName = "ClayInset";

export const ClayElevatedCard = forwardRef<
  HTMLDivElement,
  Omit<CardProps, "elevated" | "inset">
>((props, ref) => <ClayCard ref={ref} elevated {...props} />);

ClayElevatedCard.displayName = "ClayElevatedCard";

export default ClayCard;
