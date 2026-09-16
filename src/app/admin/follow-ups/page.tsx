"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FollowUp } from "@/lib/admin/types";
import { QuickAddModal } from "@/components/admin/QuickAddModal";

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Overdue" | "Today" | "Upcoming" | "Completed">("All");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchFollowUps = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/follow-ups?tab=${activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setFollowUps(data.followUps || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completed" ? "Upcoming" : "Completed";
    try {
      const res = await fetch("/api/admin/follow-ups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchFollowUps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: "All", label: "All Tasks" },
    { id: "Overdue", label: "Overdue ⚠️" },
    { id: "Today", label: "Today's Focus 🎯" },
    { id: "Upcoming", label: "Upcoming" },
    { id: "Completed", label: "Completed" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Follow-Up Tasks & Touchpoints
          </h1>
          <p className="text-xs text-slate-500">
            Keep commitments, maintain consistent client communication, and prevent pipeline leakage
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Follow-up Tasks List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading follow-up tasks...
          </div>
        ) : followUps.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-xs font-semibold">No follow-ups found in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {followUps.map((fu) => {
              const isCompleted = fu.status === "Completed";
              const isOverdue =
                !isCompleted &&
                new Date(fu.date).setHours(0, 0, 0, 0) <
                  new Date().setHours(0, 0, 0, 0);

              return (
                <div
                  key={fu.id}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors ${
                    isCompleted ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox button */}
                    <button
                      onClick={() => handleToggleComplete(fu.id, fu.status)}
                      className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-emerald-500 text-transparent"
                      }`}
                      title={isCompleted ? "Mark as pending" : "Mark as completed"}
                    >
                      ✓
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/admin/leads/${fu.leadId}`}
                          className={`text-xs font-bold text-slate-900 hover:text-emerald-700 ${
                            isCompleted ? "line-through text-slate-500" : ""
                          }`}
                        >
                          {fu.leadName}
                        </Link>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {fu.type}
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                            Overdue
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {fu.notes}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                        <span>
                          📅 Due: {fu.date} {fu.time ? `at ${fu.time}` : ""}
                        </span>
                        {fu.assignedTo && <span>&bull; Assigned to: {fu.assignedTo}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/leads/${fu.leadId}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                    >
                      View Lead
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <QuickAddModal
        isOpen={showAddModal}
        defaultTab="followup"
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchFollowUps();
        }}
      />
    </div>
  );
}
