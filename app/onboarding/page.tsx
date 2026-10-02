"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MdManageAccounts, MdEngineering } from "react-icons/md";
import { FiCheck, FiArrowRight } from "react-icons/fi";

type RoleKey = "supervisor" | "engineer";

interface RoleOption {
  id: RoleKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLES: RoleOption[] = [
  {
    id: "supervisor",
    title: "Supervisor",
    description: "Site management, safety supervision & visual field audits",
    icon: MdManageAccounts,
  },
  {
    id: "engineer",
    title: "Engineer",
    description: "Structural derivations, IS calculations & offline AI analysis",
    icon: MdEngineering,
  },
];

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleKey>("supervisor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If user already has a role permanently assigned, redirect immediately
  React.useEffect(() => {
    const existingRole = ((session?.user as any)?.role || "").toLowerCase();
    if (existingRole) {
      router.replace("/profile");
    }
  }, [session, router]);

  const handleSubmitRole = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }

      if (update) {
        await update({ role: selectedRole });
      }

      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      console.error("Error setting role:", err);
      setErrorMessage(
        err.message || "Failed to save selected role. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 antialiased my-auto">
      <main className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto my-auto flex flex-col items-center gap-8 py-6">
        {/* Title */}
        <div className="flex flex-col items-center text-center gap-2 max-w-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#181A1E]">
            Choose Your Role
          </h1>
          <p className="text-xs sm:text-base text-[#555A64] font-medium leading-relaxed">
            Select your designation to customize your workspace
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full py-2.5 px-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {/* 2 Roles Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative rounded-[24px] p-6 flex flex-col items-center justify-center text-center gap-4 transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#FFF9F5] border-2 border-[#F06529] shadow-[0_12px_28px_rgba(240,101,41,0.18),inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(240,101,41,0.08)] scale-[1.02]"
                    : "bg-white border border-[#F06529]/15 hover:border-[#F06529]/40 shadow-[0_8px_20px_rgba(240,101,41,0.06),inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(240,101,41,0.05)] hover:shadow-[0_12px_24px_rgba(240,101,41,0.1)]"
                }`}
              >
                {/* Selection Check Circle */}
                <div
                  className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isSelected
                      ? "bg-[#F06529] text-white shadow-[0_2px_5px_rgba(240,101,41,0.4)]"
                      : "border border-[#D1D5DB] bg-white"
                  }`}
                >
                  {isSelected && <FiCheck className="stroke-[3]" />}
                </div>

                {/* Role Icon */}
                <div
                  className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-2xl transition-all ${
                    isSelected
                      ? "bg-[#F06529] text-white shadow-[4px_8px_16px_rgba(240,101,41,0.35),inset_2px_2px_4px_rgba(255,255,255,0.4)]"
                      : "bg-[#FFF4EE] text-[#F06529] border border-[#F06529]/20 shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,0.8),inset_-1.5px_-1.5px_3px_rgba(240,101,41,0.08)]"
                  }`}
                >
                  <Icon />
                </div>

                {/* Precise Role Name & Description */}
                <div>
                  <h2 className="text-lg font-black text-[#181A1E]">
                    {role.title}
                  </h2>
                  <p className="text-xs text-[#555A64] font-medium mt-1">
                    {role.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation Button */}
        <div className="w-full max-w-sm flex flex-col items-center gap-2 pt-1">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitRole}
            className="w-full min-h-[52px] py-3.5 px-6 rounded-[22px] bg-[#F06529] hover:bg-[#E05519] active:scale-[0.98] text-white font-extrabold text-sm sm:text-base shadow-[4px_10px_24px_rgba(240,101,41,0.36),inset_2.5px_2.5px_5px_rgba(255,255,255,0.4),inset_-2.5px_-2.5px_5px_rgba(160,45,10,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            <span>{isSubmitting ? "Saving..." : "Continue"}</span>
            {!isSubmitting && <FiArrowRight className="text-lg" />}
          </button>
        </div>
      </main>
    </div>
  );
}
