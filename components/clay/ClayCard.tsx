"use client";

import React, { forwardRef } from "react";

export interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: "primary" | "secondary";
  elevated?: boolean;
}

export const ClayCard = forwardRef<HTMLDivElement, ClayCardProps>(
  (
    {
      children,
      surface = "primary",
      elevated = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const bg = surface === "primary" ? "bg-[#FFFDF8]" : "bg-[#F1EDE3]";
    const shadow = elevated ? "shadow-clay-elevated" : "shadow-clay-card";

    return (
      <div
        ref={ref}
        className={`${bg} ${shadow} rounded-[28px] border border-white/70 p-6 sm:p-8 transition-all ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ClayCard.displayName = "ClayCard";

export default ClayCard;
