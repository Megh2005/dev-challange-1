"use client";

import React from "react";
import {
  FiSearch,
  FiBell,
  FiPlus,
  FiCompass,
  FiLayers,
  FiCommand,
} from "react-icons/fi";
import { ClayButton } from "../clay/Button";
import { ClayAvatar } from "../clay/Avatar";
import { ClayBadge } from "../clay/Badge";

export interface ClayHeaderProps {
  onOpenCommandPalette: () => void;
  onOpenNewProject: () => void;
  onOpenNotifications: () => void;
  activeView: string;
  onSelectView: (view: string) => void;
}

export const ClayHeader: React.FC<ClayHeaderProps> = ({
  onOpenCommandPalette,
  onOpenNewProject,
  onOpenNotifications,
  activeView,
  onSelectView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E4DA] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => onSelectView("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-clay-lg bg-[#D96B43] shadow-clay-primary flex items-center justify-center text-white text-lg font-black transition-transform group-hover:scale-105">
              <FiCompass className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black  text-[#2B2D42]">
                  CIVILATHON
                </span>
                <ClayBadge variant="terracotta" size="sm" isPill>
                  2026
                </ClayBadge>
              </div>
              <p className="text-[10px] font-semibold text-[#8D99AE] uppercase tracking-wider hidden sm:block">
                Civic Infrastructure Engineering Hub
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Action & Search Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-3 bg-[#EAE6DC] hover:bg-[#E4DFD5] shadow-clay-inset rounded-clay-pill h-10 px-4 text-xs text-[#5C6479] transition-all border border-black/[0.03] select-none"
          >
            <FiSearch className="text-sm text-[#8D99AE]" />
            <span>Search projects, challenges, components...</span>
            <kbd className="flex items-center gap-0.5 text-[10px] font-bold text-[#8D99AE] bg-[#FAF8F5] px-2 py-0.5 rounded-clay-pill shadow-clay-sm border border-white">
              <FiCommand className="text-[9px]" /> K
            </kbd>
          </button>

          {/* Quick Nav Switches */}
          <div className="hidden lg:flex items-center bg-[#EAE6DC] p-1 rounded-clay-pill shadow-clay-inset">
            <button
              onClick={() => onSelectView("dashboard")}
              className={`px-3.5 py-1.5 rounded-clay-pill text-xs font-bold transition-all ${
                activeView === "dashboard"
                  ? "bg-[#FAF8F5] text-[#2B2D42] shadow-clay-sm"
                  : "text-[#5C6479] hover:text-[#2B2D42]"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSelectView("projects")}
              className={`px-3.5 py-1.5 rounded-clay-pill text-xs font-bold transition-all ${
                activeView === "projects"
                  ? "bg-[#FAF8F5] text-[#2B2D42] shadow-clay-sm"
                  : "text-[#5C6479] hover:text-[#2B2D42]"
              }`}
            >
              Projects & Challenges
            </button>
            <button
              onClick={() => onSelectView("components")}
              className={`px-3.5 py-1.5 rounded-clay-pill text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === "components"
                  ? "bg-[#FAF8F5] text-[#D96B43] shadow-clay-sm"
                  : "text-[#5C6479] hover:text-[#2B2D42]"
              }`}
            >
              <FiLayers />
              Clay Design System
            </button>
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-clay-pill bg-[#FAF8F5] text-[#5C6479] hover:text-[#2B2D42] shadow-clay-sm border border-white/80 flex items-center justify-center transition-all hover:bg-[#F2EFE8] active:shadow-clay-pressed"
            aria-label="Notifications"
          >
            <FiBell className="text-base" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-clay-pill bg-[#D96B43] ring-2 ring-[#FAF8F5]" />
          </button>

          {/* New Project CTA */}
          <ClayButton
            variant="primary"
            size="sm"
            isPill
            leftIcon={<FiPlus className="text-sm stroke-[3]" />}
            onClick={onOpenNewProject}
          >
            <span className="hidden sm:inline">Submit Proposal</span>
            <span className="sm:hidden">Submit</span>
          </ClayButton>

          {/* User Avatar */}
          <ClayAvatar
            name="Dr. Elena Vance"
            size="sm"
            status="online"
            className="cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
};
