"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaHardHat } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/onboarding";
  const authError = searchParams.get("error");

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        callbackUrl,
      });
    } catch (err) {
      console.error("Sign in failed:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-6 antialiased my-auto">
      {/* Centered Minimal Container */}
      <main className="w-full max-w-sm sm:max-w-md mx-auto my-auto flex flex-col items-center">
        {/* Single Clay Card containing all auth information and action */}
        <div className="w-full bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_16px_36px_rgba(240,101,41,0.1),0_4px_12px_rgba(0,0,0,0.03),inset_2.5px_2.5px_5px_rgba(255,255,255,1),inset_-2.5px_-2.5px_5px_rgba(240,101,41,0.06)] border border-[#F06529]/15 flex flex-col items-center text-center gap-6">
          {/* Construction Brand Emblem */}
          <div
            aria-label="ShramPark Construction Hardhat"
            className="w-16 h-16 rounded-[22px] bg-[#F06529] shadow-[6px_10px_22px_rgba(240,101,41,0.38),-4px_-4px_12px_#FFFFFF,inset_3px_3px_6px_rgba(255,255,255,0.55),inset_-3px_-3px_6px_rgba(160,45,10,0.35)] flex items-center justify-center text-white text-3xl shrink-0"
          >
            <FaHardHat className="drop-shadow-sm" />
          </div>

          {/* Minimal App Title & Clear Prompt */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl sm:text-3xl font-black  text-[#181A1E]">
              ShramPark
            </h1>
            <p className="text-xs sm:text-sm text-[#555A64] font-medium leading-relaxed max-w-xs mt-1">
              Sign in with your Google account to access site training, safety
              modules, and practical skills.
            </p>
          </div>

          {/* Error Notice if any */}
          {authError && (
            <div className="w-full py-2.5 px-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              Authentication failed. Please try again.
            </div>
          )}

          {/* Tactile Puffy Clay Google OAuth Button */}
          <div className="w-full pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleAuth}
              className="w-full min-h-[54px] py-3.5 px-5 rounded-[22px] bg-white hover:bg-[#FFF9F5] active:scale-[0.98] text-[#181A1E] font-extrabold text-sm sm:text-base shadow-[4px_8px_20px_rgba(240,101,41,0.12),0_2px_6px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(240,101,41,0.08)] border border-[#F06529]/25 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
            >
              <FcGoogle className="text-2xl shrink-0" />
              <span>
                {isLoading ? "Connecting to Google..." : "Continue with Google"}
              </span>
            </button>
          </div>

          <p className="text-[11px] text-[#8C93A0] leading-tight">
            By continuing, you agree to adhere to civil construction site
            protocols and safety standards.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-[#8C93A0]">
          Loading...
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
