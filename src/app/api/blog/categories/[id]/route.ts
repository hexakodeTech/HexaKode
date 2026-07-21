import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/utils";
import { updateCategory, deleteCategory } from "@/modules/blog/services/category.service";
import { updateCategorySchema } from "@/modules/blog/validation/schemas";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await verifyAdminAuth();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateCategorySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    const category = await updateCategory(id, parsed.data);
    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ success: false, error: "Slug already in use" }, { status: 409 });
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await verifyAdminAuth();
    const { id } = await params;
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
