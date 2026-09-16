"use client";

import React, { useState } from "react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultTab?: "lead" | "call" | "followup";
}

export function QuickAddModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = "lead",
}: QuickAddModalProps) {
  const [activeTab, setActiveTab] = useState<"lead" | "call" | "followup">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lead fields
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadMobile, setLeadMobile] = useState("");
  const [leadService, setLeadService] = useState("Web Design");
  const [leadBudget, setLeadBudget] = useState("₹50,000 – ₹1,00,000");
  const [leadPriority, setLeadPriority] = useState("High");
  const [leadNotes, setLeadNotes] = useState("");

  // Call fields
  const [callName, setCallName] = useState("");
  const [callEmail, setCallEmail] = useState("");
  const [callMobile, setCallMobile] = useState("");
  const [callService, setCallService] = useState("Web Design");
  const [callDate, setCallDate] = useState(new Date().toISOString().split("T")[0]);
  const [callTime, setCallTime] = useState("10:00 AM");
  const [callNotes, setCallNotes] = useState("");

  // Follow-up fields
  const [flpLeadName, setFlpLeadName] = useState("");
  const [flpMobile, setFlpMobile] = useState("");
  const [flpDate, setFlpDate] = useState(new Date().toISOString().split("T")[0]);
  const [flpTime, setFlpTime] = useState("04:00 PM");
  const [flpType, setFlpType] = useState<"Call" | "WhatsApp" | "Email" | "Meeting" | "Quotation">("Call");
  const [flpNotes, setFlpNotes] = useState("");

  if (!isOpen) return null;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadMobile.trim()) {
      setError("Please fill out name and mobile number.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: leadName,
          email: leadEmail,
          mobile: leadMobile,
          service: leadService,
          budget: leadBudget,
          priority: leadPriority,
          notes: leadNotes,
          source: "Direct Inbound",
          status: "NEW",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lead");

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving lead");
    } finally {
      setLoading(false);
    }
  };

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callName.trim() || !callMobile.trim()) {
      setError("Please enter customer name and mobile.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/scheduled-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: callName,
          email: callEmail,
          mobile: callMobile,
          service: callService,
          date: callDate,
          time: callTime,
          notes: callNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to schedule call");

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error scheduling call");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flpLeadName.trim()) {
      setError("Please enter lead name.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: "MANUAL",
          leadName: flpLeadName,
          leadMobile: flpMobile,
          date: flpDate,
          time: flpTime,
          type: flpType,
          notes: flpNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add follow-up");

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error scheduling follow-up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-base font-black text-slate-900">Quick Add Action</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-5 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveTab("lead");
              setError("");
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "lead"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            + Add Lead
          </button>
          <button
            onClick={() => {
              setActiveTab("call");
              setError("");
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "call"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            + Schedule Call
          </button>
          <button
            onClick={() => {
              setActiveTab("followup");
              setError("");
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === "followup"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            + Add Follow-up
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="m-5 mb-0 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Tab 1: Lead Form */}
        {activeTab === "lead" && (
          <form onSubmit={handleLeadSubmit} className="p-5 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={leadMobile}
                  onChange={(e) => setLeadMobile(e.target.value)}
                  placeholder="e.g. 9920818481"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Service
                </label>
                <select
                  value={leadService}
                  onChange={(e) => setLeadService(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option>Web Design</option>
                  <option>SaaS App Development</option>
                  <option>ERP Software</option>
                  <option>E-Commerce</option>
                  <option>Custom Web App</option>
                  <option>Dynamic Website</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Budget
                </label>
                <select
                  value={leadBudget}
                  onChange={(e) => setLeadBudget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option>₹25,000 – ₹50,000</option>
                  <option>₹50,000 – ₹1,00,000</option>
                  <option>₹1,00,000 – ₹2,00,000</option>
                  <option>₹2,00,000 – ₹5,00,000</option>
                  <option>₹5,00,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Priority
                </label>
                <select
                  value={leadPriority}
                  onChange={(e) => setLeadPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Requirement / Notes
              </label>
              <textarea
                rows={2}
                value={leadNotes}
                onChange={(e) => setLeadNotes(e.target.value)}
                placeholder="Key requirements, client expectations..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {loading ? "Saving..." : "Save Lead"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Scheduled Call Form */}
        {activeTab === "call" && (
          <form onSubmit={handleCallSubmit} className="p-5 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={callName}
                  onChange={(e) => setCallName(e.target.value)}
                  placeholder="Customer full name"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={callMobile}
                  onChange={(e) => setCallMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={callDate}
                  onChange={(e) => setCallDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Time Slot
                </label>
                <select
                  value={callTime}
                  onChange={(e) => setCallTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option>10:00 AM</option>
                  <option>11:30 AM</option>
                  <option>02:00 PM</option>
                  <option>03:30 PM</option>
                  <option>05:00 PM</option>
                  <option>06:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Service Discussion
              </label>
              <select
                value={callService}
                onChange={(e) => setCallService(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option>Web Design</option>
                <option>SaaS App Development</option>
                <option>ERP Software</option>
                <option>E-Commerce</option>
                <option>Custom Web App</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Meeting Agenda / Notes
              </label>
              <textarea
                rows={2}
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Topic of discussion..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {loading ? "Scheduling..." : "Schedule Call"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Follow-up Form */}
        {activeTab === "followup" && (
          <form onSubmit={handleFollowUpSubmit} className="p-5 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Lead Name *
                </label>
                <input
                  type="text"
                  required
                  value={flpLeadName}
                  onChange={(e) => setFlpLeadName(e.target.value)}
                  placeholder="Lead full name"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Lead Mobile
                </label>
                <input
                  type="tel"
                  value={flpMobile}
                  onChange={(e) => setFlpMobile(e.target.value)}
                  placeholder="Mobile number"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={flpDate}
                  onChange={(e) => setFlpDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Time
                </label>
                <input
                  type="text"
                  required
                  value={flpTime}
                  onChange={(e) => setFlpTime(e.target.value)}
                  placeholder="e.g. 05:00 PM"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Channel
                </label>
                <select
                  value={flpType}
                  onChange={(e) => setFlpType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option>Call</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Meeting</option>
                  <option>Quotation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Follow-up Action Notes
              </label>
              <textarea
                rows={2}
                value={flpNotes}
                onChange={(e) => setFlpNotes(e.target.value)}
                placeholder="What needs to be discussed or sent..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {loading ? "Saving..." : "Add Follow-up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
