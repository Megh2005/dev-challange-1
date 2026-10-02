"use client";

import React from "react";
import { FaHardHat } from "react-icons/fa";
import { MdConstruction, MdEngineering } from "react-icons/md";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiCompass,
  FiVideo,
  FiWifiOff,
  FiCpu,
  FiBox,
  FiShield,
  FiUserCheck,
  FiAward,
  FiUsers,
  FiBookOpen,
  FiServer,
  FiGlobe,
  FiImage,
  FiTrendingUp,
  FiLayers,
  FiCode,
  FiArrowRight,
} from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-3.5 sm:p-6 lg:p-8 antialiased">
      <main className="w-full max-w-6xl mx-auto flex flex-col gap-6 lg:gap-8 py-4">
        {/* 1. HERO CARD: ABOUT SHRAMPARK */}
        <section
          aria-labelledby="card-hero-title"
          className="w-full bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_12px_28px_rgba(240,101,41,0.08),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.06)] border border-[#F06529]/15 flex flex-col items-center text-center gap-3.5"
        >
          <div
            aria-hidden="true"
            className="w-14 h-14 rounded-[20px] bg-[#F06529] shadow-[4px_8px_18px_rgba(240,101,41,0.35),inset_2px_2px_4px_rgba(255,255,255,0.55),inset_-2px_-2px_4px_rgba(160,45,10,0.35)] flex items-center justify-center text-white text-2xl shrink-0"
          >
            <FaHardHat className="drop-shadow-sm" />
          </div>

          <div className="flex flex-col gap-1 max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#F06529]">
              Mobile-First &amp; Cloud Platform
            </span>
            <h1
              id="card-hero-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#181A1E]"
            >
              About ShramPark
            </h1>
          </div>

          <p className="text-xs sm:text-base text-[#555A64] font-medium leading-relaxed max-w-2xl">
            ShramPark is a practical learning platform for on-site construction workers and civil engineers. It turns technical Indian Engineering Standards (IS codes) and drawings into actionable, field-verified site training.
          </p>

          <div className="px-4 py-2 rounded-[16px] bg-[#FFF5EE] border border-[#F06529]/20 text-xs sm:text-sm font-bold text-[#F06529]">
            A unified one-stop platform for construction site safety, trade craft, and engineering verification.
          </div>
        </section>

        {/* Content Grid: 3-column on laptop, 1-column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">

        {/* 2. THE PROBLEM */}
        <section
          aria-labelledby="card-problem-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiAlertCircle />
            </span>
            <h2
              id="card-problem-title"
              className="text-sm font-black text-[#181A1E]"
            >
              The Problem on Sites
            </h2>
          </div>

          <p className="text-xs text-[#555A64]">
            Construction sites face everyday learning barriers:
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">
                Informal Learning
              </strong>
              No structured training on site
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Language Gaps</strong>
              Multiple languages & low literacy
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Complex Plans</strong>
              Blueprints are hard to interpret
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Zero Network</strong>
              Basements have no connectivity
            </div>
          </div>
        </section>

        {/* 3. OUR SOLUTION */}
        <section
          aria-labelledby="card-sol-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiCheckCircle />
            </span>
            <h2
              id="card-sol-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Our Solution
            </h2>
          </div>

          <p className="text-xs text-[#555A64] leading-relaxed">
            A simple Progressive Web App (PWA) with visual, voice-assisted, and
            multilingual lessons workers can use on any smartphone.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {[
              "Visual Guides",
              "Voice Audio",
              "Local Languages",
              "Offline PWA",
            ].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-[#FFF5EE] text-[#F06529] font-bold text-[10px] border border-[#F06529]/15"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </section>

        {/* 4. HOW IT WORKS (7 STEPS) */}
        <section
          aria-labelledby="card-workflow-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiCompass />
            </span>
            <h2
              id="card-workflow-title"
              className="text-sm font-black text-[#181A1E]"
            >
              How ShramPark Works
            </h2>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px]">
            {[
              "1. Worker Onboarding (Language choice)",
              "2. Trade Assignment (Bar bending / Carpentry)",
              "3. Personalized Learning Path",
              "4. Short Practical Lesson (Video + Audio)",
              "5. Visual Quiz Check",
              "6. On-Site Supervisor Verification",
              "7. Verified Site Execution Sign-off",
            ].map((st) => (
              <div
                key={st}
                className="px-3 py-1.5 rounded-[12px] bg-[#FFF5EE] text-[#181A1E] font-semibold flex items-center gap-2 border border-[#F06529]/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F06529] shrink-0" />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. LEARNING EXPERIENCE */}
        <section
          aria-labelledby="card-exp-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiVideo />
            </span>
            <h2
              id="card-exp-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Learning Format
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Short Videos</strong>
              2-3 minute task demos
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Step Pictures</strong>
              Clear visual sequence
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Voice Audio</strong>
              Spoken explanations
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Visual Quizzes</strong>
              Easy picture checks
            </div>
          </div>
        </section>

        {/* 6. TRADES & SANDBOX */}
        <section
          aria-labelledby="card-trades-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <MdConstruction />
            </span>
            <h2
              id="card-trades-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Trades & Practice Sandbox
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#F06529] block">Bar Bending</strong>
              Steel cutting, hook bending & tying
            </div>
            <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#F06529] block">Carpentry</strong>
              Formwork, shuttering & staging
            </div>
          </div>

          <div className="p-2.5 rounded-[14px] bg-white border border-[#F06529]/20 text-[11px] text-[#555A64]">
            <strong className="text-[#181A1E] block mb-0.5">
              Interactive Sandbox:
            </strong>
            Workers practice rebar bends and joint alignments on screen before
            using real materials.
          </div>
        </section>

        {/* 7. OFFLINE-FIRST ARCHITECTURE */}
        <section
          aria-labelledby="card-offline-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiWifiOff />
            </span>
            <h2
              id="card-offline-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Works Offline
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] flex flex-col gap-0.5">
              <span className="font-black text-[#F06529]">Service Workers</span>
              <span className="text-[#555A64]">Cache lessons</span>
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] flex flex-col gap-0.5">
              <span className="font-black text-[#F06529]">IndexedDB</span>
              <span className="text-[#555A64]">Saves progress</span>
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] flex flex-col gap-0.5">
              <span className="font-black text-[#F06529]">Auto-Sync</span>
              <span className="text-[#555A64]">Syncs online</span>
            </div>
          </div>
        </section>

        {/* 8. AI COACH (FOR WORKERS) */}
        <section
          aria-labelledby="card-aicoach-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiCpu />
            </span>
            <h2
              id="card-aicoach-title"
              className="text-sm font-black text-[#181A1E]"
            >
              AI Coach (Worker Support)
            </h2>
          </div>

          <p className="text-xs text-[#555A64] leading-relaxed">
            Gemini-powered helper that explains technical terms in simple
            everyday language and answers course questions.
          </p>

          <div className="p-2.5 rounded-[14px] bg-[#FFF5EE] border border-[#F06529]/20 text-[10.5px] text-[#555A64] leading-tight">
            <strong className="text-[#F06529] block mb-0.5">
              Important Safety Rule:
            </strong>
            The AI Coach is only a learning helper. It does not replace
            engineers and never produces structural calculations.
          </div>
        </section>

        {/* 9. AI CO-PILOT (FOR ENGINEERS) */}
        <section
          aria-labelledby="card-copilot-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <MdEngineering />
            </span>
            <h2
              id="card-copilot-title"
              className="text-sm font-black text-[#181A1E]"
            >
              AI Co-Pilot (Engineer Assistant)
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Explains Plans</strong>
              Breaks down complex drawings
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Summarizes Codes</strong>
              Quick codal references
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Site Training</strong>
              Generates crew briefings
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Defect Analysis</strong>
              Photo checks (future scope)
            </div>
          </div>
        </section>

        {/* 10. SAFETY & VERIFICATION */}
        <section
          aria-labelledby="card-safety-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiShield />
            </span>
            <h2
              id="card-safety-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Safety & Verification
            </h2>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px]">
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64] flex items-start gap-2">
              <span className="text-[#F06529] font-black">✓</span>
              <span>
                <strong>Safety-First:</strong> PPE rules & hazard warnings built
                into every lesson.
              </span>
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64] flex items-start gap-2">
              <span className="text-[#F06529] font-black">✓</span>
              <span>
                <strong>Supervisor Sign-off:</strong> Supervisors watch
                practical work on site and sign off.
              </span>
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64] flex items-start gap-2">
              <span className="text-[#F06529] font-black">✓</span>
              <span>
                <strong>Compliance Reports:</strong> Verified inspections produce
                official PDF engineering checklists.
              </span>
            </div>
          </div>
        </section>

        {/* 11. WHO USES SHRAMPARK */}
        <section
          aria-labelledby="card-roles-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiUsers />
            </span>
            <h2
              id="card-roles-title"
              className="text-sm font-black text-[#181A1E]"
            >
              2 Core User Roles
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-[11px]">
            {[
              {
                role: "Supervisor",
                desc: "Manages on-site execution, safety compliance & quality audits",
              },
              {
                role: "Engineer",
                desc: "Executes offline IS calculations, structural analysis & code verification",
              },
            ].map((r) => (
              <div
                key={r.role}
                className="px-3 py-1.5 rounded-[12px] bg-[#FFF5EE] flex items-center justify-between"
              >
                <span className="font-extrabold text-[#F06529]">{r.role}</span>
                <span className="text-[#555A64] text-[10.5px]">{r.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 12. STANDARDS TO PRACTICE (IS 2502) */}
        <section
          aria-labelledby="card-standards-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiBookOpen />
            </span>
            <h2
              id="card-standards-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Codes in Action (IS 2502)
            </h2>
          </div>

          <p className="text-xs text-[#555A64] leading-relaxed">
            Indian Standard code <strong>IS 2502</strong> (Bending & Fixing of
            Bars) is turned into visual guides showing hook lengths, bend
            angles, and wire tying steps for rebar workers.
          </p>
        </section>

        {/* 13. TECH STACK & SECURITY */}
        <section
          aria-labelledby="card-tech-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiServer />
            </span>
            <h2
              id="card-tech-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Tech Stack & Security
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10.5px]">
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Frontend</strong>
              Next.js, React, Tailwind, PWA
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Backend</strong>
              Node.js, Express, MongoDB, Docker
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Security</strong>
              HTTPS, JWT, bcrypt, RBAC
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Sharp Media</strong>
              Fast image compression for 2G/3G
            </div>
          </div>
        </section>

        {/* 14. IMPACT */}
        <section
          aria-labelledby="card-impact-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiTrendingUp />
            </span>
            <h2
              id="card-impact-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Measurable Site Impact
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10.5px]">
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] flex flex-col gap-0.5">
              <strong className="text-[#F06529]">Workers</strong>
              <span className="text-[#555A64]">Real skills & safety</span>
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] flex flex-col gap-0.5">
              <strong className="text-[#F06529]">Job Sites</strong>
              <span className="text-[#555A64]">Less rework & waste</span>
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] flex flex-col gap-0.5">
              <strong className="text-[#F06529]">Contractors</strong>
              <span className="text-[#555A64]">Clear skill tracking</span>
            </div>
          </div>
        </section>

        {/* 15. ADOPTION & FUTURE SCOPE */}
        <section
          aria-labelledby="card-roadmap-title"
          className="w-full bg-white rounded-[24px] p-4.5 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[10px] bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-sm shrink-0">
              <FiCode />
            </span>
            <h2
              id="card-roadmap-title"
              className="text-sm font-black text-[#181A1E]"
            >
              Adoption & Future Scope
            </h2>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px]">
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Rollout Pathway:</strong>
              Prototype testing on active sites → Pilot feedback → Expansion
              with builders & skill programs.
            </div>
            <div className="p-2 rounded-[12px] bg-[#FFF5EE] text-[#555A64]">
              <strong className="text-[#181A1E] block">Future Scope:</strong>
              Electrical, plumbing, masonry, welding • More Indian languages •
              Computer vision defect checks • 3D BIM integration.
            </div>
          </div>
        </section>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs font-semibold text-[#8C939F] pt-4 pb-4">
          ShramPark • Construction Worker Training & Skill Platform
        </p>
      </main>
    </div>
  );
}
