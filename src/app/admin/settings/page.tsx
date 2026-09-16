"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "@/lib/admin/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    companyName: "HighTechBirds",
    tagline: "Ideas | Innovation | Growth",
    supportEmail: "dev.omkar05@gmail.com",
    supportPhone: "9920818481",
    bookingSettings: {
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      workingHoursStart: "10:00 AM",
      workingHoursEnd: "07:00 PM",
      timezone: "Asia/Kolkata (IST)",
      callDurationMinutes: 30,
    },
    leadSettings: {
      statuses: ["NEW", "CONTACTED", "QUALIFIED", "REQUIREMENT DISCUSSED", "QUOTATION SENT", "FOLLOW-UP", "NEGOTIATION", "WON", "LOST"],
      sources: ["Website", "Contact Form", "Schedule Call", "WhatsApp", "Referral", "Direct Inbound", "LinkedIn", "Other"],
      priorities: ["Low", "Medium", "High", "Urgent"],
      services: ["Web Design", "Web Development", "Mobile App Development", "UI/UX Design", "Cloud & DevOps", "AI & ML Solutions", "Custom Software Development"],
    },
    notificationSettings: {
      newEnquiry: true,
      newCareerApplication: true,
      scheduledCall: true,
      followUpDue: true,
      followUpOverdue: true,
      leadStatusChange: true,
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccessMsg("Settings updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          System Preferences & Company Settings
        </h1>
        <p className="text-xs text-slate-500">
          Configure HighTechBirds operational metadata, notification rules, and default preferences
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Company Organization Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1.5">
                Company Brand Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1.5">
                Support & Inbound Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1.5">
                Primary Contact Phone
              </label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Automation Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Inbound Alerts & Notification Rules
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationSettings.newEnquiry}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationSettings: {
                      ...settings.notificationSettings,
                      newEnquiry: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">Instant notification on new contact enquiry</span>
                <span className="text-slate-500 text-[11px] block">
                  Broadcast notification badge whenever a website visitor submits the contact form
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationSettings.scheduledCall}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationSettings: {
                      ...settings.notificationSettings,
                      scheduledCall: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">Instant alert on new scheduled call booking</span>
                <span className="text-slate-500 text-[11px] block">
                  Trigger alert whenever a prospective client books a consultation slot
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationSettings.newCareerApplication}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationSettings: {
                      ...settings.notificationSettings,
                      newCareerApplication: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">Alert on new career application submission</span>
                <span className="text-slate-500 text-[11px] block">
                  Notify team when a candidate submits their resume on the careers portal
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
