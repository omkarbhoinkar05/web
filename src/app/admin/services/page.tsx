"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ServiceItem, ServiceStatus } from "@/lib/admin/types";

interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
}

const PRESET_ICONS = [
  { id: "monitor", name: "Monitor (Web Design)" },
  { id: "cloud", name: "Cloud (SaaS App)" },
  { id: "erp", name: "ERP / Layers (ERP Software)" },
  { id: "cart", name: "Cart (E-Commerce)" },
  { id: "window", name: "Window / Layout (Dynamic Website)" },
  { id: "code", name: "Code / Terminal (Custom Web App)" },
  { id: "server", name: "Server (Hosting)" },
  { id: "mobile", name: "Mobile / Device" },
  { id: "shield", name: "Shield / Security" },
  { id: "database", name: "Database" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [stats, setStats] = useState<ServiceStats>({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formIcon, setFormIcon] = useState("monitor");
  const [formImage, setFormImage] = useState("");
  const [formButtonText, setFormButtonText] = useState("Contact Now →");
  const [formHref, setFormHref] = useState("#contact");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<ServiceStatus>("Active");

  // Image Upload Handling
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirm Modal
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; title: string } | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/services?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Toast auto-hide
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Helper to parse features for display or form
  const parseFeaturesArray = (features: string | string[]): string[] => {
    if (Array.isArray(features)) return features;
    if (!features) return [];
    if (features.startsWith("[") && features.endsWith("]")) {
      try {
        return JSON.parse(features);
      } catch {
        // fallback
      }
    }
    return features.split(",").map((s) => s.trim()).filter(Boolean);
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormTitle("");
    setFormSlug("");
    setFormShortDesc("");
    setFormDescription("");
    setFormFeatures("Feature 1, Feature 2, Feature 3, Feature 4");
    setFormIcon("monitor");
    setFormImage("");
    setImagePreview("");
    setFormButtonText("Contact Now →");
    setFormHref("#contact");
    setFormDisplayOrder(services.length + 1);
    setFormStatus("Active");
    setFormError("");
    setShowModal(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormTitle(service.title);
    setFormSlug(service.slug);
    setFormShortDesc(service.shortDescription || "");
    setFormDescription(service.description || "");
    const feats = parseFeaturesArray(service.features);
    setFormFeatures(feats.join(", "));
    setFormIcon(service.icon || "monitor");
    setFormImage(service.image || "");
    setImagePreview(service.image || "");
    setFormButtonText(service.buttonText || "Contact Now →");
    setFormHref(service.href || "#contact");
    setFormDisplayOrder(service.displayOrder);
    setFormStatus(service.status);
    setFormError("");
    setShowModal(true);
  };

  // Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Selected file is larger than 5 MB limit.");
      return;
    }

    setUploadingImage(true);
    setFormError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/admin/services/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setFormImage(data.url);
      setImagePreview(data.url);
    } catch (err: any) {
      setFormError(err.message || "Failed to upload image file.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle.trim()) {
      setFormError("Service title is required.");
      return;
    }

    if (!formShortDesc.trim()) {
      setFormError("Short description is required.");
      return;
    }

    setSubmitting(true);

    // Parse features into clean array or JSON string
    const featuresList = formFeatures
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      title: formTitle.trim(),
      slug: formSlug.trim() || undefined,
      shortDescription: formShortDesc.trim(),
      description: formDescription.trim() || null,
      features: JSON.stringify(featuresList),
      icon: formIcon,
      image: formImage.trim() || null,
      buttonText: formButtonText.trim() || "Contact Now →",
      href: formHref.trim() || "#contact",
      displayOrder: Number(formDisplayOrder) || 0,
      status: formStatus,
    };

    try {
      let res: Response;
      if (editingService) {
        res = await fetch(`/api/admin/services/${editingService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save service.");
      }

      setShowModal(false);
      setSuccessToast(
        editingService ? "Service updated successfully!" : "New service added successfully!"
      );
      fetchServices();
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (service: ServiceItem) => {
    const nextStatus: ServiceStatus = service.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, status: nextStatus } : s))
        );
        setStats((prev) => ({
          ...prev,
          active: nextStatus === "Active" ? prev.active + 1 : prev.active - 1,
          inactive: nextStatus === "Inactive" ? prev.inactive + 1 : prev.inactive - 1,
        }));
        setSuccessToast(`Service "${service.title}" set to ${nextStatus}.`);
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Delete Action
  const confirmDelete = async () => {
    if (!deleteConfirmItem) return;
    try {
      const res = await fetch(`/api/admin/services/${deleteConfirmItem.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccessToast(`Service "${deleteConfirmItem.title}" was deleted.`);
        setDeleteConfirmItem(null);
        fetchServices();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete service.");
      }
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  // Render Icon helper
  const renderIconBadge = (iconKey?: string | null) => {
    switch (iconKey) {
      case "monitor":
        return (
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
          </svg>
        );
      case "cloud":
        return (
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
        );
      case "erp":
        return (
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
          </svg>
        );
      case "cart":
        return (
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        );
      case "window":
        return (
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="M2 8h20" />
            <circle cx="5" cy="6" r="0.5" fill="currentColor" />
            <circle cx="8" cy="6" r="0.5" fill="currentColor" />
          </svg>
        );
      case "code":
        return (
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case "server":
        return (
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
            <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
            <line x1="6" x2="6.01" y1="6" y2="6" />
            <line x1="6" x2="6.01" y1="18" y2="18" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-emerald-200 border border-emerald-800/80 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold">{successToast}</span>
          <button
            onClick={() => setSuccessToast("")}
            className="text-emerald-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Service Solutions System
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Services Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live home page service cards, solutions copy, features checklist, and display hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/#services"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 bg-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Preview Website</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Services
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Configured service offerings</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Active on Site
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{stats.active}</div>
          <div className="text-[11px] text-slate-400 mt-1">Visible to public visitors</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
              Inactive / Draft
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{stats.inactive}</div>
          <div className="text-[11px] text-slate-400 mt-1">Hidden from public page</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search service title, features, or copy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Order</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Short Description</th>
                <th className="py-3 px-4">Checklist Items</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading services...</span>
                    </div>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">📦</span>
                      <span className="font-semibold text-slate-600">No services found</span>
                      <p className="text-[11px] text-slate-400 max-w-sm">
                        No service records matched your filter criteria. Try clearing the search or add a new service.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service, index) => {
                  const feats = parseFeaturesArray(service.features);
                  const orderNum = String(service.displayOrder || index + 1).padStart(2, "0");

                  return (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Order Badge */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-100/80">
                          {orderNum}
                        </span>
                      </td>

                      {/* Service Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
                            {renderIconBadge(service.icon)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              {service.title}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              /{service.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Short Description */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">
                          {service.shortDescription}
                        </p>
                      </td>

                      {/* Checklist Items Preview */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {feats.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                            >
                              {f}
                            </span>
                          ))}
                          {feats.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              +{feats.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(service)}
                          title={`Click to switch to ${service.status === "Active" ? "Inactive" : "Active"}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                            service.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              service.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                            }`}
                          />
                          {service.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(service)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit service"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmItem({ id: service.id, title: service.title })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete service"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure card content, solutions copy, features checklist, and display settings.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Web Design"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. web-design (auto-generated if empty)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description (Card Subtitle) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="e.g. Modern, responsive and user-friendly web designs that create a strong online presence."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Description (Optional - For detail view or inquiry context)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Full solution breakdown, architecture, modern technologies used..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Features Checklist (Comma-separated list)
                </label>
                <textarea
                  rows={3}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="Corporate Website, Business Website, Landing Page, UI/UX Design, Responsive Web Design..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter items separated by commas. Each will appear as a checkmarked bullet on the service card.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Card Icon
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-emerald-500"
                  >
                    {PRESET_ICONS.map((icon) => (
                      <option key={icon.id} value={icon.id}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Position on the home page (1 is first, 7 is seventh).
                  </p>
                </div>
              </div>

              {/* Image Upload / Mockup URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Service Mockup / Cover Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="URL or upload image below"
                    value={formImage}
                    onChange={(e) => {
                      setFormImage(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors shrink-0"
                  >
                    {uploadingImage ? "Uploading..." : "Upload File"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormImage("");
                        setImagePreview("");
                      }}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formButtonText}
                    onChange={(e) => setFormButtonText(e.target.value)}
                    placeholder="Contact Now →"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={formHref}
                    onChange={(e) => setFormHref(e.target.value)}
                    placeholder="#contact"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formStatus === "Active"}
                      onChange={() => setFormStatus("Active")}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Active (Publicly visible)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formStatus === "Inactive"}
                      onChange={() => setFormStatus("Inactive")}
                      className="text-slate-600 focus:ring-slate-500"
                    />
                    <span>Inactive (Hidden)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            <h3 className="text-base font-black text-slate-900">
              Delete Service?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{deleteConfirmItem.title}"</span>? This will permanently remove it from the home page and database.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
