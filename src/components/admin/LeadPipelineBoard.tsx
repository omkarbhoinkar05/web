import React from "react";
import Link from "next/link";
import { LeadStatus } from "@/lib/admin/types";

interface LeadPipelineBoardProps {
  pipelineCounts: Record<LeadStatus, number>;
  onSelectStage?: (stage: LeadStatus) => void;
}

const STAGES: { key: LeadStatus; label: string; color: string }[] = [
  { key: "NEW", label: "New", color: "border-teal-400 bg-teal-50/60 text-teal-900" },
  { key: "CONTACTED", label: "Contacted", color: "border-emerald-300 bg-emerald-50/60 text-emerald-900" },
  { key: "QUALIFIED", label: "Qualified", color: "border-emerald-400 bg-emerald-100/50 text-emerald-900" },
  { key: "REQUIREMENT DISCUSSED", label: "Requirement", color: "border-teal-400 bg-teal-100/50 text-teal-950" },
  { key: "QUOTATION SENT", label: "Quotation", color: "border-emerald-500 bg-emerald-100/70 text-emerald-950" },
  { key: "FOLLOW-UP", label: "Follow-up", color: "border-amber-400 bg-amber-50/70 text-amber-950" },
  { key: "NEGOTIATION", label: "Negotiation", color: "border-teal-500 bg-teal-200/50 text-teal-950" },
  { key: "WON", label: "Won", color: "border-emerald-600 bg-emerald-600 text-white shadow-xs" },
  { key: "LOST", label: "Lost", color: "border-rose-300 bg-rose-50 text-rose-900" },
];

export function LeadPipelineBoard({ pipelineCounts, onSelectStage }: LeadPipelineBoardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Lead Pipeline</h3>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              9 Active Stages
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track every lead from first enquiry to final outcome.
          </p>
        </div>
        <Link
          href="/admin/pipeline"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <span>Open Kanban Board</span>
          <span>→</span>
        </Link>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
        {STAGES.map((stage) => {
          const count = pipelineCounts[stage.key] || 0;
          return (
            <button
              key={stage.key}
              onClick={() => onSelectStage && onSelectStage(stage.key)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer group ${stage.color}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-85 truncate">
                {stage.label}
              </span>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-black">{count}</span>
                <span className="text-[9px] opacity-75 font-mono">leads</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
