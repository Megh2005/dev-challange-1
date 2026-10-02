"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaHardHat } from "react-icons/fa";
import { MdConstruction, MdEngineering } from "react-icons/md";
import {
  FiArrowRight,
  FiShield,
  FiWifiOff,
} from "react-icons/fi";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth");
  };

  return (
    <div className="flex-1 w-full min-h-[calc(100vh-72px)] flex items-center justify-center py-6 px-0 antialiased">
      {/* 80% screen width on all devices, strictly horizontally and vertically centered */}
      <main className="w-[80vw] mx-auto flex flex-col items-center justify-center text-center my-auto">
        <div className="w-full bg-white rounded-[36px] lg:rounded-[48px] p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(240,101,41,0.12),0_4px_16px_rgba(0,0,0,0.03),inset_3px_3px_6px_rgba(255,255,255,1),inset_-3px_-3px_6px_rgba(240,101,41,0.06)] border border-[#F06529]/15 flex flex-col items-center justify-center gap-6 sm:gap-8">
          {/* Construction Brand Emblem */}
          <div
            aria-label="ShramPark Construction Emblem"
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-[#F06529] shadow-[6px_12px_26px_rgba(240,101,41,0.38),-4px_-4px_12px_#FFFFFF,inset_3px_3px_6px_rgba(255,255,255,0.55),inset_-3px_-3px_6px_rgba(160,45,10,0.35)] flex items-center justify-center text-white text-3xl sm:text-4xl lg:text-5xl shrink-0 transition-transform hover:scale-105"
          >
            <FaHardHat className="drop-shadow-sm" />
          </div>

          {/* App Name & Small Tagline */}
          <div className="flex flex-col items-center gap-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#181A1E]">
              ShramPark
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-[#555A64] font-medium leading-relaxed max-w-2xl">
              Bridging civil engineering standards and practical site execution for on-site construction.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-3xl pt-1">
            <span className="px-4 py-2 rounded-full bg-[#FFF5EE] border border-[#F06529]/20 text-[#F06529] text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-2">
              <FiShield className="text-sm sm:text-base shrink-0" />
              <span>IS Code Compliant</span>
            </span>
            <span className="px-4 py-2 rounded-full bg-[#FFF5EE] border border-[#F06529]/20 text-[#F06529] text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-2">
              <FiWifiOff className="text-sm sm:text-base shrink-0" />
              <span>Offline-First</span>
            </span>
            <span className="px-4 py-2 rounded-full bg-[#FFF5EE] border border-[#F06529]/20 text-[#F06529] text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-2">
              <MdConstruction className="text-sm sm:text-base shrink-0" />
              <span>Field Verified</span>
            </span>
          </div>

          {/* Minimal Call to Action */}
          <div className="pt-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleGetStarted}
              className="w-full sm:w-auto min-h-[56px] py-4 px-10 rounded-[26px] bg-[#F06529] hover:bg-[#DF5316] active:scale-[0.98] text-white font-black text-base sm:text-lg tracking-wide shadow-[6px_12px_28px_rgba(240,101,41,0.38),inset_2.5px_2.5px_5px_rgba(255,255,255,0.55),inset_-2.5px_-2.5px_5px_rgba(160,45,10,0.4)] flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <MdEngineering className="text-2xl shrink-0" />
              <span>Get Started</span>
              <FiArrowRight className="text-lg stroke-[3] ml-0.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
