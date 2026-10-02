"use client";

import React from "react";
import { FiHeart, FiGlobe, FiShield, FiCode } from "react-icons/fi";
import { ClayBadge } from "../clay/Badge";

export const ClayFooter: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-[#E8E4DA] bg-[#FAF8F5]/80 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C6479]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#2B2D42]">CIVILATHON 2026</span>
          <span>•</span>
          <span>Next-Generation Civic Engineering Hackathon</span>
          <ClayBadge variant="sage" size="sm" isPill>
            Clay Design System 1.0
          </ClayBadge>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <FiShield className="text-[#588B76]" /> 100% Full-Light Ergonomic Palette
          </span>
          <span className="flex items-center gap-1">
            <FiCode className="text-[#D96B43]" /> Pure Claymorphic Shading
          </span>
        </div>
      </div>
    </footer>
  );
};
