import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/utils";
import { getAllCategories, createCategory, deleteCategory, updateCategory } from "@/modules/blog/services/category.service";
import { createCategorySchema, updateCategorySchema } from "@/modules/blog/validation/schemas";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminAuth();
    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    const category = await createCategory(parsed.data);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ success: false, error: "Category with this slug already exists" }, { status: 409 });
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
