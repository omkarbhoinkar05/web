"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Lead, LeadStatus } from "@/lib/admin/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { QuickAddModal } from "@/components/admin/QuickAddModal";

export default function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 15;

  // Add lead modal state
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (serviceFilter) params.set("service", serviceFilter);
      if (sourceFilter) params.set("source", sourceFilter);
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, serviceFilter, sourceFilter, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Quick inline status updater
  const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    window.open("/api/admin/leads?export=csv", "_blank");
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const statusOptions: { value: string; label: string }[] = [
    { value: "", label: "All Stages" },
    { value: "NEW", label: "New Lead" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "REQUIREMENT DISCUSSED", label: "Requirement Discussed" },
    { value: "QUOTATION SENT", label: "Quotation Sent" },
    { value: "FOLLOW-UP", label: "Follow-up" },
    { value: "NEGOTIATION", label: "Negotiation" },
    { value: "WON", label: "Deal Won" },
    { value: "LOST", label: "Deal Lost" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Leads & Clients CRM
          </h1>
          <p className="text-xs text-slate-500">
            Manage inquiries, sales pipeline stages, and conversion tracking ({totalCount} total)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export CSV</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Stage Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden text-slate-700"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Service Filter */}
        <select
          value={serviceFilter}
          onChange={(e) => {
            setServiceFilter(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden text-slate-700"
        >
          <option value="">All Services</option>
          <option value="Web Design">Web Design</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App Development">Mobile App Development</option>
          <option value="UI/UX Design">UI/UX Design</option>
          <option value="Cloud & DevOps">Cloud & DevOps</option>
          <option value="AI & ML Solutions">AI & ML Solutions</option>
          <option value="Custom Software Development">Custom Software</option>
        </select>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden text-slate-700"
        >
          <option value="">All Acquisition Channels</option>
          <option value="Website">Website</option>
          <option value="Contact Form">Contact Form</option>
          <option value="Schedule Call">Schedule Call</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Referral">Referral</option>
          <option value="Direct Inbound">Direct Inbound</option>
          <option value="LinkedIn">LinkedIn</option>
        </select>
      </div>

      {/* Main Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Contact / Lead ID</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Pipeline Stage</th>
                <th className="py-3 px-3">Budget / Deal Value</th>
                <th className="py-3 px-3">Acquisition Source</th>
                <th className="py-3 px-3">Next Touchpoint</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No leads found matching current criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link href={`/admin/leads/${lead.id}`} className="hover:underline">
                        <div className="font-bold text-slate-900">{lead.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          {lead.leadId} &bull; {lead.email}
                        </div>
                        {lead.mobile && (
                          <div className="text-[10px] text-slate-400">{lead.mobile}</div>
                        )}
                      </Link>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700">{lead.service}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={lead.status} />
                        <select
                          value={lead.status}
                          onChange={(e) => handleQuickStatusChange(lead.id, e.target.value as LeadStatus)}
                          className="text-[10px] text-slate-400 hover:text-slate-700 bg-transparent border-none cursor-pointer outline-hidden p-0"
                          title="Quick update stage"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="REQUIREMENT DISCUSSED">Requirement Discussed</option>
                          <option value="QUOTATION SENT">Quotation Sent</option>
                          <option value="FOLLOW-UP">Follow-up</option>
                          <option value="NEGOTIATION">Negotiation</option>
                          <option value="WON">Won 🎉</option>
                          <option value="LOST">Lost</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900">
                        {lead.budget ? lead.budget : "—"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {lead.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[11px] text-slate-600">
                        {lead.nextFollowUp || "—"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors"
                        >
                          View CRM
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing page {page} of {totalPages} ({totalCount} items)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-bold text-slate-700 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Lead Modal */}
      <QuickAddModal
        isOpen={showAddModal}
        defaultTab="lead"
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchLeads();
        }}
      />
    </div>
  );
}
