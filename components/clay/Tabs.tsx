"use client";

import React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  size?: "sm" | "md" | "lg";
  isPill?: boolean;
  className?: string;
}

export const ClayTabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  size = "md",
  isPill = true,
  className = "",
}) => {
  const sizeStyles = {
    sm: "h-9 p-1 text-xs gap-1",
    md: "h-11 p-1.5 text-xs sm:text-sm gap-1.5",
    lg: "h-13 p-2 text-sm sm:text-base gap-2",
  }[size];

  const itemSizeStyles = {
    sm: "px-3 py-1",
    md: "px-4 py-1.5",
    lg: "px-5 py-2",
  }[size];

  const radiusStyles = isPill ? "rounded-clay-pill" : "rounded-clay-lg";

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-[#E8E4DA] shadow-clay-inset overflow-x-auto max-w-full ${radiusStyles} ${sizeStyles} ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center justify-center font-semibold select-none whitespace-nowrap transition-all duration-200 cursor-pointer ${radiusStyles} ${itemSizeStyles} ${
              isActive
                ? "bg-[#FAF8F5] text-[#2B2D42] shadow-clay-sm border border-white/90 scale-[1.01]"
                : "text-[#5C6479] hover:text-[#2B2D42] hover:bg-black/[0.02]"
            }`}
          >
            {tab.icon && <span className="mr-1.5 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-2 text-[10px] font-bold px-1.5 py-0.2 rounded-clay-pill ${
                  isActive
                    ? "bg-[#D96B43] text-white"
                    : "bg-[#D5CFBF] text-[#2B2D42]"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ClayTabs;
