import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogForm from "@/modules/blog/components/BlogForm";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Post | HexaKode Console",
  description: "Compose a new industry insight or technical guide.",
};

export default function AdminNewBlogPage() {
  return (
    <AdminLayout>
      <BlogForm />
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
