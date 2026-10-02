"use client";

import React from "react";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "busy" | "offline" | "away";
  className?: string;
}

export const ClayAvatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  status,
  className = "",
}) => {
  const sizeStyles = {
    xs: "w-7 h-7 text-xs",
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm font-semibold",
    lg: "w-14 h-14 text-base font-bold",
    xl: "w-18 h-18 text-lg font-bold",
  }[size];

  const statusStyles = {
    online: "bg-[#438E68]",
    busy: "bg-[#C94A4A]",
    away: "bg-[#D9822B]",
    offline: "bg-[#8D99AE]",
  };

  const statusSizes = {
    xs: "w-2 h-2 bottom-0 right-0",
    sm: "w-2.5 h-2.5 bottom-0 right-0",
    md: "w-3 h-3 bottom-0 right-0",
    lg: "w-3.5 h-3.5 bottom-0.5 right-0.5",
    xl: "w-4 h-4 bottom-1 right-1",
  }[size];

  const getInitials = (n?: string) => {
    if (!n) return "?";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizeStyles} rounded-clay-pill bg-[#EFECE5] text-[#4F5D73] shadow-clay-sm flex items-center justify-center overflow-hidden border border-white/80 select-none`}
      >
        {src ? (
          <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute rounded-clay-pill border-2 border-[#FAF8F5] shadow-sm ${statusSizes} ${statusStyles[status]}`}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  users: Array<{ src?: string; name: string }>;
  max?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export const ClayAvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = "md",
  className = "",
}) => {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  const sizeStyles = {
    xs: "w-7 h-7 text-[10px]",
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-xs",
  }[size];

  return (
    <div className={`flex items-center -space-x-3 ${className}`}>
      {visible.map((u, i) => (
        <ClayAvatar key={i} src={u.src} name={u.name} size={size} className="ring-2 ring-[#FAF8F5]" />
      ))}
      {remaining > 0 && (
        <div
          className={`${sizeStyles} rounded-clay-pill bg-[#E6E1D7] text-[#4F5D73] font-bold shadow-clay-sm flex items-center justify-center border border-white/80 ring-2 ring-[#FAF8F5] select-none`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default ClayAvatar;
