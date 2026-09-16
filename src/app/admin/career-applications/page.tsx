"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CareerApplication } from "@/lib/admin/types";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function CareerApplicationsPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState<CareerApplication | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/career-applications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUpdateStatus = async (id: string, status: CareerApplication["status"]) => {
    try {
      const res = await fetch("/api/admin/career-applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
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
            Career Applications & Talent Pool
          </h1>
          <p className="text-xs text-slate-500">
            Review job applicants, portfolios, and secure resume submissions ({applications.length} candidates)
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh applications"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: "", label: "All Applicants" },
          { id: "New", label: "Pending Review" },
          { id: "Under Review", label: "Reviewing" },
          { id: "Shortlisted", label: "Shortlisted ⭐" },
          { id: "Interview", label: "Interview" },
          { id: "Selected", label: "Selected 🎉" },
          { id: "Rejected", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              statusFilter === tab.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-3">Application ID</th>
                <th className="py-3 px-3">Message Snippet</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Resume</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    Loading candidates...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No applications found in this category.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-500">{app.email}</div>
                      <div className="text-[10px] text-slate-400">{app.mobile}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {app.applicationId}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 max-w-xs">
                      <p className="text-[11px] text-slate-600 line-clamp-2">{app.message}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3.5 px-3">
                      {app.resumeFileName ? (
                        <a
                          href={`/api/admin/resumes/${encodeURIComponent(app.resumeFileName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          <span>Resume</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Not provided</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedApp.applicantName}</h3>
                <span className="text-xs text-slate-500">{selectedApp.applicationId} &bull; {selectedApp.appliedDate}</span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Email</span>
                  <span className="font-semibold text-slate-800">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Phone</span>
                  <span className="font-semibold text-slate-800">{selectedApp.mobile}</span>
                </div>
              </div>

              {selectedApp.message && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Candidate Message</span>
                  <div className="p-3.5 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-wrap">
                    {selectedApp.message}
                  </div>
                </div>
              )}

              {selectedApp.resumeFileName && (
                <div className="pt-2">
                  <a
                    href={`/api/admin/resumes/${encodeURIComponent(selectedApp.resumeFileName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download Candidate Resume ({selectedApp.resumeFileName})</span>
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-600">Application Decision:</span>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as CareerApplication["status"];
                      handleUpdateStatus(selectedApp.id, newStatus);
                      setSelectedApp({ ...selectedApp, status: newStatus });
                    }}
                    className="bg-slate-100 rounded-lg px-2.5 py-1 font-bold border border-slate-200"
                  >
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
