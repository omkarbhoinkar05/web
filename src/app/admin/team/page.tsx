"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TeamMember, AdminRole } from "@/lib/admin/types";

export default function TeamManagementPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
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

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Invite Team Member</span>
        </button>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix Reference Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-2">Role Permissions Matrix</h2>
        <p className="text-xs text-slate-500 mb-4">Granular capabilities per authorized role tier</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                <th className="py-2">Permission Area</th>
                <th className="py-2 text-center">Super Admin</th>
                <th className="py-2 text-center">Admin</th>
                <th className="py-2 text-center">Sales</th>
                <th className="py-2 text-center">Support / HR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 font-medium">View Leads, Calls, Inquiries</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Add & Edit Leads, Add Notes</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-slate-300">✗</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Advance Pipeline Stages & Close Deals</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-slate-300">✗</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Export CSV Data</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-slate-300">✗</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Team & System Settings Management</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-emerald-600 font-bold">✓</td>
                <td className="py-2.5 text-center text-slate-300">✗</td>
                <td className="py-2.5 text-center text-slate-300">✗</td>
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
                <label className="block font-bold text-slate-700 uppercase mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@hightechbirds.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Role Tier</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Sales">Sales</option>
                  <option value="Admin">Admin</option>
                  <option value="Support">Support</option>
                  <option value="HR">HR</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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
