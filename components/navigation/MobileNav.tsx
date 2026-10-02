"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaHardHat, FaCamera } from "react-icons/fa";
import { MdConstruction, MdEngineering } from "react-icons/md";
import {
  FiMenu,
  FiX,
  FiArrowRight,
  FiHelpCircle,
  FiLogOut,
  FiLogIn,
  FiUser,
  FiHome,
} from "react-icons/fi";

export const MobileNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userRole = ((session?.user as any)?.role || "").toLowerCase();
  const isEngineer = userRole === "engineer";

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: <FiHome className="text-lg shrink-0" />,
    },
    {
      label: "SiteVision",
      path: "/sitevision",
      icon: <FaCamera className="text-base text-[#F06529] shrink-0" />,
    },
    ...(isEngineer
      ? [
          {
            label: "Raghav AI",
            path: "/raghav",
            icon: <MdEngineering className="text-lg shrink-0" />,
          },
        ]
      : []),
    {
      label: "About",
      path: "/about",
      icon: <MdConstruction className="text-lg shrink-0" />,
    },
    {
      label: "FAQ",
      path: "/faq",
      icon: <FiHelpCircle className="text-lg shrink-0" />,
    },
  ];

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ callbackUrl: "/auth" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#F06529]/15 shadow-[0_4px_16px_rgba(240,101,41,0.06)]">
        <div className="w-full max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div
            onClick={() => handleNavigate("/")}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-[14px] bg-[#F06529] shadow-[3px_5px_12px_rgba(240,101,41,0.38),inset_1.5px_1.5px_3px_rgba(255,255,255,0.55),inset_-1.5px_-1.5px_3px_rgba(160,45,10,0.35)] flex items-center justify-center text-white text-xl shrink-0">
              <FaHardHat className="drop-shadow-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#181A1E] block leading-none">
                ShramPark
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-[#F06529] uppercase tracking-wider">
                Civil Engineering & Skills
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`px-3.5 py-2 rounded-[14px] flex items-center gap-2 text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#F06529] text-white shadow-[2px_4px_10px_rgba(240,101,41,0.35),inset_1px_1px_2px_rgba(255,255,255,0.4)]"
                      : "bg-transparent hover:bg-[#FFF5EE] text-[#4B5563] hover:text-[#181A1E]"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-[#F06529]"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {userRole && (
                  <span className="px-3 py-1 rounded-full bg-[#FFF4EE] border border-[#F06529]/20 text-[#F06529] text-xs font-black uppercase tracking-wider">
                    {userRole}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleNavigate("/profile")}
                  className={`flex items-center gap-2.5 py-1.5 px-3 rounded-[16px] transition-all cursor-pointer border ${
                    pathname === "/profile"
                      ? "bg-[#FFF4EE] border-[#F06529] shadow-sm"
                      : "bg-white hover:bg-[#FFF9F5] border-[#F06529]/20 shadow-[0_2px_8px_rgba(240,101,41,0.06)]"
                  }`}
                >
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/user/avatar?url=${encodeURIComponent(session.user.image)}`}
                      alt={session.user.name || "User"}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-7 h-7 rounded-full object-cover border border-[#F06529]/30 shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#F06529] text-white flex items-center justify-center text-xs font-black shrink-0">
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}
                  <span className="text-xs font-bold text-[#181A1E] max-w-[120px] truncate">
                    {session?.user?.name || "Profile"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="w-9 h-9 rounded-[14px] bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                >
                  <FiLogOut className="text-base" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigate("/auth")}
                className="py-2 px-4 rounded-[16px] bg-[#F06529] hover:bg-[#E05519] active:scale-[0.98] text-white text-xs lg:text-sm font-extrabold shadow-[2px_4px_12px_rgba(240,101,41,0.32),inset_1.5px_1.5px_3px_rgba(255,255,255,0.4)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiLogIn className="text-base" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && userRole && (
              <span className="hidden xs:inline-block px-2.5 py-1 rounded-full bg-[#FFF4EE] border border-[#F06529]/20 text-[#F06529] text-[11px] font-bold uppercase tracking-wider">
                {userRole}
              </span>
            )}

            <button
              type="button"
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-[14px] bg-white hover:bg-[#FFF5EE] active:scale-[0.95] text-[#181A1E] flex items-center justify-center shadow-[3px_5px_14px_rgba(240,101,41,0.12),inset_1.5px_1.5px_3px_rgba(255,255,255,1),inset_-1.5px_-1.5px_3px_rgba(240,101,41,0.08)] border border-[#F06529]/20 transition-all cursor-pointer"
            >
              {isOpen ? (
                <FiX className="text-xl text-[#F06529] stroke-[2.5]" />
              ) : (
                <FiMenu className="text-xl text-[#181A1E] stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-start pt-16">
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
          />

          <div className="relative z-10 w-full max-w-md mx-auto px-4 pt-2">
            <div className="w-full bg-white rounded-[28px] p-5 shadow-[0_20px_40px_rgba(240,101,41,0.15),inset_2px_2px_4px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(240,101,41,0.08)] border border-[#F06529]/20 flex flex-col gap-2 animate-in slide-in-from-top-4 duration-200">
              {isAuthenticated && (
                <div
                  onClick={() => handleNavigate("/profile")}
                  className="mb-2 p-3 rounded-[18px] bg-[#FFF8F4] border border-[#F06529]/15 flex items-center justify-between cursor-pointer hover:bg-[#FFF3EC] transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {session?.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/user/avatar?url=${encodeURIComponent(session.user.image)}`}
                        alt={session.user.name || "User"}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-8 h-8 rounded-full object-cover border border-[#F06529]/30 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#F06529] text-white flex items-center justify-center text-sm font-black shrink-0">
                        {session?.user?.name
                          ? session.user.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-[#181A1E] truncate">
                        {session?.user?.name || "Civil Professional"}
                      </p>
                      <p className="text-[10px] text-[#717682] truncate">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>
                  {userRole && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F06529]/15 text-[#F06529] shrink-0">
                      {userRole}
                    </span>
                  )}
                </div>
              )}

              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full py-3.5 px-4 rounded-[20px] flex items-center justify-between font-extrabold text-sm transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#F06529] text-white shadow-[4px_6px_14px_rgba(240,101,41,0.38),inset_1.5px_1.5px_3px_rgba(255,255,255,0.5),inset_-1.5px_-1.5px_3px_rgba(150,40,10,0.4)]"
                        : "bg-white hover:bg-[#FFF5EE] text-[#181A1E] shadow-[inset_1px_1px_2px_rgba(240,101,41,0.06)] border border-[#F06529]/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={isActive ? "text-white" : "text-[#F06529]"}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <FiArrowRight
                      className={`text-base ${
                        isActive ? "text-white stroke-[3]" : "text-[#C4B7A7]"
                      }`}
                    />
                  </button>
                );
              })}

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => handleNavigate("/profile")}
                  className={`w-full py-3.5 px-4 rounded-[20px] flex items-center justify-between font-extrabold text-sm transition-all cursor-pointer ${
                    pathname === "/profile"
                      ? "bg-[#F06529] text-white shadow-[4px_6px_14px_rgba(240,101,41,0.38),inset_1.5px_1.5px_3px_rgba(255,255,255,0.5),inset_-1.5px_-1.5px_3px_rgba(150,40,10,0.4)]"
                      : "bg-white hover:bg-[#FFF5EE] text-[#181A1E] shadow-[inset_1px_1px_2px_rgba(240,101,41,0.06)] border border-[#F06529]/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        pathname === "/profile"
                          ? "text-white"
                          : "text-[#F06529]"
                      }
                    >
                      <FiUser className="text-lg shrink-0" />
                    </span>
                    <span>My Profile</span>
                  </div>
                  <FiArrowRight
                    className={`text-base ${
                      pathname === "/profile"
                        ? "text-white stroke-[3]"
                        : "text-[#C4B7A7]"
                    }`}
                  />
                </button>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-3.5 px-4 rounded-[20px] flex items-center justify-between font-extrabold text-sm bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-sm transition-all cursor-pointer mt-1"
                >
                  <div className="flex items-center gap-3">
                    <FiLogOut className="text-lg shrink-0" />
                    <span>Sign Out</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavigate("/auth")}
                  className="w-full py-3.5 px-4 rounded-[20px] flex items-center justify-between font-extrabold text-sm bg-[#F06529] text-white shadow-[4px_6px_14px_rgba(240,101,41,0.38),inset_1.5px_1.5px_3px_rgba(255,255,255,0.5),inset_-1.5px_-1.5px_3px_rgba(150,40,10,0.4)] transition-all cursor-pointer mt-1"
                >
                  <div className="flex items-center gap-3">
                    <FiLogIn className="text-lg shrink-0" />
                    <span>Sign In</span>
                  </div>
                  <FiArrowRight className="text-base text-white stroke-[3]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
