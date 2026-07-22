"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster, toast } from "sonner";
import { Upload, Trash2, Copy, ExternalLink, Image as ImageIcon, Loader2, Check } from "lucide-react";
import Image from "next/image";

export default function AdminMediaLibraryPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog/media").then((r) => r.json());
      if (res.success) {
        setFiles(res.files);
      }
    } catch {
      toast.error("Failed to fetch media assets");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    const filesToUpload = Array.from(e.target.files);
    
    let uploadedCount = 0;
    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "general");

      try {
        const res = await fetch("/api/blog/media/upload", {
          method: "POST",
          body: formData,
        }).then((r) => r.json());

        if (res.success) {
          uploadedCount++;
        } else {
          toast.error(`Failed to upload ${file.name}: ${res.error}`);
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (uploadedCount > 0) {
      toast.success(`Uploaded ${uploadedCount} image(s)`);
      loadMedia();
    }
    setIsUploading(false);
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (file: any) => {
    if (!confirm("Are you sure you want to delete this asset? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/blog/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: file.path, bucket: file.bucket }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success("Asset deleted successfully");
        setFiles(files.filter((f) => f.id !== file.id));
      } else {
        toast.error(res.error || "Failed to delete asset");
      }
    } catch {
      toast.error("Failed to delete asset");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <div>
            <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
              CMS Media Library
            </h1>
            <p className="text-xs text-on-surface-variant/70 mt-1">
              Upload and manage cover images, articles graphics, and asset files.
            </p>
          </div>

          <div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white transition-all rounded-lg text-xs font-semibold shadow-premium cursor-pointer disabled:opacity-50">
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Images</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isUploading}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            <span className="text-xs text-on-surface-variant/60">Browsing remote buckets...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant/30 rounded-2xl bg-surface-container-low/20">
            <ImageIcon className="w-10 h-10 text-on-surface-variant/40 mb-3" />
            <span className="text-xs font-bold text-primary">No assets uploaded yet</span>
            <span className="text-[10px] text-on-surface-variant/50 mt-1">Use the upload button above to add media assets.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => {
              const isCopied = copiedId === file.id;
              return (
                <div
                  key={file.id}
                  className="group relative bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm hover:shadow-premium hover:border-secondary/20 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-square bg-slate-50 overflow-hidden w-full">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-102 transition-all"
                    />

                    {/* Hover actions overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5 p-2">
                      <button
                        onClick={() => handleCopyLink(file.url, file.id)}
                        className="p-2 bg-white hover:bg-slate-50 text-slate-800 rounded-lg shadow transition-colors cursor-pointer"
                        title="Copy image link"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white hover:bg-slate-50 text-slate-800 rounded-lg shadow transition-colors cursor-pointer flex items-center justify-center"
                        title="View original image"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(file)}
                        className="p-2 bg-white hover:bg-rose-50 text-rose-600 rounded-lg shadow transition-colors cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata display */}
                  <div className="p-2.5 border-t border-outline-variant/10 text-left">
                    <span className="text-[10px] font-semibold text-primary block truncate" title={file.name}>
                      {file.name}
                    </span>
                    <div className="flex items-center justify-between mt-1 text-[8px] text-on-surface-variant/50">
                      <span>{file.bucket === "blog-assets" ? "Blog Bucket" : "Portfolio Bucket"}</span>
                      <span>
                        {file.metadata?.size
                          ? `${(file.metadata.size / 1024).toFixed(0)} KB`
                          : "Image"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
