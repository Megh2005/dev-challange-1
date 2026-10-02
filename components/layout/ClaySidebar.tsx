"use client";

import React from "react";
import {
  FiGrid,
  FiFolder,
  FiAward,
  FiEdit3,
  FiLayers,
  FiBarChart2,
  FiSliders,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import { ClayProgressBar } from "../clay/Progress";
import { ClayBadge } from "../clay/Badge";

export interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  className?: string;
}

export const ClaySidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  className = "",
}) => {
  const mainNav = [
    { id: "dashboard", label: "Overview Dashboard", icon: <FiGrid /> },
    { id: "projects", label: "Infrastructure Projects", icon: <FiFolder />, badge: "24" },
    { id: "challenges", label: "Innovation Tracks", icon: <FiAward />, badge: "4 Tracks" },
    { id: "submission", label: "Project Submission", icon: <FiEdit3 /> },
    { id: "analytics", label: "Impact & Scoring", icon: <FiBarChart2 /> },
    { id: "components", label: "Clay Design System", icon: <FiLayers />, badge: "Core UI" },
  ];

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col gap-6 p-4 select-none ${className}`}
    >
      {/* Navigation Section */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8D99AE] px-3 mb-1">
          NAVIGATION
        </span>
        {mainNav.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-clay-lg text-xs font-bold transition-all duration-200 text-left ${
                isActive
                  ? "bg-[#FAF8F5] text-[#D96B43] shadow-clay-sm border border-white"
                  : "text-[#5C6479] hover:text-[#2B2D42] hover:bg-[#EFECE5]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <ClayBadge
                  variant={isActive ? "terracotta" : "neutral"}
                  size="sm"
                  isPill
                >
                  {item.badge}
                </ClayBadge>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Phase Widget Card */}
      <div className="p-4 rounded-clay-xl bg-[#FAF8F5] shadow-clay-sm border border-white/80 flex flex-col gap-2.5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#4F5D73]">
            HACKATHON STATUS
          </span>
          <ClayBadge variant="sage" size="sm" withDot>
            Live
          </ClayBadge>
        </div>
        <p className="text-xs font-bold text-[#2B2D42]">
          Phase 2: Feasibility & Structural Prototyping
        </p>
        <ClayProgressBar
          value={68}
          color="terracotta"
          size="sm"
          label="Submission Deadline"
          showValue={true}
        />
        <p className="text-[10px] text-[#8D99AE] flex items-center gap-1 mt-0.5">
          <FiInfo className="text-xs shrink-0 text-[#D96B43]" />
          Peer review starts in 3 days.
        </p>
      </div>

      {/* Evaluation Criteria Quick Card */}
      <div className="p-4 rounded-clay-xl bg-[#FAF8F5] shadow-clay-sm border border-white/80 flex flex-col gap-2 text-left">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#4F5D73]">
          SCORING PILLARS
        </span>
        <div className="flex flex-col gap-1.5 text-xs text-[#5C6479]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-clay-pill bg-[#D96B43]" />
              Resilience
            </span>
            <span className="font-bold text-[#2B2D42]">35%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-clay-pill bg-[#588B76]" />
              Sustainability
            </span>
            <span className="font-bold text-[#2B2D42]">25%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-clay-pill bg-[#4F8CA5]" />
              Feasibility
            </span>
            <span className="font-bold text-[#2B2D42]">20%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-clay-pill bg-[#D48B38]" />
              Social Impact
            </span>
            <span className="font-bold text-[#2B2D42]">20%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
