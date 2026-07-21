import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogForm from "@/modules/blog/components/BlogForm";
import { getBlogById } from "@/modules/blog/services/blog.service";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: EditPageProps): Promise<Metadata> {
  const { id } = await props.params;
  const blog = await getBlogById(id).catch(() => null);
  return {
    title: blog ? `Edit: ${blog.title} | HexaKode Console` : "Edit Post | HexaKode Console",
  };
}

export default async function AdminEditBlogPage(props: EditPageProps) {
  const { id } = await props.params;
  const rawBlog = await getBlogById(id).catch(() => null);
  if (!rawBlog) notFound();

  // Adapt the shape to what BlogForm expects
  const blog: any = {
    ...rawBlog,
    category: rawBlog.category ? { id: rawBlog.category.id, name: rawBlog.category.name, slug: rawBlog.category.slug } : null,
    tags: rawBlog.tags.map((t: any) => ({
      tag: { id: t.tag.id, name: t.tag.name, slug: t.tag.slug }
    }))
  };

  return (
    <AdminLayout>
      <BlogForm initialData={blog} />
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
