import prisma from "@/lib/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "@/modules/blog/validation/schemas";

export async function getAllCategories() {
  try {
    return await prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { blogs: true } } },
    });
  } catch (error) {
    console.error("Failed to query categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.blogCategory.findUnique({ where: { slug } });
  } catch (error) {
    console.error("Failed to query category by slug:", error);
    return null;
  }
}

export async function createCategory(input: CreateCategoryInput) {
  return prisma.blogCategory.create({ data: input });
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  return prisma.blogCategory.update({ where: { id }, data: input });
}

export async function deleteCategory(id: string) {
  return prisma.blogCategory.delete({ where: { id } });
}
