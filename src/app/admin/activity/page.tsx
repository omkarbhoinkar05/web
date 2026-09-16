"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { LeadActivity } from "@/lib/admin/types";

export default function ActivityStreamPage() {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/activity?limit=50");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Activity Audit Stream
          </h1>
          <p className="text-xs text-slate-500">
            Real-time chronological log of system actions, stage updates, notes, and inquiries
          </p>
        </div>

        <button
          onClick={fetchActivities}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh activities"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
        </button>
      </div>

      {/* Activity Timeline Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading activity stream...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No activity records recorded yet.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white shadow-2xs" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{act.type}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-md">
                      {act.actor || "System"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {act.date} {act.time}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {act.description}
                </p>

                {act.leadId && (
                  <div className="mt-2">
                    <Link
                      href={`/admin/leads/${act.leadId}`}
                      className="inline-block text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      View Associated Lead File →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
