"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SourceDonutChart, ServiceBarChart } from "@/components/admin/Charts";

interface ReportResponse {
  range: string;
  metrics: {
    totalLeads: number;
    wonLeads: number;
    lostLeads: number;
    activeLeads: number;
    winRate: string;
    conversionDaysAvg: string;
    scheduledCalls: number;
    completedFollowUps: number;
    overdueFollowUps: number;
  };
  sources: { source: string; count: number }[];
  services: { service: string; count: number }[];
}

export default function ReportsPage() {
  const [range, setRange] = useState("30days");
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/reports?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const ranges = [
    { id: "today", label: "Today" },
    { id: "7days", label: "Past 7 Days" },
    { id: "30days", label: "Past 30 Days" },
    { id: "thisMonth", label: "This Month" },
  ];

  // Calculate percentages for donut chart
  const totalLeads = data?.metrics.totalLeads || 0;
  const donutData = (data?.sources || []).map((s) => ({
    source: s.source,
    count: s.count,
    percentage: totalLeads > 0 ? Math.round((s.count / totalLeads) * 100) : 0,
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Business Analytics & Intelligence
          </h1>
          <p className="text-xs text-slate-500">
            Conversion metrics, revenue pipeline performance, and lead acquisition efficiency
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                range === r.id
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Total Leads Generated
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
            {data?.metrics.totalLeads || 0}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
            Across website & referrals
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Deals Won
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-800 block mt-1">
            {data?.metrics.wonLeads || 0}
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 mt-1 inline-block">
            Closed commercial agreements
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Win Rate Ratio
          </span>
          <span className="text-2xl sm:text-3xl font-black text-teal-800 block mt-1">
            {data?.metrics.winRate || "0%"}
          </span>
          <span className="text-[11px] font-semibold text-teal-700 mt-1 inline-block">
            Proposal to Won conversion
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Scheduled Calls
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
            {data?.metrics.scheduledCalls || 0}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 inline-block">
            Total booked client consultations
          </span>
        </div>
      </div>

      {/* Analytics Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Lead Channel Distribution</h2>
            <p className="text-xs text-slate-500">Inbound sources for the selected period</p>
          </div>
          {data?.sources && (
            <SourceDonutChart
              data={donutData}
              totalLeads={totalLeads}
            />
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">Service Demand Analysis</h2>
            <p className="text-xs text-slate-500">Requested technologies & scopes</p>
          </div>
          {data?.services && (
            <ServiceBarChart services={data.services} />
          )}
        </div>
      </div>
    </div>
  );
}
