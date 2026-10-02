"use client";

import React from "react";

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  showValue?: boolean;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export const ClaySlider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  showValue = true,
  unit = "%",
  disabled = false,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`w-full flex flex-col gap-2 select-none ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-semibold">
          {label && <span className="text-[#4F5D73] uppercase tracking-wider">{label}</span>}
          {showValue && (
            <span className="bg-[#FAF8F5] text-[#D96B43] px-2.5 py-0.5 rounded-clay-pill shadow-clay-sm font-bold border border-white/70">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}
      <div className="relative flex items-center h-7 w-full">
        {/* Clay Inset Track Rail */}
        <div className="w-full h-3 rounded-clay-pill bg-[#E6E1D7] shadow-clay-inset overflow-hidden p-0.5 relative">
          {/* Active Fill */}
          <div
            className="h-full rounded-clay-pill bg-[#D96B43] transition-all duration-75 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Invisible native range input for accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
        {/* Elevated Molded Clay Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 flex items-center justify-center w-6 h-6 rounded-clay-pill bg-[#FAF8F5] shadow-clay border border-white"
          style={{
            left: `calc(${percentage}% - 12px)`,
          }}
        >
          <div className="w-2 h-2 rounded-clay-pill bg-[#D96B43] shadow-[inset_0.5px_0.5px_1px_rgba(255,255,255,0.5)]" />
        </div>
      </div>
    </div>
  );
};

export default ClaySlider;
