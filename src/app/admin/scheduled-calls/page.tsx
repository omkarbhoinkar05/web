"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ScheduledCall } from "@/lib/admin/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { QuickAddModal } from "@/components/admin/QuickAddModal";

type CallStatus = ScheduledCall["status"];

export default function ScheduledCallsPage() {
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCalls = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/scheduled-calls?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCalls(data.calls || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const handleUpdateStatus = async (id: string, status: CallStatus) => {
    try {
      const res = await fetch("/api/admin/scheduled-calls", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setCalls((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Scheduled Client Consultations
          </h1>
          <p className="text-xs text-slate-500">
            Discovery sessions and tech scoping meetings booked by prospective clients ({calls.length} calls)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Book New Call</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: "", label: "All Consultations" },
          { id: "Pending", label: "Pending Verification" },
          { id: "Confirmed", label: "Confirmed" },
          { id: "Completed", label: "Completed" },
          { id: "Cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              statusFilter === tab.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calls List / Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading consultations...
          </div>
        ) : calls.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800">No scheduled calls found</h3>
            <p className="text-xs text-slate-500 mt-1">Clients who book through the website popup will appear here.</p>
          </div>
        ) : (
          calls.map((call) => (
            <div
              key={call.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-black uppercase">
                    {new Date(call.date).toLocaleDateString([], { month: "short" })}
                  </span>
                  <span className="text-base font-black leading-none">
                    {new Date(call.date).getDate()}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{call.fullName}</h3>
                    <span className="text-xs font-semibold text-slate-500 font-mono">
                      &bull; {call.callId}
                    </span>
                    <StatusBadge status={call.status} />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {call.service}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-bold text-slate-700">⏰ {call.time}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span>✉️ {call.email}</span>
                    {call.mobile && (
                      <>
                        <span className="text-slate-400">&bull;</span>
                        <span>📞 {call.mobile}</span>
                      </>
                    )}
                  </div>

                  {call.notes && (
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      &ldquo;{call.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                {call.leadId && (
                  <Link
                    href={`/admin/leads/${call.leadId}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    View Lead
                  </Link>
                )}

                {call.status === "Pending" && (
                  <button
                    onClick={() => handleUpdateStatus(call.id, "Confirmed")}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm Call
                  </button>
                )}

                {call.status === "Confirmed" && (
                  <button
                    onClick={() => handleUpdateStatus(call.id, "Completed")}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Mark Done
                  </button>
                )}

                {call.status !== "Cancelled" && call.status !== "Completed" && (
                  <button
                    onClick={() => handleUpdateStatus(call.id, "Cancelled")}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <QuickAddModal
        isOpen={showAddModal}
        defaultTab="call"
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchCalls();
        }}
      />
    </div>
  );
}
