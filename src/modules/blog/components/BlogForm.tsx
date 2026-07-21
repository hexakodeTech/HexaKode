"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBlogSchema } from "@/modules/blog/validation/schemas";
import { BlogListItem, BlogStatus } from "@/modules/blog/types/blog";
import { generateSlug } from "@/modules/blog/utils/helpers";
import BlogEditor from "./BlogEditor";
import {
  ArrowLeft,
  Loader2,
  Settings,
  Globe,
  Upload,
  X,
  FileText,
  Star,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogFormProps {
  initialData?: BlogListItem & { content?: string; seoTitle?: string; metaDescription?: string; focusKeyword?: string; canonicalUrl?: string; ogImage?: string };
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "HexaKode Team");
  const [authorAvatar, setAuthorAvatar] = useState(initialData?.authorAvatar || "");
  const [status, setStatus] = useState<BlogStatus>(initialData?.status || "DRAFT");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [categoryId, setCategoryId] = useState(initialData?.category?.id || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags?.map((t: any) => t.tag.id) || []
  );

  // SEO states
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [focusKeyword, setFocusKeyword] = useState(initialData?.focusKeyword || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");

  // Taxonomy states
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "author">("content");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSlugAuto, setIsSlugAuto] = useState(!isEdit);

  // Fetch categories and tags
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetch("/api/blog/categories").then((r) => r.json()),
          fetch("/api/blog/tags").then((r) => r.json()),
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (tagRes.success) setTags(tagRes.tags);
      } catch {
        toast.error("Failed to load taxonomies");
      }
    }
    loadTaxonomies();
  }, []);

  // Sync slug with title when title changes and slug is auto
  useEffect(() => {
    if (isSlugAuto && !isEdit) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugAuto, isEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "featured" | "og") => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", target === "featured" ? "covers" : "seo");

    setIsUploading(true);
    const loadingToast = toast.loading("Uploading asset...");
    try {
      const res = await fetch("/api/blog/media/upload", {
        method: "POST",
        body: formData,
      }).then((r) => r.json());

      if (res.success) {
        if (target === "featured") {
          setFeaturedImage(res.url);
          // Auto set ogImage if empty
          if (!ogImage) setOgImage(res.url);
        } else {
          setOgImage(res.url);
        }
        toast.success("Upload complete", { id: loadingToast });
      } else {
        toast.error(res.error || "Upload failed", { id: loadingToast });
      }
    } catch {
      toast.error("Upload failed", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagToggle = (id: string) => {
    if (selectedTagIds.includes(id)) {
      setSelectedTagIds(selectedTagIds.filter((t) => t !== id));
    } else {
      setSelectedTagIds([...selectedTagIds, id]);
    }
  };

  const handleSave = async (targetStatus?: BlogStatus) => {
    const finalStatus = targetStatus || status;
    const data = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      authorName,
      authorAvatar,
      status: finalStatus,
      featured,
      categoryId: categoryId || null,
      tagIds: selectedTagIds,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt,
      focusKeyword,
      canonicalUrl,
      ogImage: ogImage || featuredImage,
    };

    const validation = createBlogSchema.safeParse(data);
    if (!validation.success) {
      const errorMsgs = validation.error.flatten().fieldErrors;
      const firstError = Object.values(errorMsgs)[0]?.[0];
      toast.error(firstError || "Form validation failed");
      return;
    }

    setIsSaving(true);
    const loadToast = toast.loading(isEdit ? "Updating post..." : "Creating post...");
    try {
      const url = isEdit ? `/api/blog/${initialData.id}` : "/api/blog";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json());

      if (res.success) {
        toast.success(isEdit ? "Insight updated successfully" : "Insight created successfully", { id: loadToast });
        router.push("/admin/cms/blogs");
        router.refresh();
      } else {
        toast.error(res.error || "Operation failed", { id: loadToast });
      }
    } catch (err) {
      toast.error("Operation failed", { id: loadToast });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms/blogs"
            className="p-2 border border-outline-variant/30 hover:bg-surface-container-low rounded-xl text-on-surface-variant transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-headline-md text-base font-bold text-primary">
              {isEdit ? "Edit Insight Post" : "Draft New Insight"}
            </h1>
            <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
              {isEdit ? "Make modifications to live published content or edit draft parameters." : "Begin drafting an industry insight or technical guide."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleSave("DRAFT")}
            disabled={isSaving}
            className="px-4 py-2 border border-outline-variant/40 hover:bg-surface-container text-on-surface transition-all rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("PUBLISHED")}
            disabled={isSaving}
            className="px-4 py-2 bg-primary hover:bg-primary/95 text-white transition-all rounded-lg text-xs font-semibold shadow-premium cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </span>
            ) : (
              <span>Publish Live</span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant/10 gap-4">
        <button
          onClick={() => setActiveTab("content")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "content" ? "border-secondary text-primary font-bold" : "border-transparent text-on-surface-variant/75 hover:text-primary"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Content &amp; Meta
          </span>
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "seo" ? "border-secondary text-primary font-bold" : "border-transparent text-on-surface-variant/75 hover:text-primary"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4" /> SEO Tuning
          </span>
        </button>
        <button
          onClick={() => setActiveTab("author")}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "author" ? "border-secondary text-primary font-bold" : "border-transparent text-on-surface-variant/75 hover:text-primary"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Settings className="w-4 h-4" /> Author Details
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main section */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === "content" && (
            <div className="space-y-6">
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Post Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the title of the article..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  required
                />
              </div>

              {/* Slug input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-primary">URL Slug</label>
                  <button
                    type="button"
                    onClick={() => setIsSlugAuto(!isSlugAuto)}
                    className="text-[10px] text-secondary font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {isSlugAuto ? "Manual Slug" : "Auto slug from Title"}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant/40 select-none">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    disabled={isSlugAuto}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-14 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all disabled:bg-surface-container-low/40 disabled:text-on-surface-variant/60"
                    required
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Short Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Provide a quick summary (excerpt) for search results and cards..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all min-h-[80px]"
                />
              </div>

              {/* Content Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Article Content</label>
                <BlogEditor content={content} onChange={setContent} />
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-6 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30">
              <h3 className="font-bold text-sm text-primary pb-3 border-b border-outline-variant/20 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-secondary" />
                Google Search Results Mockup
              </h3>

              {/* SERP Preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-sans">
                <span className="text-[11px] text-slate-600 block line-clamp-1">
                  https://www.hexakode.in/blog/{slug || "post-slug"}
                </span>
                <span className="text-base text-blue-800 font-medium hover:underline block leading-snug mt-1 cursor-pointer line-clamp-1">
                  {seoTitle || title || "Article Title Preview"}
                </span>
                <span className="text-[12px] text-slate-700 block leading-relaxed mt-1 line-clamp-2">
                  {metaDescription || excerpt || "Your meta description preview will appear here. It is ideal to keep this under 160 characters for complete display on screens."}
                </span>
              </div>

              {/* SEO Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">SEO Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant/50">
                    <span>Target: 50-60 chars</span>
                    <span>{seoTitle.length} chars</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">Focus Keyword</label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. Next.js, app engineering"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all min-h-[80px]"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant/50">
                  <span>Target: 120-160 chars</span>
                  <span>{metaDescription.length} chars</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">Canonical URL</label>
                  <input
                    type="url"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://www.hexakode.in/blog/slug"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">Social (OG) Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="Upload custom OG image..."
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                    />
                    <label className="px-4 py-2 bg-surface-container border border-outline-variant/30 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer hover:bg-surface-container-high transition-all shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "og")}
                        className="hidden"
                      />
                      <Upload className="w-3.5 h-3.5" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "author" && (
            <div className="space-y-6 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30">
              <h3 className="font-bold text-sm text-primary pb-3 border-b border-outline-variant/20 flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-secondary" />
                Publishing Profile Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">Author Display Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">Author Avatar Image URL</label>
                  <input
                    type="url"
                    value={authorAvatar}
                    onChange={(e) => setAuthorAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar settings */}
        <div className="lg:col-span-4 space-y-6">
          {/* Post settings panel */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 space-y-5">
            <h3 className="font-bold text-xs text-primary uppercase font-mono tracking-wider pb-3 border-b border-outline-variant/10">
              Publishing Options
            </h3>

            {/* Featured Post Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-primary flex items-center gap-1">
                  <Star className={`w-3.5 h-3.5 ${featured ? "fill-amber-500 text-amber-500" : "text-on-surface-variant/40"}`} />
                  Featured Post
                </span>
                <span className="text-[9px] text-on-surface-variant/60">
                  Highlight this article in the hero slot of the blog listing.
                </span>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-outline-variant text-secondary focus:ring-secondary cursor-pointer w-4 h-4"
              />
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary">Post Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BlogStatus)}
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="DRAFT">Draft Mode</option>
                <option value="PUBLISHED">Published Live</option>
              </select>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover image panel */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-xs text-primary uppercase font-mono tracking-wider pb-3 border-b border-outline-variant/10">
              Featured Cover Image
            </h3>

            {featuredImage ? (
              <div className="relative w-full aspect-video rounded-xl border border-outline-variant/30 overflow-hidden bg-slate-50 group">
                <Image
                  src={featuredImage}
                  alt="Featured cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFeaturedImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-outline-variant/50 hover:border-secondary/40 transition-all cursor-pointer bg-surface-container-low/20">
                <div className="flex flex-col items-center p-4 text-center">
                  <Upload className="w-6 h-6 text-on-surface-variant/45 mb-2" />
                  <span className="text-xs font-bold text-primary">Upload Cover</span>
                  <span className="text-[9px] text-on-surface-variant/50 mt-0.5">JPEG, PNG, WebP · Max 5MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "featured")}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Tags panel */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-xs text-primary uppercase font-mono tracking-wider pb-3 border-b border-outline-variant/10">
              Tags Selection
            </h3>

            {tags.length === 0 ? (
              <span className="text-[10px] italic text-on-surface-variant/50">
                No tags created. Manage tags from the menu.
              </span>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {tags.map((t) => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTagToggle(t.id)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-secondary text-white border-secondary shadow-sm"
                          : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
