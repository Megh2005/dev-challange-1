"use client";

import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showValue?: boolean;
  color?: "terracotta" | "sage" | "sky" | "amber";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ClayProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showValue = true,
  color = "terracotta",
  size = "md",
  className = "",
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightStyles = {
    sm: "h-2.5",
    md: "h-4",
    lg: "h-6",
  }[size];

  const colorStyles = {
    terracotta: "bg-[#D96B43] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]",
    sage: "bg-[#588B76] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]",
    sky: "bg-[#4F8CA5] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]",
    amber: "bg-[#D48B38] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]",
  }[color];

  return (
    <div className={`w-full flex flex-col gap-1.5 select-none ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-semibold text-[#4F5D73]">
          {label && <span>{label}</span>}
          {showValue && <span className="font-bold text-[#2B2D42]">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div className={`w-full ${heightStyles} rounded-clay-pill bg-[#E6E1D7] shadow-clay-inset p-0.5 overflow-hidden`}>
        <div
          className={`h-full rounded-clay-pill ${colorStyles} transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export interface CircularProgressProps {
  value?: number; // if undefined, acts as indeterminate spinner
  size?: number; // px
  strokeWidth?: number;
  className?: string;
}

export const ClayCircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 56,
  strokeWidth = 6,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const isIndeterminate = value === undefined;
  const strokeDashoffset = isIndeterminate
    ? circumference * 0.3
    : circumference - ((value || 0) / 100) * circumference;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        className={isIndeterminate ? "animate-spin" : "-rotate-90"}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E6E1D7"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* Indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#D96B43"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {!isIndeterminate && (
        <span className="absolute text-[11px] font-bold text-[#2B2D42]">
          {Math.round(value || 0)}%
        </span>
      )}
    </div>
  );
};

export const ClayLoader: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className = "",
}) => {
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span className={`${dotSizes} rounded-clay-pill bg-[#D96B43] shadow-clay-sm animate-bounce [animation-delay:-0.3s]`} />
      <span className={`${dotSizes} rounded-clay-pill bg-[#588B76] shadow-clay-sm animate-bounce [animation-delay:-0.15s]`} />
      <span className={`${dotSizes} rounded-clay-pill bg-[#4F8CA5] shadow-clay-sm animate-bounce`} />
    </div>
  );
};

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

export const ClaySkeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
}) => {
  const shape =
    variant === "circular"
      ? "rounded-clay-pill"
      : variant === "text"
      ? "rounded-clay-md h-4"
      : "rounded-clay-xl";

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      style={style}
      className={`clay-skeleton ${shape} ${className}`}
    />
  );
};
