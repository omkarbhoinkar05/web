"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Lead, LeadStatus } from "@/lib/admin/types";
import { QuickAddModal } from "@/components/admin/QuickAddModal";

interface PipelineGroup {
  stage: LeadStatus;
  label: string;
  leads: Lead[];
  count: number;
}

export default function PipelinePage() {
  const [groups, setGroups] = useState<PipelineGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const allStages: { id: LeadStatus; label: string }[] = [
    { id: "NEW", label: "New Lead" },
    { id: "CONTACTED", label: "Contacted" },
    { id: "QUALIFIED", label: "Qualified" },
    { id: "REQUIREMENT DISCUSSED", label: "Requirements" },
    { id: "QUOTATION SENT", label: "Quotation Sent" },
    { id: "FOLLOW-UP", label: "Follow-up" },
    { id: "NEGOTIATION", label: "Negotiation" },
    { id: "WON", label: "Won 🎉" },
    { id: "LOST", label: "Lost" },
  ];

  const fetchPipeline = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pipeline");
      if (res.ok) {
        const data = await res.json();
        const pipelineMap = data.pipeline || {};
        const groupList: PipelineGroup[] = allStages.map((s) => ({
          stage: s.id,
          label: s.label,
          leads: pipelineMap[s.id]?.leads || [],
          count: pipelineMap[s.id]?.count || 0,
        }));
        setGroups(groupList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const handleMoveStage = async (leadId: string, targetStage: LeadStatus) => {
    try {
      const res = await fetch("/api/admin/pipeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, newStatus: targetStage }),
      });
      if (res.ok) {
        fetchPipeline();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sales Pipeline Kanban
          </h1>
          <p className="text-xs text-slate-500">
            Visualize customer lifecycle progression and move deals between stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPipeline}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
            title="Refresh Pipeline"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container (Horizontal Scroll) */}
      <div className="overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex gap-4 min-w-max items-start">
          {allStages.map((stageObj, sIdx) => {
            const group = groups.find((g) => g.stage === stageObj.id) || {
              stage: stageObj.id,
              label: stageObj.label,
              leads: [],
              count: 0,
            };

            const isWon = stageObj.id === "WON";
            const isLost = stageObj.id === "LOST";

            return (
              <div
                key={stageObj.id}
                className="w-72 bg-slate-100/70 border border-slate-200/80 rounded-3xl p-3.5 flex flex-col max-h-[calc(100vh-220px)] shadow-2xs"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isWon
                          ? "bg-emerald-500"
                          : isLost
                          ? "bg-rose-500"
                          : "bg-teal-600"
                      }`}
                    />
                    <span className="text-xs font-black text-slate-800 tracking-tight">
                      {stageObj.label}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-700 text-[11px] font-black shadow-2xs border border-slate-200">
                    {group.count}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                  {loading ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      Loading...
                    </div>
                  ) : group.leads.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                      Empty stage
                    </div>
                  ) : (
                    group.leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="font-bold text-xs text-slate-900 hover:text-emerald-700 leading-tight block"
                          >
                            {lead.fullName}
                          </Link>
                          {lead.budget && (
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                              {lead.budget}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 mb-1 truncate">
                          {lead.leadId} &bull; {lead.mobile}
                        </div>

                        <div className="text-[11px] font-medium text-slate-600 mb-3">
                          {lead.service}
                        </div>

                        {/* Card Footer: Quick Stage Navigator */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            disabled={sIdx === 0}
                            onClick={() => handleMoveStage(lead.id, allStages[sIdx - 1].id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 cursor-pointer text-xs"
                            title="Move Left"
                          >
                            ◀
                          </button>

                          <select
                            value={lead.status}
                            onChange={(e) => handleMoveStage(lead.id, e.target.value as LeadStatus)}
                            className="text-[10px] font-bold text-slate-500 bg-slate-50 rounded-lg px-2 py-1 border border-slate-200 cursor-pointer outline-hidden"
                          >
                            {allStages.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>

                          <button
                            disabled={sIdx === allStages.length - 1}
                            onClick={() => handleMoveStage(lead.id, allStages[sIdx + 1].id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 cursor-pointer text-xs"
                            title="Move Right"
                          >
                            ▶
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <QuickAddModal
        isOpen={showAddModal}
        defaultTab="lead"
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchPipeline();
        }}
      />
    </div>
  );
}
