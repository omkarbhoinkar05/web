"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lead, LeadStatus, LeadNote, LeadActivity, FollowUp } from "@/lib/admin/types";
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
  const [noteCategory, setNoteCategory] = useState("General Update");
  const [noteStatus, setNoteStatus] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  // Won / Lost modal states
  const [showWonModal, setShowWonModal] = useState(false);
  const [wonValue, setWonValue] = useState("");
  const [wonDuration, setWonDuration] = useState("6 Months");
  const [wonNotes, setWonNotes] = useState("");

  const [showLostModal, setShowLostModal] = useState(false);
  const [lostReason, setLostReason] = useState<"Budget" | "Timing" | "Competitor" | "Requirement Changed" | "No Response" | "Other">("Budget");
  const [lostNotes, setLostNotes] = useState("");

  // Schedule Follow-up state
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("10:00 AM");
  const [followUpType, setFollowUpType] = useState<"Call" | "WhatsApp" | "Email" | "Meeting" | "Quotation" | "Other">("Call");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);

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
        setFollowUps(data.followUps || []);
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
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUserRole(data.user.role);
        }
      })
      .catch(() => null);
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
        body: JSON.stringify({
          note: newNote,
          category: noteCategory,
          status: noteStatus || lead?.status,
        }),
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
    if (!followUpDate || !lead) return;

    setSubmittingFollowUp(true);
    try {
      const res = await fetch("/api/admin/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.leadId || lead.id,
          leadName: lead.fullName,
          leadMobile: lead.mobile,
          date: followUpDate,
          time: followUpTime || "10:00 AM",
          type: followUpType,
          notes: followUpNotes || "Touchpoint scheduled with client",
          assignedTo: lead.assignedTo || "Admin",
        }),
      });
      if (res.ok) {
        setShowFollowUpModal(false);
        setFollowUpDate("");
        setFollowUpTime("10:00 AM");
        setFollowUpNotes("");
        fetchLeadDetails();
      } else {
        const err = await res.json().catch(() => ({}));
        console.error("Follow-up error:", err);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  // Complete touchpoint
  const handleCompleteFollowUp = async (followUpId: string) => {
    try {
      const res = await fetch("/api/admin/follow-ups", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: followUpId,
          notes: "Touchpoint marked as completed by team member",
        }),
      });
      if (res.ok) {
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

          {currentUserRole === "Super Admin" && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Delete Lead (Super Admin only)"
            >
              🗑️
            </button>
          )}
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Next Scheduled Touchpoint</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                {followUps.filter((f) => f.status === "Upcoming").length} Pending
              </span>
            </div>

            {lead.nextFollowUp || followUps.find((f) => f.status === "Upcoming") ? (
              (() => {
                const upcoming = followUps.find((f) => f.status === "Upcoming");
                return (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                        Scheduled Touchpoint
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-600 text-white">
                        {upcoming?.type || "Call"}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>{upcoming ? `${upcoming.date} at ${upcoming.time}` : lead.nextFollowUp}</span>
                    </div>

                    {upcoming?.notes && (
                      <p className="text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                        {upcoming.notes}
                      </p>
                    )}

                    <div className="pt-1 flex items-center gap-2">
                      {upcoming && (
                        <button
                          type="button"
                          onClick={() => handleCompleteFollowUp(upcoming.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Mark Done</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowFollowUpModal(true)}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  No active touchpoint scheduled. Schedule a check-in to keep this lead warm.
                </div>
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(true)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  + Schedule Touchpoint
                </button>
              </div>
            )}

            {/* Previous Touchpoints History (if any) */}
            {followUps.filter((f) => f.status === "Completed").length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Completed Touchpoints ({followUps.filter((f) => f.status === "Completed").length})
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {followUps
                    .filter((f) => f.status === "Completed")
                    .map((f) => (
                      <div key={f.id} className="text-[11px] p-2 rounded-xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800">{f.type}: </span>
                          <span className="text-slate-600">{f.date}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">✓ Done</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Notes & Activity Timeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes Manager */}
          {/* Notes & Updates Manager - Data Table Format */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Internal Team Notes & Updates</h2>
                <p className="text-xs text-slate-500">
                  Track client history, team touchpoints, and requirement changes in structured audit table format.
                </p>
              </div>
              <span className="self-start sm:self-auto text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {notes.length} {notes.length === 1 ? "History Entry" : "History Entries"}
              </span>
            </div>

            {/* Note & Update Input Form */}
            <form onSubmit={handleAddNote} className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Update Category / Type
                  </label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 font-medium outline-hidden"
                  >
                    <option value="General Update">General Update</option>
                    <option value="Client Call">Client Call</option>
                    <option value="Requirement Discussion">Requirement Discussion</option>
                    <option value="Meeting Outcome">Meeting Outcome</option>
                    <option value="Quotation / Pricing">Quotation / Pricing</option>
                    <option value="Follow-up Touchpoint">Follow-up Touchpoint</option>
                    <option value="Price Negotiation">Price Negotiation</option>
                    <option value="Tech Stack Discussion">Tech Stack Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sync Lead Stage / Status (Optional)
                  </label>
                  <select
                    value={noteStatus || (lead?.status || "NEW")}
                    onChange={(e) => setNoteStatus(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 font-medium outline-hidden"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="REQUIREMENT DISCUSSED">REQUIREMENT DISCUSSED</option>
                    <option value="QUOTATION SENT">QUOTATION SENT</option>
                    <option value="FOLLOW-UP">FOLLOW-UP</option>
                    <option value="NEGOTIATION">NEGOTIATION</option>
                    <option value="WON">WON</option>
                    <option value="LOST">LOST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Note & Discussion Details
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Log client discussion summary, requirements, agreed timelines, or internal notes..."
                  rows={3}
                  className="w-full p-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs text-slate-800 font-medium outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400">
                  Logs will be appended to the history table with timestamp and author.
                </span>
                <button
                  type="submit"
                  disabled={submittingNote || !newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>{submittingNote ? "Recording..." : "Save to History Table"}</span>
                </button>
              </div>
            </form>

            {/* Notes & Updates Data Table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4 w-36">Date & Time</th>
                      <th className="py-3 px-3 w-36">Updated By</th>
                      <th className="py-3 px-3 w-36">Category</th>
                      <th className="py-3 px-3 w-28">Stage</th>
                      <th className="py-3 px-4">Note / History Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {notes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          No internal notes or history updates recorded yet for this client.
                        </td>
                      </tr>
                    ) : (
                      notes.map((note: LeadNote) => (
                        <tr key={note.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 align-top whitespace-nowrap">
                            <span className="font-bold text-slate-800 block text-[11px]">
                              {new Date(note.createdAt).toLocaleDateString([], {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(note.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>

                          <td className="py-3 px-3 align-top whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center">
                                {(note.actor || "A").charAt(0).toUpperCase()}
                              </span>
                              <span className="font-bold text-slate-800 text-[11px]">{note.actor}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 align-top whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {note.category || "General Update"}
                            </span>
                          </td>

                          <td className="py-3 px-3 align-top whitespace-nowrap">
                            {note.status ? (
                              <StatusBadge status={note.status as LeadStatus} />
                            ) : (
                              <span className="text-slate-400 text-[10px] italic">—</span>
                            )}
                          </td>

                          <td className="py-3 px-4 align-top text-slate-700 leading-relaxed text-xs">
                            <p className="whitespace-pre-wrap">{note.note}</p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    required
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Time</label>
                  <select
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM (Late Morning)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="03:30 PM">03:30 PM (Mid Afternoon)</option>
                    <option value="05:00 PM">05:00 PM (Late Afternoon)</option>
                    <option value="06:30 PM">06:30 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Touchpoint Type</label>
                <select
                  value={followUpType}
                  onChange={(e) => setFollowUpType(e.target.value as typeof followUpType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden"
                >
                  <option value="Call">📞 Phone Call</option>
                  <option value="WhatsApp">💬 WhatsApp Follow-up</option>
                  <option value="Email">✉️ Email Check-in</option>
                  <option value="Meeting">🤝 Virtual / In-person Meeting</option>
                  <option value="Quotation">📄 Proposal / Quotation Discussion</option>
                  <option value="Other">📌 Other Milestone</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Action Notes / Goal</label>
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="e.g. Check if client reviewed the proposal, discuss tech architecture..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFollowUp || !followUpDate}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  {submittingFollowUp ? "Scheduling..." : "Schedule Touchpoint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
