"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster, toast } from "sonner";
import { FolderPlus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { generateSlug } from "@/modules/blog/utils/helpers";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isSlugAuto, setIsSlugAuto] = useState(true);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (isSlugAuto) {
      setSlug(generateSlug(name));
    }
  }, [name, isSlugAuto]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog/categories").then((r) => r.json());
      if (res.success) setCategories(res.categories);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success("Category created successfully");
        setName("");
        setSlug("");
        setDescription("");
        setIsSlugAuto(true);
        loadCategories();
      } else {
        toast.error(res.error || "Failed to create category");
      }
    } catch {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, slug: editSlug, description: editDescription }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success("Category updated successfully");
        setEditingId(null);
        loadCategories();
      } else {
        toast.error(res.error || "Failed to update category");
      }
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Any associated blogs will become uncategorized.")) return;
    try {
      const res = await fetch(`/api/blog/categories/${id}`, { method: "DELETE" }).then((r) => r.json());
      if (res.success) {
        toast.success("Category deleted");
        loadCategories();
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        <div>
          <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
            Categories Taxonomy
          </h1>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Create and edit channels to categorize your blog publications and optimize navigational search paths.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Category Form */}
          <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-primary uppercase font-mono tracking-wider pb-3 border-b border-outline-variant/10 flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4 text-secondary" /> Add New Category
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-primary">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Technology"
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
                  placeholder="technology"
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-primary">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for SEO..."
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary min-h-[60px]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-semibold shadow-premium cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Add Category"}
              </button>
            </form>
          </div>

          {/* List Categories */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-card">
            <div className="p-5 border-b border-outline-variant/30">
              <h2 className="text-xs font-bold text-primary uppercase font-mono tracking-wider">
                Existing Categories
              </h2>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/40">
                    <th className="px-6 py-3.5 font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold w-1/3">
                      Name &amp; Slug
                    </th>
                    <th className="px-6 py-3.5 font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold w-5/12">
                      Description
                    </th>
                    <th className="px-6 py-3.5 font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold w-1/12 text-center">
                      Posts
                    </th>
                    <th className="px-6 py-3.5 font-label-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-semibold w-2/12 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                          <span className="text-xs text-on-surface-variant/70">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-xs italic text-on-surface-variant/50">
                        No categories created yet.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => {
                      const isEditing = editingId === cat.id;
                      return (
                        <tr key={cat.id} className="hover:bg-surface-container-low/20 transition-colors">
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <div className="space-y-2">
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
                              <div className="flex flex-col">
                                <span className="font-semibold text-xs text-primary">{cat.name}</span>
                                <code className="text-[10px] text-secondary font-mono mt-0.5">/{cat.slug}</code>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/30 rounded px-2 py-1 text-xs text-on-surface min-h-[50px]"
                              />
                            ) : (
                              <span className="text-[11px] text-on-surface-variant/70 line-clamp-2 leading-relaxed">
                                {cat.description || <span className="italic text-on-surface-variant/40">No description</span>}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-xs font-semibold text-primary">
                            {cat._count?.blogs || 0}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdate(cat.id)}
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
                                  onClick={() => handleStartEdit(cat)}
                                  className="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors cursor-pointer"
                                  title="Edit category"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(cat.id)}
                                  disabled={cat._count?.blogs > 0}
                                  className="p-1 text-on-surface-variant hover:text-error hover:bg-surface-container rounded transition-colors cursor-pointer disabled:opacity-30 disabled:hover:text-on-surface-variant disabled:hover:bg-transparent"
                                  title={cat._count?.blogs > 0 ? "Cannot delete category with posts" : "Delete category"}
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
