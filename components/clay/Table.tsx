"use client";

import React from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ClayTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  isLoading,
  className = "",
}: TableProps<T>) {
  return (
    <div
      className={`w-full overflow-hidden rounded-clay-xl bg-[#FAF8F5] shadow-clay border border-white/90 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EFECE5] border-b border-[#E2DDD2] text-[#4F5D73] text-xs font-bold uppercase tracking-wider select-none">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`py-3.5 px-4 sm:px-6 ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  } ${col.sortable ? "cursor-pointer hover:text-[#2B2D42]" : ""}`}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${
                      col.align === "right" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[#8D99AE]">
                        {sortColumn === col.key ? (
                          sortDirection === "asc" ? (
                            <FiChevronUp className="text-xs text-[#D96B43]" />
                          ) : (
                            <FiChevronDown className="text-xs text-[#D96B43]" />
                          )
                        ) : (
                          <div className="flex flex-col -space-y-1">
                            <FiChevronUp className="text-[10px]" />
                            <FiChevronDown className="text-[10px]" />
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE6DC] text-xs sm:text-sm text-[#2B2D42]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-[#8D99AE]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-3 border-[#D96B43] border-t-transparent rounded-full animate-spin" />
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-[#8D99AE]">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors duration-150 ${
                    onRowClick
                      ? "cursor-pointer hover:bg-[#F2EFE8]"
                      : "hover:bg-[#F6F4EE]"
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 sm:px-6 font-medium ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {col.render
                        ? col.render(row)
                        : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClayTable;
