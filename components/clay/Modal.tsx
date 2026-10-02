"use client";

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { ClayButton } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const ClayModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className = "",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Soft warm backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2B2D42]/20 backdrop-blur-[2px] transition-opacity duration-300"
      />

      {/* Clay Molded Dialog Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${sizeStyles} bg-[#FAF8F5] rounded-clay-2xl shadow-clay-floating border border-white/90 p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h3 className="text-xl font-bold text-[#2B2D42] ">{title}</h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-[#5C6479] mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-clay-pill bg-[#EFECE5] text-[#5C6479] hover:text-[#2B2D42] shadow-clay-sm border border-white flex items-center justify-center transition-all hover:bg-[#E7E2D9] active:shadow-clay-pressed shrink-0"
          >
            <FiX className="text-base" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-2 text-sm text-[#2B2D42]">{children}</div>

        {/* Footer Actions */}
        {footer && (
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#EAE6DC]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: "right" | "bottom";
  className?: string;
}

export const ClayDrawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = "right",
  className = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const posStyles =
    position === "right"
      ? "top-0 right-0 h-full w-full max-w-md rounded-l-clay-2xl shadow-[-16px_0_36px_rgba(175,165,150,0.36)]"
      : "bottom-0 left-0 w-full max-h-[85vh] rounded-t-clay-2xl shadow-[0_-16px_36px_rgba(175,165,150,0.36)]";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2B2D42]/20 backdrop-blur-[2px] transition-opacity"
      />

      {/* Drawer Container */}
      <div
        className={`fixed z-10 bg-[#FAF8F5] border border-white/90 p-6 flex flex-col justify-between overflow-y-auto animate-in duration-300 ${
          position === "right" ? "slide-in-from-right" : "slide-in-from-bottom"
        } ${posStyles} ${className}`}
      >
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EAE6DC]">
            <h3 className="text-lg font-bold text-[#2B2D42]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-clay-pill bg-[#EFECE5] text-[#5C6479] hover:text-[#2B2D42] shadow-clay-sm flex items-center justify-center"
            >
              <FiX />
            </button>
          </div>
          <div className="text-sm text-[#2B2D42]">{children}</div>
        </div>
        {footer && (
          <div className="pt-4 border-t border-[#EAE6DC] flex items-center justify-end gap-3 mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClayModal;
