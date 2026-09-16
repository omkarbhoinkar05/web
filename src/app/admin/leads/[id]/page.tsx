"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lead, LeadStatus, LeadNote, LeadActivity } from "@/lib/admin/types";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Won / Lost modal states
  const [showWonModal, setShowWonModal] = useState(false);
  const [wonValue, setWonValue] = useState("");
  const [wonDuration, setWonDuration] = useState("6 Months");
  const [wonNotes, setWonNotes] = useState("");

  const [showLostModal, setShowLostModal] = useState(false);
  const [lostReason, setLostReason] = useState<"Budget" | "Timing" | "Competitor" | "Requirement Changed" | "No Response" | "Other">("Budget");
  const [lostNotes, setLostNotes] = useState("");

  // Schedule Follow-up state
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpType, setFollowUpType] = useState<"Call" | "WhatsApp" | "Email" | "Meeting" | "Quotation" | "Other">("Call");
  const [followUpNotes, setFollowUpNotes] = useState("");

  const fetchLeadDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [leadRes, actRes] = await Promise.all([
        fetch(`/api/admin/leads/${leadId}`),
        fetch(`/api/admin/activity?leadId=${leadId}`),
      ]);

      if (leadRes.ok) {
        const data = await leadRes.json();
        setLead(data.lead);
        setNotes(data.notes || []);
        if (data.lead.budget) {
          setWonValue(data.lead.budget);
        }
      }

      if (actRes.ok) {
        const actData = await actRes.json();
        setActivities(actData.activities || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLeadDetails();
  }, [fetchLeadDetails]);

  // Stage update handler
  const handleUpdateStatus = async (newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Note handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newNote }),
      });
      if (res.ok) {
        setNewNote("");
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingNote(false);
    }
  };

  // Handle Mark as Won
  const handleMarkWon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "WON",
          budget: wonValue,
          closingNote: `Won Value: ${wonValue} | Duration: ${wonDuration} | Notes: ${wonNotes}`,
        }),
      });
      if (res.ok) {
        setShowWonModal(false);
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Mark as Lost
  const handleMarkLost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "LOST",
          lostReason: lostReason,
          closingNote: lostNotes,
        }),
      });
      if (res.ok) {
        setShowLostModal(false);
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Schedule Follow-up
  const handleScheduleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate) return;

    try {
      const res = await fetch("/api/admin/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: leadId,
          leadName: lead?.fullName || "",
          leadMobile: lead?.mobile || "",
          date: followUpDate,
          type: followUpType,
          notes: followUpNotes,
        }),
      });
      if (res.ok) {
        setShowFollowUpModal(false);
        setFollowUpDate("");
        setFollowUpNotes("");
        fetchLeadDetails();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete lead
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead record? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/leads");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Lead CRM File...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-800 mb-2">Lead Record Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">The requested lead does not exist or may have been removed.</p>
        <Link
          href="/admin/leads"
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
        >
          Return to CRM List
        </Link>
      </div>
    );
  }

  const allStages: LeadStatus[] = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "REQUIREMENT DISCUSSED",
    "QUOTATION SENT",
    "FOLLOW-UP",
    "NEGOTIATION",
    "WON",
    "LOST",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{lead.fullName}</h1>
              <StatusBadge status={lead.status} />
            </div>
            <p className="text-xs text-slate-500">
              Lead ID: <span className="font-mono text-slate-600">{lead.leadId}</span> &bull; Added{" "}
              {new Date(lead.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFollowUpModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 font-bold text-xs transition-colors cursor-pointer"
          >
            📅 Schedule Follow-up
          </button>

          {lead.status !== "WON" && (
            <button
              onClick={() => setShowWonModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-colors cursor-pointer"
            >
              🎉 Mark as Won
            </button>
          )}

          {lead.status !== "LOST" && (
            <button
              onClick={() => setShowLostModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Mark as Lost
            </button>
          )}

          <button
            onClick={handleDelete}
            className="p-2 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Lead"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Pipeline Stage Quick Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2.5">
          Sales Pipeline Progression
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {allStages.map((stage) => {
            const isCurrent = lead.status === stage;
            return (
              <button
                key={stage}
                onClick={() => handleUpdateStatus(stage)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>
      </div>

      {/* Won Details Banner (if won) */}
      {lead.status === "WON" && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 block">
              Deal Won 🎉
            </span>
            <span className="text-xs text-emerald-700">
              Value: {lead.budget || "Confidential"} &bull; Assigned: {lead.assignedTo}
            </span>
            {lead.closingNote && (
              <p className="text-xs mt-1 text-emerald-800 italic">&ldquo;{lead.closingNote}&rdquo;</p>
            )}
          </div>
        </div>
      )}

      {/* Lost Details Banner (if lost) */}
      {lead.status === "LOST" && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
          <span className="text-xs font-black uppercase tracking-wider text-rose-800 block">
            Deal Closed as Lost
          </span>
          <span className="text-xs text-rose-700">
            Reason: {lead.lostReason || "Not specified"}
          </span>
          {lead.closingNote && (
            <p className="text-xs mt-1 text-rose-800 italic">&ldquo;{lead.closingNote}&rdquo;</p>
          )}
        </div>
      )}

      {/* 2 Column Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Info (1 Col) */}
        <div className="space-y-6">
          {/* Client Specs Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Client & Project Details
            </h2>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email Address</span>
              <a href={`mailto:${lead.email}`} className="text-xs font-semibold text-emerald-600 hover:underline">
                {lead.email}
              </a>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Mobile Phone</span>
              <span className="text-xs font-semibold text-slate-800">{lead.mobile || "Not provided"}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Requested Solution / Service</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                {lead.service}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Estimated Budget</span>
              <span className="text-xs font-black text-slate-900">{lead.budget || "Open / Needs Scoping"}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Acquisition Channel</span>
              <span className="text-xs font-medium text-slate-700">{lead.source}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Account Lead</span>
              <span className="text-xs font-bold text-slate-800">{lead.assignedTo}</span>
            </div>

            {lead.notes && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Initial Overview Notes
                </span>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100 italic">
                  &ldquo;{lead.notes}&rdquo;
                </div>
              </div>
            )}
          </div>

          {/* Follow-up Touchpoint Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Next Scheduled Touchpoint</h2>
            {lead.nextFollowUp ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold block">Follow-up Date:</span>
                <span>{lead.nextFollowUp}</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 mb-3">No active follow-up scheduled.</div>
            )}

            <button
              onClick={() => setShowFollowUpModal(true)}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Update Next Touchpoint
            </button>
          </div>
        </div>

        {/* Right Column: Notes & Activity Timeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes Manager */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Internal Team Notes & Updates</h2>

            {/* Note Input */}
            <form onSubmit={handleAddNote} className="space-y-3 mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a client conversation, technical requirement, meeting outcome..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 font-medium outline-hidden"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingNote || !newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {submittingNote ? "Saving..." : "Add Note"}
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="text-xs text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-xl">
                  No internal notes recorded yet for this client.
                </div>
              ) : (
                notes.map((note: LeadNote) => (
                  <div key={note.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-800">{note.actor}</span>
                      <span className="text-slate-400">
                        {new Date(note.createdAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-line">{note.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Audit Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Lead Activity Audit Trail</h2>

            <div className="relative pl-4 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-1.5 before:w-0.5 before:bg-slate-200">
              {activities.length === 0 ? (
                <div className="text-xs text-slate-400">No activity history recorded.</div>
              ) : (
                activities.map((act: LeadActivity) => (
                  <div key={act.id} className="relative">
                    <span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <div className="text-xs font-bold text-slate-900">{act.type}</div>
                    <div className="text-[11px] text-slate-600">{act.description}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {act.date} {act.time} &bull; {act.actor}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mark Won Modal */}
      {showWonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">🎉 Close Deal as WON</h3>
              <button onClick={() => setShowWonModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleMarkWon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Final Deal Value</label>
                <input
                  type="text"
                  required
                  value={wonValue}
                  onChange={(e) => setWonValue(e.target.value)}
                  placeholder="e.g. ₹5,00,000 / $6,000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contract / Delivery Duration</label>
                <input
                  type="text"
                  value={wonDuration}
                  onChange={(e) => setWonDuration(e.target.value)}
                  placeholder="e.g. 3 Months / Annual Retainer"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Closing Notes</label>
                <textarea
                  value={wonNotes}
                  onChange={(e) => setWonNotes(e.target.value)}
                  placeholder="Key milestones, deliverables, payment terms agreed..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWonModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Confirm Deal Won
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Lost Modal */}
      {showLostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Close Deal as LOST</h3>
              <button onClick={() => setShowLostModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleMarkLost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Reason for Loss</label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value as typeof lostReason)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Budget">Budget constraints</option>
                  <option value="Competitor">Chose Competitor</option>
                  <option value="Timing">Timing / Deferred</option>
                  <option value="Requirement Changed">Requirement Changed</option>
                  <option value="No Response">No response / Ghosted</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Post-Mortem Notes</label>
                <textarea
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  placeholder="Any learnings for future proposals..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLostModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Confirm Deal Lost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Schedule Follow-up Touchpoint</h3>
              <button onClick={() => setShowFollowUpModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleScheduleFollowUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Follow-up Date</label>
                <input
                  type="date"
                  required
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Touchpoint Type</label>
                <select
                  value={followUpType}
                  onChange={(e) => setFollowUpType(e.target.value as typeof followUpType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Call">Phone Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email Follow-up</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Quotation">Quotation Discussion</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Action Notes / Goal</label>
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="e.g. Check if client reviewed the proposal, discuss tech architecture..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Schedule Touchpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
