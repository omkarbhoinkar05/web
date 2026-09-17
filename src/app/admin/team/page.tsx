"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TeamMember, AdminRole } from "@/lib/admin/types";

export default function TeamManagementPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("Sales");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team");
      if (res.ok) {
        const data = await res.json();
        setTeam(data.team || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUserRole(data.user.role);
        }
      })
      .catch(() => null);
  }, [fetchTeam]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, password }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setName("");
        setEmail("");
        setPassword("");
        fetchTeam();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to add team member.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete ${memberName}? This action is irreversible.`)) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTeam();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove team member.");
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
            Team & Role-Based Access Control
          </h1>
          <p className="text-xs text-slate-500">
            Manage administrative team members, grant permissions, and configure RBAC policies
          </p>
        </div>

        {currentUserRole === "Super Admin" ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Add Team Member</span>
          </button>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold self-start sm:self-auto">
            Team Creation: Super Admin Exclusive
          </div>
        )}
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Role / Permissions</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Active</th>
                {currentUserRole === "Super Admin" && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={currentUserRole === "Super Admin" ? 6 : 5} className="py-12 text-center text-slate-400 font-medium">
                    Loading team members...
                  </td>
                </tr>
              ) : team.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">{member.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="text-slate-600 font-medium">{member.email}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {member.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                    {member.lastLogin
                      ? new Date(member.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>

                  {currentUserRole === "Super Admin" && (
                    <td className="py-3.5 px-4 text-right">
                      {member.id !== "team-super" && (
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Team Member"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix Reference Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Role Permissions Matrix</h2>
            <p className="text-xs text-slate-500">Granular capabilities per authorized role tier</p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            5 Role Levels Defined
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                <th className="py-3 px-4">Permission Area</th>
                <th className="py-3 px-3 text-center">Super Admin</th>
                <th className="py-3 px-3 text-center">Admin</th>
                <th className="py-3 px-3 text-center">Sales</th>
                <th className="py-3 px-3 text-center">HR</th>
                <th className="py-3 px-3 text-center">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="bg-emerald-50/30">
                <td className="py-3 px-4 font-bold text-slate-900">
                  Delete Any Record / Member (Leads, Team, Data)
                </td>
                <td className="py-3 px-3 text-center text-emerald-700 font-extrabold">✓ Exclusive</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
              </tr>
              <tr className="bg-emerald-50/30">
                <td className="py-3 px-4 font-bold text-slate-900">
                  Create / Manage Team Members
                </td>
                <td className="py-3 px-3 text-center text-emerald-700 font-extrabold">✓ Exclusive</td>
                <td className="py-3 px-3 text-center text-rose-600 font-bold">✗ Cannot Create</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800">
                  View & Manage Leads CRM (Leads, Pipeline, Calls, Enquiries)
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full Sales</td>
                <td className="py-3 px-3 text-center text-rose-600 font-bold">✗ Strictly Hidden</td>
                <td className="py-3 px-3 text-center text-slate-600 font-bold">✓ View Only</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800">
                  Schedule Follow-ups & Touchpoints
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full Sales</td>
                <td className="py-3 px-3 text-center text-rose-600 font-bold">✗ Strictly Hidden</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800">
                  Career Applications, Candidate Review & Resumes
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full HR</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800">
                  Executive Reports & Analytics
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-800">
                  Company Settings & Preferences
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓ Full</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
                <td className="py-3 px-3 text-center text-slate-400 font-bold">✗ No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Add Team Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@web.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Role Tier</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Admin">Admin (Full Management without Team creation / Deletion)</option>
                  <option value="Sales">Sales (Leads, Pipeline, Calls & Follow-ups)</option>
                  <option value="HR">HR (Careers & Resumes Only)</option>
                  <option value="Support">Support (View Leads & Notes)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20"
                >
                  {submitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
