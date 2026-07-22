"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster, toast } from "sonner";
import { Plus, Trash2, Edit2, Check, X, Loader2, Tag } from "lucide-react";
import { generateSlug } from "@/modules/blog/utils/helpers";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugAuto, setIsSlugAuto] = useState(true);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  useEffect(() => {
    if (isSlugAuto) {
      setSlug(generateSlug(name));
    }
  }, [name, isSlugAuto]);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog/tags").then((r) => r.json());
      if (res.success) setTags(res.tags);
    } catch {
      toast.error("Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success("Tag created successfully");
        setName("");
        setSlug("");
        setIsSlugAuto(true);
        loadTags();
      } else {
        toast.error(res.error || "Failed to create tag");
      }
    } catch {
      toast.error("Failed to create tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (tag: any) => {
    setEditingId(tag.id);
    setEditName(tag.name);
    setEditSlug(tag.slug);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/tags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, slug: editSlug }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success("Tag updated successfully");
        setEditingId(null);
        loadTags();
      } else {
        toast.error(res.error || "Failed to update tag");
      }
    } catch {
      toast.error("Failed to update tag");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      const res = await fetch(`/api/blog/tags/${id}`, { method: "DELETE" }).then((r) => r.json());
      if (res.success) {
        toast.success("Tag deleted");
        loadTags();
      } else {
        toast.error(res.error || "Failed to delete tag");
      }
    } catch {
      toast.error("Failed to delete tag");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        <div>
          <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
            Tags Taxonomy
          </h1>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Create granular keywords (tags) to tag and link articles, improving discoverability and search filters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Tag Form */}
          <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase font-mono tracking-wider pb-3 border-b border-outline-variant/10 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-secondary" /> Add New Tag
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-primary">Tag Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js"
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-primary">Slug</label>
                  <button
                    type="button"
                    onClick={() => setIsSlugAuto(!isSlugAuto)}
                    className="text-[9px] text-secondary font-semibold hover:underline"
                  >
                    {isSlugAuto ? "Manual" : "Auto"}
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  disabled={isSlugAuto}
                  placeholder="nextjs"
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-semibold shadow-premium cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Add Tag"}
              </button>
            </form>
          </div>

          {/* List Tags */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-card">
            <div className="p-5 border-b border-outline-variant/30">
              <h2 className="text-xs font-bold text-primary uppercase font-mono tracking-wider">
                Existing Tags
              </h2>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/40">
                    <th className="px-6 py-3.5 font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold w-1/2">
                      Tag Name &amp; Slug
                    </th>
                    <th className="px-6 py-3.5 font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold w-1/4 text-center">
                      Tagged Blogs
                    </th>
                    <th className="px-6 py-3.5 font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold w-1/4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-10">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                          <span className="text-xs text-on-surface-variant/70">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : tags.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-xs italic text-on-surface-variant/50">
                        No tags created yet.
                      </td>
                    </tr>
                  ) : (
                    tags.map((tag) => {
                      const isEditing = editingId === tag.id;
                      return (
                        <tr key={tag.id} className="hover:bg-surface-container-low/20 transition-colors">
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="space-y-2 max-w-xs">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full bg-surface-container border border-outline-variant/30 rounded px-2 py-1 text-xs text-on-surface"
                                />
                                <input
                                  type="text"
                                  value={editSlug}
                                  onChange={(e) => setEditSlug(generateSlug(e.target.value))}
                                  className="w-full bg-surface-container border border-outline-variant/30 rounded px-2 py-1 text-xs text-on-surface font-mono"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5 text-on-surface-variant/40" />
                                <div className="flex flex-col">
                                  <span className="font-semibold text-xs text-primary">{tag.name}</span>
                                  <code className="text-[9px] text-secondary font-mono">#{tag.slug}</code>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-xs font-semibold text-primary">
                            {tag._count?.blogs || 0}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdate(tag.id)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                                  title="Save"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 text-slate-400 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleStartEdit(tag)}
                                  className="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors cursor-pointer"
                                  title="Edit tag"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(tag.id)}
                                  className="p-1 text-on-surface-variant hover:text-error hover:bg-surface-container rounded transition-colors cursor-pointer"
                                  title="Delete tag"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
