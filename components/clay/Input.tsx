"use client";

import React, { forwardRef, useState } from "react";
import { FiSearch, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
  isPill?: boolean;
}

export const ClayInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      inputSize = "md",
      isPill = false,
      disabled,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const sizeStyles = {
      sm: "h-9 text-xs px-3",
      md: "h-11 text-sm px-4",
      lg: "h-13 text-base px-5",
    }[inputSize];

    const radiusStyle = isPill ? "rounded-clay-pill" : "rounded-clay-md";

    const stateStyles = error
      ? "border border-[#C94A4A]/50 focus:border-[#C94A4A] focus:ring-2 focus:ring-[#C94A4A]/20"
      : success
      ? "border border-[#438E68]/50 focus:border-[#438E68] focus:ring-2 focus:ring-[#438E68]/20"
      : "border border-black/[0.04] focus:border-[#D96B43]/50 focus:ring-2 focus:ring-[#D96B43]/20";

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#4F5D73] uppercase tracking-wider pl-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#8D99AE]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-[#EAE6DC] text-[#2B2D42] placeholder-[#8D99AE] shadow-clay-inset font-normal transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${radiusStyle} ${sizeStyles} ${stateStyles} ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon || error || success ? "pr-10" : ""} ${className}`}
            {...props}
          />
          <div className="absolute right-3.5 flex items-center gap-1.5 text-[#8D99AE]">
            {error ? (
              <FiAlertCircle className="text-[#C94A4A] text-base shrink-0" />
            ) : success ? (
              <FiCheck className="text-[#438E68] text-base shrink-0" />
            ) : (
              rightIcon
            )}
          </div>
        </div>
        {error ? (
          <p className="text-xs font-medium text-[#C94A4A] pl-1 flex items-center gap-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-[#8D99AE] pl-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

ClayInput.displayName = "ClayInput";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
}

export const ClayTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, success, disabled, className = "", id, rows = 3, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const stateStyles = error
      ? "border border-[#C94A4A]/50 focus:border-[#C94A4A] focus:ring-2 focus:ring-[#C94A4A]/20"
      : success
      ? "border border-[#438E68]/50 focus:border-[#438E68] focus:ring-2 focus:ring-[#438E68]/20"
      : "border border-black/[0.04] focus:border-[#D96B43]/50 focus:ring-2 focus:ring-[#D96B43]/20";

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#4F5D73] uppercase tracking-wider pl-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          className={`w-full bg-[#EAE6DC] text-[#2B2D42] placeholder-[#8D99AE] shadow-clay-inset rounded-clay-lg p-3.5 text-sm transition-all duration-200 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed ${stateStyles} ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-[#C94A4A] pl-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8D99AE] pl-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

ClayTextarea.displayName = "ClayTextarea";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  isPill?: boolean;
}

export const ClaySelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, isPill = false, disabled, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const radiusStyle = isPill ? "rounded-clay-pill" : "rounded-clay-md";

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-[#4F5D73] uppercase tracking-wider pl-1"
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full appearance-none bg-[#EAE6DC] text-[#2B2D42] shadow-clay-inset h-11 px-4 pr-10 text-sm font-medium transition-all duration-200 outline-none border border-black/[0.04] focus:border-[#D96B43]/50 focus:ring-2 focus:ring-[#D96B43]/20 disabled:opacity-50 cursor-pointer ${radiusStyle} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#FAF8F5] text-[#2B2D42]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4F5D73]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error ? (
          <p className="text-xs font-medium text-[#C94A4A] pl-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#8D99AE] pl-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

ClaySelect.displayName = "ClaySelect";

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  placeholder?: string;
  shortcut?: string;
  className?: string;
}

export const ClaySearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search anything...",
  shortcut,
  className = "",
}) => {
  return (
    <div
      className={`relative flex items-center bg-[#EAE6DC] shadow-clay-inset rounded-clay-pill h-11 px-4 transition-all duration-200 border border-black/[0.03] focus-within:border-[#D96B43]/40 focus-within:ring-2 focus-within:ring-[#D96B43]/20 ${className}`}
    >
      <FiSearch className="text-[#8D99AE] text-base shrink-0 mr-2.5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[#2B2D42] placeholder-[#8D99AE] outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="text-[#8D99AE] hover:text-[#2B2D42] transition-colors p-1"
        >
          <FiX className="text-sm" />
        </button>
      ) : shortcut ? (
        <kbd className="hidden sm:inline-flex items-center text-[10px] font-bold text-[#8D99AE] bg-[#F7F5F0] shadow-clay-sm px-2 py-0.5 rounded-clay-pill border border-white/80">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  );
};
