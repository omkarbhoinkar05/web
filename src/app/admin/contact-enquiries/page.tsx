"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ContactEnquiry } from "@/lib/admin/types";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function ContactEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/contact-enquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Update status
  const handleUpdateStatus = async (id: string, status: ContactEnquiry["status"]) => {
    try {
      const res = await fetch("/api/admin/contact-enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Convert to lead
  const handleConvertToLead = async (enquiry: ContactEnquiry) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: enquiry.fullName,
          email: enquiry.email,
          mobile: enquiry.mobile,
          service: enquiry.service || "General Inquiry",
          source: "Contact Form",
          status: "NEW",
          notes: enquiry.message,
        }),
      });
      if (res.ok) {
        const newLead = await res.json();
        // Update enquiry to converted
        await handleUpdateStatus(enquiry.id, "Converted");
        alert(`Successfully converted inquiry into Lead: ${newLead.fullName || enquiry.fullName}`);
        fetchEnquiries();
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
            Contact Form Enquiries
          </h1>
          <p className="text-xs text-slate-500">
            Messages received directly through the HighTechBirds website contact form ({enquiries.length} items)
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 transition-colors self-start sm:self-auto cursor-pointer"
          title="Refresh enquiries"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <input
            type="text"
            placeholder="Search by name, email, service, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-medium outline-hidden text-slate-700"
        >
          <option value="">All Enquiry Statuses</option>
          <option value="New">New / Unaddressed</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted to Lead</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Message Snippet</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Received At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    Loading inquiries...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No contact inquiries found.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{enq.fullName}</div>
                      <div className="text-[11px] text-slate-500">{enq.email}</div>
                      {enq.mobile && <div className="text-[10px] text-slate-400">{enq.mobile}</div>}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-700">{enq.service || "General"}</span>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <p className="text-[11px] text-slate-600 line-clamp-2">{enq.message}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge status={enq.status} />
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                      {new Date(enq.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Read
                        </button>

                        {enq.leadId ? (
                          <Link
                            href={`/admin/leads/${enq.leadId}`}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors"
                          >
                            View Lead
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleConvertToLead(enq)}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition-colors cursor-pointer"
                          >
                            + Lead
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedEnquiry.fullName}</h3>
                <span className="text-xs text-slate-500">{selectedEnquiry.email} &bull; {selectedEnquiry.mobile || "No phone"}</span>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Requested Service</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                  {selectedEnquiry.service || "General Inquiry"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Message</span>
                <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-800 leading-relaxed border border-slate-100 whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as ContactEnquiry["status"];
                      handleUpdateStatus(selectedEnquiry.id, newStatus);
                      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
                    }}
                    className="text-xs font-bold bg-slate-100 rounded-lg px-2 py-1 border border-slate-200"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {!selectedEnquiry.leadId && (
                  <button
                    onClick={() => {
                      handleConvertToLead(selectedEnquiry);
                      setSelectedEnquiry(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Convert to Lead
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
