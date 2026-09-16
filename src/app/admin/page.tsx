"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { KPICards } from "@/components/admin/KPICards";
import { LeadPipelineBoard } from "@/components/admin/LeadPipelineBoard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SourceDonutChart, ServiceBarChart } from "@/components/admin/Charts";
import { DashboardStats, Lead, ScheduledCall, FollowUp, LeadActivity } from "@/lib/admin/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [upcomingCalls, setUpcomingCalls] = useState<ScheduledCall[]>([]);
  const [todayFollowUps, setTodayFollowUps] = useState<FollowUp[]>([]);
  const [recentActivity, setRecentActivity] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes, callsRes, followUpsRes, activityRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/leads?limit=6"),
        fetch("/api/admin/scheduled-calls?status=Confirmed&limit=4"),
        fetch("/api/admin/follow-ups?tab=Today&limit=5"),
        fetch("/api/admin/activity?limit=6"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats || data);
      }
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setRecentLeads(data.leads || []);
      }
      if (callsRes.ok) {
        const data = await callsRes.json();
        setUpcomingCalls(data.calls || []);
      }
      if (followUpsRes.ok) {
        const data = await followUpsRes.json();
        setTodayFollowUps(data.followUps || []);
      }
      if (activityRes.ok) {
        const data = await activityRes.json();
        setRecentActivity(data.activities || []);
      }
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Mark follow-up as completed
  const handleCompleteFollowUp = async (id: string) => {
    try {
      const res = await fetch("/api/admin/follow-ups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Completed" }),
      });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Greeting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-[#064e3b] to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Operational Center</span>
            <span>&bull;</span>
            <span>{currentDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {getGreeting()}, Admin 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
            Welcome to the HighTechBirds command center. Monitor leads, pipelines, scheduled client consultations, and business revenue metrics in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/pipeline"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all backdrop-blur-xs flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            <span>Pipeline Board</span>
          </Link>
          <Link
            href="/admin/leads"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Manage Leads</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards */}
      {stats && <KPICards stats={stats} />}

      {/* 3. Horizontal Lead Pipeline Status Board */}
      {stats && <LeadPipelineBoard pipelineCounts={stats.pipelineCounts} />}

      {/* 4. Follow-up Overview & Upcoming Calls (2 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follow-up Overview Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Follow-up Task Overview</h2>
              <p className="text-xs text-slate-500">Scheduled client touchpoints & commitments</p>
            </div>
            <Link
              href="/admin/follow-ups"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Open Center →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block">
                Overdue
              </span>
              <span className="text-2xl font-black text-rose-800 block mt-0.5">
                {stats?.followUpCounts.overdue || 0}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                Today
              </span>
              <span className="text-2xl font-black text-amber-800 block mt-0.5">
                {stats?.followUpCounts.today || 0}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                Upcoming
              </span>
              <span className="text-2xl font-black text-teal-800 block mt-0.5">
                {stats?.followUpCounts.upcoming || 0}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                Completed
              </span>
              <span className="text-2xl font-black text-emerald-800 block mt-0.5">
                {stats?.followUpCounts.completed || 0}
              </span>
            </div>
          </div>

          {/* Today's immediate items list */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Today&#39;s Scheduled Actions
            </span>
            {todayFollowUps.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                No pending follow-ups for today 🎉
              </div>
            ) : (
              todayFollowUps.map((fu) => (
                <div
                  key={fu.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCompleteFollowUp(fu.id)}
                      className="w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-transparent hover:text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Mark as done"
                    >
                      ✓
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{fu.leadName}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
                          {fu.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{fu.notes}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 shrink-0">
                    {fu.time || "Today"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Scheduled Calls Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Scheduled Calls</h2>
              <p className="text-xs text-slate-500">Confirmed client consultations</p>
            </div>
            <Link
              href="/admin/scheduled-calls"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              All Calls ({stats?.scheduledCallsUpcoming || 0}) →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingCalls.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                No upcoming scheduled calls booked.
              </div>
            ) : (
              upcomingCalls.map((call) => (
                <div
                  key={call.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/40 to-teal-50/20 border border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{call.fullName}</span>
                        {call.mobile && (
                          <span className="text-[10px] text-slate-500 font-medium">&bull; {call.mobile}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-emerald-800">{call.service}</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {call.date} at {call.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <StatusBadge status={call.status} />
                    <Link
                      href={`/admin/scheduled-calls`}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-colors"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. Analytics Charts (Donut + Bar in Emerald & Teal) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source Donut */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Leads by Acquisition Channel</h2>
            <p className="text-xs text-slate-500">Distribution of prospective client inquiries</p>
          </div>
          {stats?.leadsBySource && (
            <SourceDonutChart data={stats.leadsBySource} totalLeads={stats.totalLeads} />
          )}
        </div>

        {/* Most Requested Services Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Most In-Demand Services</h2>
            <p className="text-xs text-slate-500">Lead inquiries broken down by requested solution</p>
          </div>
          {stats?.mostRequestedServices && (
            <ServiceBarChart services={stats.mostRequestedServices} />
          )}
        </div>
      </div>

      {/* 6. Recent Leads Table & Real-time Activity Timeline (2 Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Lead Inquiries</h2>
                <p className="text-xs text-slate-500">Latest potential clients entering the CRM</p>
              </div>
              <Link
                href="/admin/leads"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                View CRM ({stats?.totalLeads || 0}) →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 pr-4">Lead / Client</th>
                    <th className="py-2.5 px-3">Service</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Budget</th>
                    <th className="py-2.5 pl-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {recentLeads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No leads recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="font-bold text-slate-900">{lead.fullName}</div>
                          <div className="text-[11px] text-slate-500">{lead.email} &bull; {lead.mobile}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-700">{lead.service}</span>
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {lead.budget ? lead.budget : "—"}
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
            >
              Browse Full HighTechBirds Leads CRM Directory →
            </Link>
          </div>
        </div>

        {/* Real-time Activity Timeline (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Activity Stream</h2>
                <p className="text-xs text-slate-500">Operational audit logs</p>
              </div>
              <Link
                href="/admin/activity"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                All →
              </Link>
            </div>

            <div className="relative pl-4 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-1.5 before:w-0.5 before:bg-slate-200">
              {recentActivity.length === 0 ? (
                <div className="py-6 text-xs text-slate-400">No activity yet.</div>
              ) : (
                recentActivity.map((act) => (
                  <div key={act.id} className="relative group">
                    <span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <div className="text-xs font-bold text-slate-800">{act.type}</div>
                    <div className="text-[11px] text-slate-600 leading-snug">{act.description}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      {act.time}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <Link
              href="/admin/activity"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Open Audit Log History →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
