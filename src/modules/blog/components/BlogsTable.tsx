"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import {
  Plus,
  Eye,
  Trash2,
  Copy,
  CheckCircle,
  FileEdit,
  Star,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { BlogListItem, BlogStatus } from "@/modules/blog/types/blog";
import { formatBlogDate } from "@/modules/blog/utils/helpers";

export default function BlogsTable() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Load blogs & categories
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [blogRes, catRes] = await Promise.all([
          fetch("/api/blog?limit=1000&status=all").then((r) => r.json()),
          fetch("/api/blog/categories").then((r) => r.json()),
        ]);

        if (blogRes.success) setBlogs(blogRes.posts);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        toast.error("Failed to load CMS data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDuplicate = async (id: string) => {
    setActionInProgress(id);
    try {
      const res = await fetch(`/api/blog/${id}/duplicate`, { method: "POST" }).then((r) => r.json());
      if (res.success) {
        toast.success("Blog duplicated as draft");
        setBlogs([res.blog, ...blogs]);
      } else {
        toast.error(res.error || "Failed to duplicate blog");
      }
    } catch {
      toast.error("Failed to duplicate blog");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setActionInProgress(id);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" }).then((r) => r.json());
      if (res.success) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter((b) => b.id !== id));
      } else {
        toast.error(res.error || "Failed to delete blog");
      }
    } catch {
      toast.error("Failed to delete blog");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleFeatured = async (post: BlogListItem) => {
    setActionInProgress(post.id);
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !post.featured }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success(post.featured ? "Removed from featured" : "Marked as featured");
        setBlogs(blogs.map((b) => (b.id === post.id ? { ...b, featured: !post.featured } : b)));
      } else {
        toast.error(res.error || "Failed to update blog");
      }
    } catch {
      toast.error("Failed to update blog");
    } finally {
      setActionInProgress(null);
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: "delete" | "publish" | "draft") => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !confirm(`Are you sure you want to delete the ${selectedIds.length} selected posts?`)) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/blog/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success(`Bulk operation completed successfully`);
        if (action === "delete") {
          setBlogs(blogs.filter((b) => !selectedIds.includes(b.id)));
        } else {
          const status = action === "publish" ? "PUBLISHED" as const : "DRAFT" as const;
          setBlogs(
            blogs.map((b) =>
              selectedIds.includes(b.id)
                ? { ...b, status, publishedAt: action === "publish" ? new Date() : b.publishedAt }
                : b
            )
          );
        }
        setSelectedIds([]);
      } else {
        toast.error(res.error || "Bulk action failed");
      }
    } catch {
      toast.error("Bulk action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredBlogs.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  // Filter & Search Logic
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || b.category?.id === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const displayedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Bulk actions panel when items are selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl">
          <span className="text-xs font-semibold text-primary">
            {selectedIds.length} items selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction("publish")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction("draft")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Revert to Draft
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}

      <DataTable
        title="Blog Articles"
        subtitle="Manage public insights, authors, scheduling, and SEO configurations."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search blogs..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        actionSlot={
          <Link
            href="/admin/cms/blogs/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary/95 transition-all rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </Link>
        }
        filterSlot={
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-surface-container-low/60 border border-outline-variant/30 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-surface-container-low/60 border border-outline-variant/30 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        }
        headers={[
          "", // checkbox
          "Title & Category",
          "Author",
          "Status",
          "Date & Views",
          "Actions",
        ]}
      >
        {isLoading ? (
          <tr>
            <td colSpan={6} className="text-center py-12 text-on-surface-variant/50">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                <span className="text-xs">Loading insights archive...</span>
              </div>
            </td>
          </tr>
        ) : displayedBlogs.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-12 text-xs italic text-on-surface-variant/50">
              No blog posts found matching your current query.
            </td>
          </tr>
        ) : (
          displayedBlogs.map((post) => {
            const isFeatured = post.featured;
            const isSelected = selectedIds.includes(post.id);

            return (
              <tr key={post.id} className="hover:bg-surface-container-low/20 transition-colors">
                <td className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleSelectRow(post.id, e.target.checked)}
                    className="rounded border-outline-variant text-secondary focus:ring-secondary w-3.5 h-3.5"
                  />
                </td>
                <td className="px-6 py-4 max-w-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-primary line-clamp-1">
                      {post.title}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/60 mt-0.5">
                      {post.category?.name || "Uncategorized"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-primary">
                  {post.authorName}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                      post.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}
                  >
                    {post.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant/70">
                      {formatBlogDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="text-[9px] text-on-surface-variant/50 mt-0.5">
                      {post.views} views · {post.readingTime} min
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/cms/blogs/${post.id}`}
                      className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      title="Edit article"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleToggleFeatured(post)}
                      className={`p-1 hover:bg-surface-container rounded transition-colors cursor-pointer ${
                        isFeatured ? "text-amber-500" : "text-on-surface-variant/40 hover:text-amber-500"
                      }`}
                      title={isFeatured ? "Remove from featured" : "Mark as featured"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFeatured ? "fill-amber-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(post.id)}
                      className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                      title="Duplicate as draft"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </DataTable>
    </div>
  );
}
