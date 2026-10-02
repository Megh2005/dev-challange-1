"use client";

import React from "react";
import { FiChevronRight, FiChevronLeft, FiMoreHorizontal } from "react-icons/fi";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const ClayBreadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  return (
    <nav aria-label="Breadcrumb" className={`inline-flex items-center gap-1.5 ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <FiChevronRight className="text-[#8D99AE] text-xs shrink-0 mx-1" />
            )}
            {isLast ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B2D42] bg-[#FAF8F5] px-3 py-1 rounded-clay-pill shadow-clay-sm border border-white/80">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C6479] hover:text-[#2B2D42] hover:bg-[#EFECE5] px-2.5 py-1 rounded-clay-pill transition-colors"
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const ClayPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const getPages = () => {
    const pages: (number | "dots")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("dots");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("dots");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Prev button */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-9 h-9 rounded-clay-md bg-[#FAF8F5] text-[#2B2D42] shadow-clay-sm border border-white/80 flex items-center justify-center transition-all hover:bg-[#F2EFE8] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-clay-pressed disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
      >
        <FiChevronLeft className="text-base" />
      </button>

      {/* Pages */}
      {getPages().map((p, idx) => {
        if (p === "dots") {
          return (
            <span key={`dots-${idx}`} className="w-8 flex items-center justify-center text-[#8D99AE]">
              <FiMoreHorizontal />
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-clay-md text-xs font-bold transition-all flex items-center justify-center ${
              isCurrent
                ? "bg-[#D96B43] text-white shadow-clay-primary scale-105"
                : "bg-[#FAF8F5] text-[#2B2D42] shadow-clay-sm border border-white/80 hover:bg-[#F2EFE8] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-clay-pressed"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next button */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-9 h-9 rounded-clay-md bg-[#FAF8F5] text-[#2B2D42] shadow-clay-sm border border-white/80 flex items-center justify-center transition-all hover:bg-[#F2EFE8] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-clay-pressed disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
      >
        <FiChevronRight className="text-base" />
      </button>
    </div>
  );
};
