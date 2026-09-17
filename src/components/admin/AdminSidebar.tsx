"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Sales" | "HR" | "Support";
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  user?: SessionUser | null;
}

export function AdminSidebar({ mobileOpen, setMobileOpen, user: propUser }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(propUser || null);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      // Fetch session user if not passed from parent
      fetch("/api/admin/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.authenticated && data?.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [propUser]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const role = user?.role || "Super Admin";

  const allNavGroups = [
    {
      group: "MAIN",
      items: [
        {
          name: "Dashboard",
          href: "/admin",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
          ),
        },
      ],
    },
    {
      group: "LEADS",
      items: [
        {
          name: "All Leads",
          href: "/admin/leads",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        },
        {
          name: "Contact Enquiries",
          href: "/admin/contact-enquiries",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          ),
        },
        {
          name: "Scheduled Calls",
          href: "/admin/scheduled-calls",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          ),
        },
        {
          name: "Follow-ups",
          href: "/admin/follow-ups",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          ),
        },
        {
          name: "Pipeline",
          href: "/admin/pipeline",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          ),
        },
      ],
    },
    {
      group: "CAREERS",
      items: [
        {
          name: "Applications",
          href: "/admin/career-applications",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          ),
        },
      ],
    },
    {
      group: "COMMUNICATION",
      items: [
        {
          name: "Activity",
          href: "/admin/activity",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          ),
        },
      ],
    },
    {
      group: "REPORTS",
      items: [
        {
          name: "Reports & Analytics",
          href: "/admin/reports",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          ),
        },
      ],
    },
    {
      group: "MANAGEMENT",
      items: [
        {
          name: "Team",
          href: "/admin/team",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        },
        {
          name: "Settings",
          href: "/admin/settings",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
      ],
    },
  ];

  // RBAC Navigation Filtering:
  // 1. HR: Only CAREERS (no leads, no dashboard, no team, no settings)
  // 2. Sales: Only MAIN, LEADS, COMMUNICATION (no careers, no reports, no team, no settings)
  // 3. Admin: MAIN, LEADS, CAREERS, COMMUNICATION, REPORTS, and in MANAGEMENT only Settings (no Team creation/management)
  // 4. Super Admin: ALL groups and links
  const navGroups = React.useMemo(() => {
    if (role === "HR") {
      return allNavGroups.filter((g) => g.group === "CAREERS");
    }
    if (role === "Sales") {
      return allNavGroups.filter((g) =>
        g.group === "MAIN" || g.group === "LEADS" || g.group === "COMMUNICATION"
      );
    }
    if (role === "Admin") {
      return allNavGroups.map((g) => {
        if (g.group === "MANAGEMENT") {
          return {
            ...g,
            items: g.items.filter((item) => item.name === "Settings"),
          };
        }
        return g;
      });
    }
    return allNavGroups;
  }, [role]);

  // Derive user initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  const homeHref = role === "HR" ? "/admin/career-applications" : "/admin";

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#053d2f] text-slate-100 flex flex-col border-r border-emerald-950/40 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-emerald-800/40 bg-[#032a20]">
          <Link href={homeHref} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-emerald-500/20">
              W
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block leading-tight">
                Web
              </span>
              <span className="text-[10px] font-medium text-emerald-300/80 tracking-wider uppercase block">
                Ideas | Innovation | Growth
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Role Portal Banner */}
        <div className="px-4 pt-3 pb-1">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
              {role === "HR"
                ? "HR Portal"
                : role === "Sales"
                ? "Sales CRM"
                : role === "Admin"
                ? "Admin Portal"
                : "Super Admin Command"}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 custom-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 px-3 block mb-2">
                {group.group}
              </span>
              <ul className="space-y-1">
                {group.items.map((item, iIdx) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={iIdx}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20"
                            : "text-slate-300 hover:text-white hover:bg-emerald-800/30"
                        }`}
                      >
                        <span className={isActive ? "text-slate-950" : "text-emerald-400"}>
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Profile / Logout Footer */}
        <div className="p-4 border-t border-emerald-800/40 bg-[#032a20]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-300 shrink-0">
                {initials}
              </div>
              <div className="leading-tight truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {user?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-emerald-400/80 block truncate">
                  {user?.role || "Super Admin"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-emerald-400 hover:text-rose-400 hover:bg-emerald-950/40 transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
