"use client";

import React, { forwardRef } from "react";
import { FiCheck } from "react-icons/fi";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
}

export const ClaySwitch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className = "",
  id,
}) => {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const dimensions = {
    sm: { track: "w-11 h-6", knob: "w-4 h-4", translate: "translate-x-5" },
    md: { track: "w-14 h-8", knob: "w-6 h-6", translate: "translate-x-6" },
    lg: { track: "w-16 h-9", knob: "w-7 h-7", translate: "translate-x-7" },
  }[size];

  return (
    <label
      htmlFor={switchId}
      className={`inline-flex items-center gap-3.5 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      <div className="relative">
        <input
          id={switchId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {/* Clay Inset Track */}
        <div
          className={`${dimensions.track} rounded-clay-pill transition-colors duration-250 flex items-center p-1 ${
            checked
              ? "bg-[#D96B43] shadow-[inset_3px_3px_6px_rgba(140,50,20,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]"
              : "bg-[#E5E0D5] shadow-clay-inset"
          }`}
        >
          {/* Clay Elevated Sliding Knob */}
          <div
            className={`${dimensions.knob} rounded-clay-pill bg-[#FAF8F5] shadow-clay-sm transition-transform duration-250 ease-out transform ${
              checked ? dimensions.translate : "translate-x-0"
            }`}
          />
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-sm font-semibold text-[#2B2D42]">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-[#8D99AE]">{description}</span>
          )}
        </div>
      )}
    </label>
  );
};

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const ClayCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onChange, label, description, disabled = false, id, className = "" }, ref) => {
    const boxId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={boxId}
        className={`inline-flex items-start gap-3 select-none ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${className}`}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            ref={ref}
            id={boxId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-clay-sm flex items-center justify-center transition-all duration-200 ${
              checked
                ? "bg-[#D96B43] text-white shadow-clay-primary scale-105"
                : "bg-[#EAE6DC] shadow-clay-inset border border-black/[0.03]"
            }`}
          >
            {checked && <FiCheck className="text-xs stroke-[3.5]" />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col text-left">
            {label && (
              <span className="text-sm font-semibold text-[#2B2D42]">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-[#8D99AE]">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

ClayCheckbox.displayName = "ClayCheckbox";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (val: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const ClayRadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  disabled = false,
  orientation = "vertical",
  className = "",
}) => {
  return (
    <div
      className={`flex ${
        orientation === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-3"
      } ${className}`}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const optId = `${name}-${opt.value}`;
        return (
          <label
            key={opt.value}
            htmlFor={optId}
            className={`inline-flex items-start gap-3 select-none ${
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input
                id={optId}
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-clay-pill flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-[#FCFBF9] shadow-clay-sm border border-white"
                    : "bg-[#EAE6DC] shadow-clay-inset border border-black/[0.03]"
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-clay-pill bg-[#D96B43] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),0_1px_2px_rgba(217,107,67,0.4)]" />
                )}
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-[#2B2D42]">
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-xs text-[#8D99AE]">{opt.description}</span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};
