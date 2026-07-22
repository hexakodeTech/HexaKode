import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/utils";
import { duplicateBlog } from "@/modules/blog/services/blog.service";

interface Params { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    await verifyAdminAuth();
    const { id } = await params;
    const blog = await duplicateBlog(id);
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/blog/[id]/duplicate]", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to duplicate" }, { status: 500 });
  }
}
