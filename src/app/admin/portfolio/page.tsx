"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PortfolioItem, PortfolioStatus } from "@/lib/admin/types";

interface PortfolioStats {
  total: number;
  active: number;
  inactive: number;
  categoriesCount: number;
  categories: string[];
}

const DEFAULT_CATEGORIES = [
  "All",
  "Education",
  "E-Commerce",
  "SaaS App",
  "ERP Software",
  "Healthcare",
  "Real Estate",
  "FinTech",
  "Hospitality",
  "Web App",
  "Web Design",
  "Dynamic Website",
];

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    total: 0,
    active: 0,
    inactive: 0,
    categoriesCount: 0,
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("Web App");
  const [formType, setFormType] = useState("Online Platform");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState<string>("");
  const [formProjectUrl, setFormProjectUrl] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<PortfolioStatus>("Active");
  const [formTechStack, setFormTechStack] = useState("");
  const [formImpactMetric, setFormImpactMetric] = useState("");
  const [formImpactLabel, setFormImpactLabel] = useState("");

  // Image Upload Handling
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (categoryFilter !== "All") params.set("category", categoryFilter);

      const res = await fetch(`/api/admin/portfolio?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load portfolio projects:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("Web App");
    setFormType("Modern Web Application");
    setFormDescription("");
    setFormImage("");
    setImagePreview("");
    setFormProjectUrl("");
    setFormFeatures("Web App, Payment Integration, Admin Panel");
    setFormTags("All Projects, Web App, Dynamic Website");
    setFormDisplayOrder(projects.length + 1);
    setFormStatus("Active");
    setFormTechStack("Next.js 16, TypeScript, Tailwind CSS");
    setFormImpactMetric("");
    setFormImpactLabel("");
    setFormError("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (project: PortfolioItem) => {
    setEditingProject(project);
    setFormTitle(project.title);
    setFormSlug(project.slug);
    setFormCategory(project.category);
    setFormType(project.type);
    setFormDescription(project.description);
    setFormImage(project.image || "");
    setImagePreview(project.image || "");
    setFormProjectUrl(project.projectUrl || "");
    setFormFeatures(project.features);
    setFormTags(project.tags);
    setFormDisplayOrder(project.displayOrder);
    setFormStatus(project.status);
    setFormTechStack(project.techStack || "");
    setFormImpactMetric(project.impactMetric || "");
    setFormImpactLabel(project.impactLabel || "");
    setFormError("");
    setShowModal(true);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingProject) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(generated);
    }
  };

  // Handle Image File Selection & Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUploadingImage(true);
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/admin/portfolio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image file");
      }

      setFormImage(data.url);
      setImagePreview(data.url);
    } catch (err: any) {
      setFormError(err.message || "Failed to upload image file");
      setImagePreview(formImage);
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const payload = {
        title: formTitle.trim(),
        slug: formSlug.trim(),
        category: formCategory.trim(),
        type: formType.trim(),
        description: formDescription.trim(),
        image: formImage.trim() ? formImage.trim() : null,
        projectUrl: formProjectUrl.trim() ? formProjectUrl.trim() : null,
        features: formFeatures.trim(),
        tags: formTags.trim(),
        displayOrder: Number(formDisplayOrder) || 0,
        status: formStatus,
        techStack: formTechStack.trim() ? formTechStack.trim() : null,
        impactMetric: formImpactMetric.trim() ? formImpactMetric.trim() : null,
        impactLabel: formImpactLabel.trim() ? formImpactLabel.trim() : null,
      };

      const url = editingProject
        ? `/api/admin/portfolio/${editingProject.id}`
        : "/api/admin/portfolio";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save portfolio project");
      }

      setShowModal(false);
      fetchPortfolios();
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (project: PortfolioItem) => {
    const nextStatus: PortfolioStatus = project.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`/api/admin/portfolio/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchPortfolios();
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Delete Project
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPortfolios();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete portfolio project");
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Combine default categories with any custom ones loaded from database
  const availableCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...(stats.categories || [])])
  );

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Portfolio System
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Portfolio Projects
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live showcase cards, project case studies, categories, and image mockups.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/#portfolio"
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
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Projects</span>
            <span className="p-1.5 rounded-lg bg-slate-50 text-slate-600">📁</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.total}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">In database records</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active (Live)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">✓</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{stats.active}</div>
          <div className="text-[10px] text-emerald-600/80 mt-0.5">Visible on website</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Inactive</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">👁️‍🗨️</span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{stats.inactive}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Hidden drafts</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categories</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">🏷️</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.categoriesCount || availableCategories.length - 1}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Dynamic sectors</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, categories, tags..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-500 font-medium"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden"
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Preview</th>
                <th className="py-3.5 px-4">Project Name &amp; Slug</th>
                <th className="py-3.5 px-4">Category / Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full mb-2" />
                    <p className="text-xs">Loading portfolio projects...</p>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                      📁
                    </div>
                    <p className="text-slate-800 font-bold">No portfolio projects found</p>
                    <p className="text-xs mt-0.5">Try clearing filters or click &ldquo;Add New Project&rdquo; above.</p>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Display Order */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-[10px] inline-flex items-center justify-center">
                        #{project.displayOrder}
                      </span>
                    </td>

                    {/* Thumbnail / Image Preview */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {project.image ? (
                        <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-8 rounded-lg border border-slate-200 bg-zinc-900 text-emerald-400 font-mono text-[9px] font-bold flex flex-col items-center justify-center shrink-0">
                          <div className="flex gap-0.5 mb-0.5">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            <span className="w-1 h-1 rounded-full bg-amber-500" />
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          </div>
                          <span>UI MOCK</span>
                        </div>
                      )}
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{project.title}</div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>/portfolio/{project.slug}</span>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        {project.category}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1 truncate max-w-xs">{project.type}</div>
                    </td>

                    {/* Status with Quick Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(project)}
                        title="Click to toggle Active / Inactive status"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          project.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        {project.status === "Active" ? "Live" : "Inactive"}
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/portfolio/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 text-slate-400 hover:text-emerald-700 transition-colors"
                          title="View Live Project / Case Study"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </Link>

                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
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

      {/* Create / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingProject ? "Edit Portfolio Project" : "Add New Portfolio Project"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingProject
                    ? "Update project details, preview image, category, and frontend ordering"
                    : "Create a new project entry to display on the live website"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. EduLearn, TaskPro, FinEdge"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="edulearn"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Education, SaaS App, E-Commerce, ERP Software"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Project Type Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    placeholder="e.g. Online Learning Platform, Multi-Vendor Marketplace"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Project Demo / Live URL
                  </label>
                  <input
                    type="url"
                    value={formProjectUrl}
                    onChange={(e) => setFormProjectUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Project Card Image Upload & Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 uppercase">
                    Project Mockup / Preview Image
                  </label>
                  <span className="text-[10px] text-slate-400">PNG, JPG, WebP up to 5MB</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {imagePreview ? (
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-300 bg-zinc-950 shrink-0 shadow-xs">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormImage("");
                        }}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-28 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <span className="text-xl">🖼️</span>
                      <span className="text-[9px] mt-0.5 font-bold">Mockup/Image</span>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        {uploadingImage ? (
                          <>
                            <span className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <span>Upload Image</span>
                            <span>↑</span>
                          </>
                        )}
                      </button>

                      <span className="text-[10px] text-slate-400">or enter image path / URL below</span>
                    </div>

                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => {
                        setFormImage(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="/uploads/portfolio/... or https://..."
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short engaging description of what was built and why it matters..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Key Features (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="Web App, Payment Gateway, Admin Dashboard"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Filter Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="All Projects, Web App, SaaS App"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Display Order (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Website Visibility
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PortfolioStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden font-bold"
                  >
                    <option value="Active">Active (Live)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Tech Stack (Optional)
                  </label>
                  <input
                    type="text"
                    value={formTechStack}
                    onChange={(e) => setFormTechStack(e.target.value)}
                    placeholder="Next.js 16, PostgreSQL"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingProject
                    ? "Update Project"
                    : "Publish Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
