"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MdManageAccounts, MdEngineering, MdVerified } from "react-icons/md";
import { FiMail, FiArrowLeft, FiShield } from "react-icons/fi";

const ROLES: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  supervisor: { label: "Supervisor", icon: MdManageAccounts },
  engineer: { label: "Engineer", icon: MdEngineering },
};

export default function UserPublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [userProfile, setUserProfile] = useState<{
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/${encodeURIComponent(id)}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Civil professional profile not found.");
        }

        setUserProfile(data.user);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 w-full min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-stone-400 gap-3">
        <div className="w-10 h-10 border-3 border-[#F06529] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-stone-600">Loading professional profile...</p>
      </div>
    );
  }

  if (errorMsg || !userProfile) {
    return (
      <div className="flex-1 w-full min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center text-2xl border border-amber-200">
            <FiShield />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Profile Not Found</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            {errorMsg || "The requested profile could not be located in the system."}
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#F06529] text-white text-xs font-bold hover:bg-[#D9531E] transition mt-2"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const roleKey = (userProfile.role || "supervisor").toLowerCase();
  const role = ROLES[roleKey] || ROLES.supervisor;
  const RoleIcon = role.icon;

  return (
    <div className="flex-1 w-full min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-12 antialiased">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8C7A70] hover:text-[#2B231D] transition"
          >
            <FiArrowLeft className="text-sm" />
            <span>Home</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="w-full bg-white rounded-[28px] p-6 sm:p-10 shadow-[0_16px_36px_rgba(240,101,41,0.08)] border border-[#EBE3D5] flex flex-col items-center text-center gap-6">
          <div className="relative">
            {userProfile.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/user/avatar?url=${encodeURIComponent(userProfile.image)}`}
                alt={userProfile.name}
                className="w-24 h-24 rounded-[24px] object-cover border-2 border-[#F06529]/30 shadow-[4px_8px_20px_rgba(240,101,41,0.18)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes("/api/user/avatar") && userProfile.image) {
                    target.src = userProfile.image;
                  }
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-[24px] bg-[#F06529] shadow-md flex items-center justify-center text-white text-3xl font-black">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-[11px] bg-white border border-[#F06529]/20 shadow-md flex items-center justify-center text-[#F06529] text-base">
              <RoleIcon />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 w-full">
            <h1 className="text-2xl font-black text-[#181A1E] truncate max-w-full">
              {userProfile.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium truncate max-w-full">
              <FiMail className="text-xs shrink-0" />
              <span className="truncate">{userProfile.email}</span>
            </div>
          </div>

          <div className="w-full max-w-sm p-4 rounded-[20px] bg-[#FFF8F4] border border-[#F06529]/15 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-[#F06529] text-white flex items-center justify-center text-xl shadow-[2px_4px_10px_rgba(240,101,41,0.25)] shrink-0">
                <RoleIcon />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8C93A0] uppercase tracking-wider">
                  Designation
                </p>
                <p className="text-base font-black text-[#181A1E]">
                  {role.label}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <MdVerified className="text-sm shrink-0" /> Verified
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
