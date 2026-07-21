import { z } from "zod";

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(slugRegex, "Slug must be lowercase with hyphens only"),
  description: z.string().max(500).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").regex(slugRegex, "Slug must be lowercase with hyphens only"),
});

export const updateTagSchema = createTagSchema.partial();

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").regex(slugRegex, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().max(500).optional(),
  content: z.string().default(""),
  featuredImage: z.string().url().optional().or(z.literal("")),
  authorName: z.string().max(100).optional(),
  authorAvatar: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  categoryId: z.string().uuid().optional().nullable(),
  publishedAt: z.coerce.date().optional().nullable(),
  readingTime: z.number().int().min(0).optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  seoTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(320).optional(),
  focusKeyword: z.string().max(100).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
});

export const updateBlogSchema = createBlogSchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
