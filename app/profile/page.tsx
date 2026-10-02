"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { MdManageAccounts, MdEngineering, MdVerified } from "react-icons/md";
import { FiLogOut, FiMail } from "react-icons/fi";

const ROLES: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  supervisor: { label: "Supervisor", icon: MdManageAccounts },
  engineer: { label: "Engineer", icon: MdEngineering },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-6 text-sm font-semibold text-[#8C93A0]">
        Loading profile...
      </div>
    );
  }

  const roleKey = ((session?.user as any)?.role || "supervisor").toLowerCase();
  const role = ROLES[roleKey] || ROLES.supervisor;
  const RoleIcon = role.icon;

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 antialiased my-auto min-h-[calc(100vh-80px)]">
      <main className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto my-auto">
        <div className="w-full bg-white rounded-[32px] p-6 sm:p-9 shadow-[0_16px_36px_rgba(240,101,41,0.1),0_4px_12px_rgba(0,0,0,0.03),inset_2.5px_2.5px_5px_rgba(255,255,255,1),inset_-2.5px_-2.5px_5px_rgba(240,101,41,0.06)] border border-[#F06529]/15 flex flex-col items-center text-center gap-5">
          
          {/* Avatar with Role Badge */}
          <div className="relative">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/user/avatar?url=${encodeURIComponent(session.user.image)}`}
                alt={session.user.name || "User"}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-24 h-24 rounded-[26px] object-cover border-2 border-[#F06529]/30 shadow-[4px_8px_20px_rgba(240,101,41,0.2)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes("/api/user/avatar") && session?.user?.image) {
                    target.src = session.user.image;
                  }
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-[26px] bg-[#F06529] shadow-[6px_10px_22px_rgba(240,101,41,0.38),inset_3px_3px_6px_rgba(255,255,255,0.55),inset_-3px_-3px_6px_rgba(160,45,10,0.35)] flex items-center justify-center text-white text-3xl font-black">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-[11px] bg-white border border-[#F06529]/20 shadow-md flex items-center justify-center text-[#F06529] text-base">
              <RoleIcon />
            </div>
          </div>

          {/* User Name & Email */}
          <div className="flex flex-col items-center gap-1 w-full">
            <h1 className="text-2xl font-black text-[#181A1E] truncate max-w-full">
              {session?.user?.name || "Civil Professional"}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#555A64] font-medium truncate max-w-full">
              <FiMail className="text-sm shrink-0" />
              <span className="truncate">{session?.user?.email || "No email available"}</span>
            </div>
          </div>

          {/* Role / Designation Card */}
          <div className="w-full p-4 rounded-[22px] bg-[#FFF8F4] border border-[#F06529]/15 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-[#F06529] text-white flex items-center justify-center text-xl shadow-[2px_4px_10px_rgba(240,101,41,0.3)] shrink-0">
                <RoleIcon />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8C93A0] uppercase tracking-wider">
                  Role
                </p>
                <p className="text-base font-black text-[#181A1E]">
                  {role.label}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <MdVerified className="text-sm" /> Verified
            </span>
          </div>

          {/* Quick Actions: Logout */}
          <div className="w-full pt-2">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/auth" })}
              className="w-full min-h-[50px] py-3 px-4 rounded-[20px] bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-600 font-extrabold text-sm border border-red-200 shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FiLogOut className="text-base" />
              <span>Sign out</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
