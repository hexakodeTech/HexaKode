import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster } from "sonner";
import { Metadata } from "next";
import {
  Database,
  BookOpen,
  Layers,
  Tag,
  Image as ImageIcon,
  Plus,
  Eye,
  FileText,
  FileEdit,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getBlogStats } from "@/modules/blog/services/blog.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Native CMS | HexaKode Console",
  description: "Manage blogs, categories, tags, and media internally.",
};

export default async function AdminCMSPage() {
  let stats = { total: 0, published: 0, drafts: 0, featured: 0, totalViews: 0 };
  
  try {
    stats = await getBlogStats();
  } catch (error) {
    console.error("Error fetching native CMS stats:", error);
  }

  const quickStats = [
    { name: "Total Posts", value: stats.total, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Published", value: stats.published, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Drafts", value: stats.drafts, icon: FileEdit, color: "text-amber-500", bg: "bg-amber-50" },
    { name: "Total Views", value: stats.totalViews, icon: Eye, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const modules = [
    {
      name: "Blogs",
      desc: "Manage articles, edit copy, SEO, images, and publish statuses.",
      count: `${stats.total} Posts`,
      path: "/admin/cms/blogs",
      action: "Manage Blogs",
      icon: BookOpen,
    },
    {
      name: "Categories",
      desc: "Organize your articles into custom taxonomies like Tech, Design, etc.",
      count: "Dynamic",
      path: "/admin/cms/categories",
      action: "Manage Categories",
      icon: Layers,
    },
    {
      name: "Tags",
      desc: "Tag blog posts with granular keywords to improve SEO and discovery.",
      count: "Dynamic",
      path: "/admin/cms/tags",
      action: "Manage Tags",
      icon: Tag,
    },
    {
      name: "Media Library",
      desc: "Upload, browse, folder, and optimize images stored on Supabase.",
      count: "S3 / CDN",
      path: "/admin/cms/media",
      action: "Open Media",
      icon: ImageIcon,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        <div>
          <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
            HexaKode Native CMS
          </h1>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Create, edit, organize, and analyze all public-facing site content directly from your admin console.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/cms/blogs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/95 transition-all rounded-lg text-xs font-semibold shadow-premium cursor-pointer hover:shadow-premium-hover hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Blog Post</span>
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-all rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Live Blog</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className="p-5 bg-surface-container-lowest border border-outline-variant/20 rounded-xl hover:shadow-premium transition-all duration-300 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] text-on-surface-variant/70 uppercase font-mono font-medium tracking-wide">
                    {s.name}
                  </span>
                  <h3 className="font-headline-md text-xl font-bold text-primary mt-1">
                    {s.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CMS Modules */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant/20 mb-6">
            <Database className="w-4 h-4 text-secondary" />
            <h3 className="font-headline-sm text-sm font-semibold text-primary">
              Content Management Services
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.name}
                  className="p-5 bg-surface-container-low/30 border border-outline-variant/20 rounded-xl flex flex-col justify-between hover:border-secondary/25 hover:shadow-premium transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-secondary/10 text-secondary rounded-lg">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] bg-secondary-container/20 text-on-secondary-container px-2 py-0.5 rounded-full font-bold border border-secondary-container/40">
                        {m.count}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-sm font-bold text-primary">{m.name}</h4>
                      <p className="text-[11px] text-on-surface-variant/70 mt-1 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-outline-variant/10">
                    <Link
                      href={m.path}
                      className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 bg-surface-container text-primary hover:bg-surface-container-high rounded-lg text-xs font-semibold transition-all"
                    >
                      <span>{m.action}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Future Integrations / Info */}
        <div className="p-5 bg-secondary/5 border border-secondary/15 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-secondary flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Scalable Content Engine
            </h4>
            <p className="text-[11px] text-on-surface-variant/80 leading-relaxed max-w-xl">
              This CMS is built natively using your Supabase database and storage, making it incredibly fast and completely free of third-party limits. Next phases will allow managing Services, Testimonials, and Careers.
            </p>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
