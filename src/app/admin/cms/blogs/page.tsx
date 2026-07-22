import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogsTable from "@/modules/blog/components/BlogsTable";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Content Management | HexaKode Console",
  description: "Create, edit, duplicate, search, and manage all your blogs natively.",
};

export default function AdminBlogsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        <div>
          <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
            Insight &amp; Blog Management
          </h1>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Organize articles, schedule releases, configure custom category channels, and refine SEO metadata.
          </p>
        </div>

        <BlogsTable />
      </div>
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
