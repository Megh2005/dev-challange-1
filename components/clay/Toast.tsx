"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ClayToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration ?? 4500;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast viewport container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-clay-xl bg-[#FAF8F5] shadow-clay-floating border border-white/90 animate-in slide-in-from-bottom-3 duration-250"
          >
            {/* Status icon badge */}
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && (
                <div className="w-8 h-8 rounded-clay-pill bg-[#E2F4EB] text-[#438E68] shadow-clay-sm flex items-center justify-center border border-white">
                  <FiCheckCircle className="text-base" />
                </div>
              )}
              {t.type === "error" && (
                <div className="w-8 h-8 rounded-clay-pill bg-[#FCEAEA] text-[#C94A4A] shadow-clay-sm flex items-center justify-center border border-white">
                  <FiAlertCircle className="text-base" />
                </div>
              )}
              {t.type === "warning" && (
                <div className="w-8 h-8 rounded-clay-pill bg-[#FEF2E4] text-[#D9822B] shadow-clay-sm flex items-center justify-center border border-white">
                  <FiAlertTriangle className="text-base" />
                </div>
              )}
              {t.type === "info" && (
                <div className="w-8 h-8 rounded-clay-pill bg-[#DFF0F7] text-[#4F8CA5] shadow-clay-sm flex items-center justify-center border border-white">
                  <FiInfo className="text-base" />
                </div>
              )}
            </div>

            {/* Text details */}
            <div className="flex-1 text-left">
              <h4 className="text-xs font-bold text-[#2B2D42]">{t.title}</h4>
              {t.message && (
                <p className="text-xs text-[#5C6479] mt-0.5">{t.message}</p>
              )}
            </div>

            {/* Dismiss */}
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-clay-pill text-[#8D99AE] hover:text-[#2B2D42] hover:bg-[#EFECE5] transition-colors"
            >
              <FiX className="text-xs" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useClayToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useClayToast must be used within a ClayToastProvider");
  }
  return context;
};
