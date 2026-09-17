"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BlogPost, BlogStatus } from "@/lib/admin/types";

interface BlogStats {
  total: number;
  published: number;
  drafts: number;
  totalViews: number;
}

const CATEGORIES = [
  "All",
  "Architecture",
  "Design & UX",
  "Performance",
  "Enterprise Software",
  "Engineering",
  "Cloud & DevOps",
];

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("Engineering");
  const [formReadTime, setFormReadTime] = useState("5 min read");
  const [formAuthor, setFormAuthor] = useState("Web Editorial");
  const [formTags, setFormTags] = useState("Next.js, Web Architecture");
  const [formStatus, setFormStatus] = useState<BlogStatus>("Published");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (categoryFilter !== "All") params.set("category", categoryFilter);

      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load blog posts:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("Engineering");
    setFormReadTime("5 min read");
    setFormAuthor("Web Editorial");
    setFormTags("Next.js, Architecture");
    setFormStatus("Published");
    setFormExcerpt("");
    setFormContent("");
    setFormCoverImage("");
    setFormError("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormCategory(post.category);
    setFormReadTime(post.readTime);
    setFormAuthor(post.author);
    setFormTags(post.tags);
    setFormStatus(post.status);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCoverImage(post.coverImage || "");
    setFormError("");
    setShowModal(true);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingPost) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(generated);
    }
  };

  // Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const payload = {
        title: formTitle,
        slug: formSlug,
        category: formCategory,
        readTime: formReadTime,
        author: formAuthor,
        tags: formTags,
        status: formStatus,
        excerpt: formExcerpt,
        content: formContent,
        coverImage: formCoverImage.trim() ? formCoverImage.trim() : null,
      };

      const url = editingPost
        ? `/api/admin/blogs/${editingPost.id}`
        : "/api/admin/blogs";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save blog post");
      }

      setShowModal(false);
      fetchBlogs();
    } catch (err: any) {
      setFormError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (post: BlogPost) => {
    const nextStatus: BlogStatus = post.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch(`/api/admin/blogs/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Delete Post
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBlogs();
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Blog & Content Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish engineering articles, tech insights, and manage the live editorial feed
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer self-start sm:self-auto transform active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>+ Write Article</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Articles</span>
            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 text-sm">
              📚
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 block mt-2">
            {stats.total}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Live Published</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-black">
              ✓
            </span>
          </div>
          <span className="text-2xl font-black text-emerald-700 block mt-2">
            {stats.published}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Drafts</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-black">
              ✎
            </span>
          </div>
          <span className="text-2xl font-black text-amber-700 block mt-2">
            {stats.drafts}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Article Reads</span>
            <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-sm">
              👁️
            </span>
          </div>
          <span className="text-2xl font-black text-teal-700 block mt-2">
            {stats.totalViews.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
          {["All", "Published", "Draft", "Archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-white text-emerald-800 shadow-xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-hidden"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, tags, author..."
              className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl outline-hidden text-slate-800 placeholder-slate-400 w-full sm:w-56"
            />
            <svg
              className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                <th className="py-3.5 px-4">Article Title & Details</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Author</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-center">Reads</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading articles...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <span className="text-3xl block">📰</span>
                      <p className="font-bold text-slate-800 text-sm">No articles found</p>
                      <p className="text-slate-500 text-xs">
                        Start building your company blog by creating your first article.
                      </p>
                      <button
                        onClick={handleOpenCreate}
                        className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        + Create Article
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="max-w-md">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-emerald-700 transition-colors block text-xs leading-snug line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                          /blog/{post.slug}
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                          {post.excerpt}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block text-xs">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {post.readTime}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(post)}
                        title="Click to toggle Published / Draft"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          post.status === "Published"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : post.status === "Draft"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.status === "Published"
                              ? "bg-emerald-600"
                              : post.status === "Draft"
                              ? "bg-amber-600"
                              : "bg-slate-400"
                          }`}
                        />
                        <span>{post.status}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-700 text-xs">
                        {post.views}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 text-slate-400 hover:text-emerald-700 transition-colors"
                          title="View Live Article"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </Link>

                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Article"
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

      {/* Create / Edit Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingPost ? "Edit Article" : "Create New Article"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingPost
                    ? "Update post content, status, and taxonomy"
                    : "Draft and publish new engineering insights"}
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
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Building Resilient SaaS Architectures with Next.js"
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
                    placeholder="building-resilient-saas-architectures"
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
                    placeholder="Architecture, Design & UX, Performance..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Author name"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="e.g. 6 min read"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as BlogStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden font-bold"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Next.js, SaaS, Cloud, UI/UX"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Excerpt (Summary for cards & SEO) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Short engaging summary of the article..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Full Article Content *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write the full content of the article here (Markdown and multi-paragraph text supported)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-hidden font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingPost
                    ? "Update Article"
                    : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
