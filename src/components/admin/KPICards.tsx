import React from "react";
import { DashboardStats } from "@/lib/admin/types";

interface KPICardsProps {
  stats: DashboardStats;
}

export function KPICards({ stats }: KPICardsProps) {
  const cards = [
    {
      title: "Total Leads",
      value: stats.totalLeads.toLocaleString(),
      subtitle: "All enquiries",
      trend: stats.totalLeadsTrend,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "New Leads",
      value: stats.newLeadsToday.toLocaleString(),
      subtitle: "Today",
      trend: stats.newLeadsTrend,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      title: "Follow-ups",
      value: stats.followUpsDueToday.toLocaleString(),
      subtitle: "Due today",
      trend: stats.followUpsTrend,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: "Scheduled Calls",
      value: stats.scheduledCallsUpcoming.toLocaleString(),
      subtitle: "Upcoming",
      trend: stats.scheduledCallsTrend,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      title: "Won Leads",
      value: stats.wonLeadsMonth.toLocaleString(),
      subtitle: "This month",
      trend: stats.wonLeadsTrend,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
          <path d="M6 5h12v5a6 6 0 0 1-12 0V5z" />
        </svg>
      ),
    },
    {
      title: "Career Applications",
      value: stats.careerApplications.toLocaleString(),
      subtitle: "New applications",
      trend: stats.careerApplicationsTrend,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="relative p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col justify-between"
        >
          {/* Top Row: Icon + Trend */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              {card.icon}
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              {card.trend}
            </span>
          </div>

          {/* Number + Label */}
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
              {card.value}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xs font-bold text-slate-700">{card.title}</span>
              <span className="text-[11px] text-slate-400">{card.subtitle}</span>
            </div>
          </div>

          {/* Subtle Bottom Emerald Accent Bar */}
          <div className="mt-3.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-2/3 group-hover:w-full transition-all duration-500" />
          </div>
        </div>
      ))}
    </div>
  );
}
