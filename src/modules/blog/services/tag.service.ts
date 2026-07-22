import prisma from "@/lib/prisma";
import { CreateTagInput, UpdateTagInput } from "@/modules/blog/validation/schemas";

export async function getAllTags() {
  try {
    return await prisma.blogTag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { blogs: true } } },
    });
  } catch (error) {
    console.error("Failed to query tags:", error);
    return [];
  }
}

export async function getTagBySlug(slug: string) {
  try {
    return await prisma.blogTag.findUnique({ where: { slug } });
  } catch (error) {
    console.error("Failed to query tag by slug:", error);
    return null;
  }
}

export async function createTag(input: CreateTagInput) {
  return prisma.blogTag.create({ data: input });
}

export async function updateTag(id: string, input: UpdateTagInput) {
  return prisma.blogTag.update({ where: { id }, data: input });
}

export async function deleteTag(id: string) {
  return prisma.blogTag.delete({ where: { id } });
}
