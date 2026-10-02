"use client";

import React from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
  FiInbox,
  FiCheck,
  FiHelpCircle,
} from "react-icons/fi";
import { ClayButton } from "./Button";

export type AlertType = "info" | "success" | "warning" | "destructive";

export interface AlertProps {
  type?: AlertType;
  title: string;
  description?: React.ReactNode;
  onClose?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const ClayAlert: React.FC<AlertProps> = ({
  type = "info",
  title,
  description,
  onClose,
  action,
  className = "",
}) => {
  const configs: Record<
    AlertType,
    { bg: string; border: string; iconBg: string; iconColor: string; icon: React.ReactNode }
  > = {
    info: {
      bg: "bg-[#F0F6F9]",
      border: "border-white/80",
      iconBg: "bg-[#DFF0F7]",
      iconColor: "text-[#4F8CA5]",
      icon: <FiInfo className="text-base" />,
    },
    success: {
      bg: "bg-[#F0F8F4]",
      border: "border-white/80",
      iconBg: "bg-[#E2F4EB]",
      iconColor: "text-[#438E68]",
      icon: <FiCheckCircle className="text-base" />,
    },
    warning: {
      bg: "bg-[#FCF7ED]",
      border: "border-white/80",
      iconBg: "bg-[#FEF2E4]",
      iconColor: "text-[#D9822B]",
      icon: <FiAlertTriangle className="text-base" />,
    },
    destructive: {
      bg: "bg-[#FCF1F1]",
      border: "border-white/80",
      iconBg: "bg-[#FCEAEA]",
      iconColor: "text-[#C94A4A]",
      icon: <FiAlertCircle className="text-base" />,
    },
  };

  const c = configs[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3.5 p-4 rounded-clay-xl ${c.bg} shadow-clay-sm border ${c.border} text-left transition-all ${className}`}
    >
      <div
        className={`w-9 h-9 rounded-clay-pill ${c.iconBg} ${c.iconColor} shadow-clay-sm flex items-center justify-center shrink-0 border border-white`}
      >
        {c.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-[#2B2D42]">{title}</h4>
        {description && (
          <div className="text-xs text-[#5C6479] mt-0.5 leading-relaxed">
            {description}
          </div>
        )}
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-clay-pill text-[#8D99AE] hover:text-[#2B2D42] hover:bg-black/5 transition-colors shrink-0"
        >
          <FiX className="text-xs" />
        </button>
      )}
    </div>
  );
};

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const ClayEmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-clay-2xl bg-[#FAF8F5] shadow-clay border border-white/80 max-w-md mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-clay-2xl bg-[#EFECE5] shadow-clay-sm flex items-center justify-center text-[#8D99AE] text-2xl mb-4 border border-white">
        {icon || <FiInbox className="text-3xl" />}
      </div>
      <h3 className="text-lg font-bold text-[#2B2D42]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#5C6479] mt-1.5 max-w-xs leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <ClayButton variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </ClayButton>
        </div>
      )}
    </div>
  );
};

export interface StateCardProps {
  state: "success" | "error" | "confirmation";
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const ClayStateCard: React.FC<StateCardProps> = ({
  state,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  className = "",
}) => {
  const configs = {
    success: {
      icon: <FiCheck className="text-2xl text-[#438E68]" />,
      iconBg: "bg-[#E2F4EB]",
      btnVariant: "sage" as const,
    },
    error: {
      icon: <FiAlertCircle className="text-2xl text-[#C94A4A]" />,
      iconBg: "bg-[#FCEAEA]",
      btnVariant: "destructive" as const,
    },
    confirmation: {
      icon: <FiHelpCircle className="text-2xl text-[#D96B43]" />,
      iconBg: "bg-[#F5DDD5]",
      btnVariant: "primary" as const,
    },
  }[state];

  return (
    <div
      className={`p-6 sm:p-8 rounded-clay-2xl bg-[#FAF8F5] shadow-clay border border-white/90 text-center flex flex-col items-center max-w-md mx-auto ${className}`}
    >
      <div
        className={`w-14 h-14 rounded-clay-pill ${configs.iconBg} shadow-clay-sm border border-white flex items-center justify-center mb-4`}
      >
        {configs.icon}
      </div>
      <h3 className="text-lg font-bold text-[#2B2D42]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#5C6479] mt-1.5 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3 mt-6 w-full justify-center">
        {onCancel && (
          <ClayButton variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </ClayButton>
        )}
        {onConfirm && (
          <ClayButton variant={configs.btnVariant} onClick={onConfirm}>
            {confirmLabel}
          </ClayButton>
        )}
      </div>
    </div>
  );
};
