"use client";

import React from "react";
import { FiX } from "react-icons/fi";

export type BadgeVariant =
  | "terracotta"
  | "sage"
  | "sky"
  | "amber"
  | "purple"
  | "destructive"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  withDot?: boolean;
  isPill?: boolean;
}

export const ClayBadge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  withDot = false,
  isPill = true,
  className = "",
  ...props
}) => {
  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1",
    md: "text-xs px-3 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2",
  }[size];

  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string; shadow: string }> = {
    terracotta: {
      bg: "bg-[#F7EBE6]",
      text: "text-[#C25833]",
      dot: "bg-[#D96B43]",
      shadow: "shadow-clay-sm border border-white/80",
    },
    sage: {
      bg: "bg-[#E6F0EB]",
      text: "text-[#3D6953]",
      dot: "bg-[#588B76]",
      shadow: "shadow-clay-sm border border-white/80",
    },
    sky: {
      bg: "bg-[#E6F0F6]",
      text: "text-[#306C85]",
      dot: "bg-[#4F8CA5]",
      shadow: "shadow-clay-sm border border-white/80",
    },
    amber: {
      bg: "bg-[#FAF1DF]",
      text: "text-[#9E651E]",
      dot: "bg-[#D48B38]",
      shadow: "shadow-clay-sm border border-white/80",
    },
    purple: {
      bg: "bg-[#EFEAF5]",
      text: "text-[#5C4A78]",
      dot: "bg-[#7D6B9D]",
      shadow: "shadow-clay-sm border border-white/80",
    },
    destructive: {
      bg: "bg-[#FCECEC]",
      text: "text-[#B33535]",
      dot: "bg-[#C94A4A]",
      shadow: "shadow-clay-sm border border-white/80",
    },
    neutral: {
      bg: "bg-[#EFECE5]",
      text: "text-[#4F5D73]",
      dot: "bg-[#8D99AE]",
      shadow: "shadow-clay-sm border border-white/80",
    },
  };

  const v = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center font-semibold select-none ${
        isPill ? "rounded-clay-pill" : "rounded-clay-sm"
      } ${v.bg} ${v.text} ${v.shadow} ${sizeStyles} ${className}`}
      {...props}
    >
      {withDot && (
        <span className={`w-1.5 h-1.5 rounded-clay-pill shrink-0 ${v.dot}`} />
      )}
      {children}
    </span>
  );
};

export interface ChipProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

export const ClayChip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onSelect,
  onRemove,
  icon,
  size = "md",
  className = "",
}) => {
  const sizeStyles = {
    sm: "text-xs py-1 px-3 gap-1.5",
    md: "text-sm py-1.5 px-3.5 gap-2",
  }[size];

  return (
    <div
      onClick={onSelect}
      className={`inline-flex items-center rounded-clay-pill font-medium select-none transition-all duration-200 ${sizeStyles} ${
        onSelect ? "cursor-pointer" : ""
      } ${
        selected
          ? "bg-[#D96B43] text-white shadow-clay-primary scale-[1.02]"
          : "bg-[#FAF8F5] text-[#2B2D42] shadow-clay-sm border border-white/80 hover:bg-[#F2EFE8] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-clay-pressed"
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`ml-0.5 p-0.5 rounded-clay-pill transition-colors ${
            selected
              ? "hover:bg-white/20 text-white"
              : "hover:bg-black/5 text-[#8D99AE] hover:text-[#2B2D42]"
          }`}
        >
          <FiX className="text-xs" />
        </button>
      )}
    </div>
  );
};
