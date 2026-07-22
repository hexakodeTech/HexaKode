import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/utils";
import { updateTag, deleteTag } from "@/modules/blog/services/tag.service";
import { updateTagSchema } from "@/modules/blog/validation/schemas";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await verifyAdminAuth();
    const { id } = await params;
    const body = await req.json();
    const parsed = updateTagSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    const tag = await updateTag(id, parsed.data);
    return NextResponse.json({ success: true, tag });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ success: false, error: "Slug already in use" }, { status: 409 });
    return NextResponse.json({ success: false, error: "Failed to update tag" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await verifyAdminAuth();
    const { id } = await params;
    await deleteTag(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === "P2025") return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: false, error: "Failed to delete tag" }, { status: 500 });
  }
}
