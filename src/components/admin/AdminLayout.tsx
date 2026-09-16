"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { QuickAddModal } from "./QuickAddModal";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddTab, setQuickAddTab] = useState<"lead" | "call" | "followup">("lead");
  const [authChecking, setAuthChecking] = useState(true);

  // Skip auth check if currently on the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecking(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (!res.ok) {
          router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
        } else {
          setAuthChecking(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
      }
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  // If on login page, just render children without sidebar/header
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 animate-bounce">
          H
        </div>
        <p className="mt-4 text-xs font-bold text-slate-600 tracking-wider uppercase animate-pulse">
          Loading Command Center...
        </p>
      </div>
    );
  }

  const handleOpenQuickAdd = (initialTab: "lead" | "call" | "followup" = "lead") => {
    setQuickAddTab(initialTab);
    setQuickAddOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen transition-all">
        {/* Header */}
        <AdminHeader
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenQuickAdd={handleOpenQuickAdd}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Quick Add Action Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        defaultTab={quickAddTab}
        onClose={() => setQuickAddOpen(false)}
        onSuccess={() => {
          // Trigger a soft refresh across components
          router.refresh();
        }}
      />
    </div>
  );
}
