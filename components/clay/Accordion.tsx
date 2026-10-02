"use client";

import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
}

export const ClayAccordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className = "",
}) => {
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setExpanded((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setExpanded((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {items.map((item) => {
        const isOpen = expanded.includes(item.id);
        return (
          <div
            key={item.id}
            className="rounded-clay-xl bg-[#FAF8F5] shadow-clay-sm border border-white/80 overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left select-none hover:bg-[#F4F1EA] transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <div className="w-8 h-8 rounded-clay-pill bg-[#EFECE5] text-[#5C6479] shadow-clay-sm flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-[#2B2D42]">{item.title}</h4>
                  {item.subtitle && (
                    <p className="text-xs text-[#8D99AE] mt-0.5">{item.subtitle}</p>
                  )}
                </div>
              </div>
              <div
                className={`w-7 h-7 rounded-clay-pill bg-[#EFECE5] text-[#5C6479] shadow-clay-sm flex items-center justify-center transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180 bg-[#FAF8F5] text-[#D96B43]" : ""
                }`}
              >
                <FiChevronDown className="text-sm" />
              </div>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5C6479] leading-relaxed border-t border-[#EAE6DC]/60 animate-in fade-in duration-150">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClayAccordion;
