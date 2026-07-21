import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth/utils";
import { getAllTags, createTag } from "@/modules/blog/services/tag.service";
import { createTagSchema } from "@/modules/blog/validation/schemas";

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json({ success: true, tags });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminAuth();
    const body = await req.json();
    const parsed = createTagSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    const tag = await createTag(parsed.data);
    return NextResponse.json({ success: true, tag }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") return NextResponse.json({ success: false, error: "Tag with this slug already exists" }, { status: 409 });
    return NextResponse.json({ success: false, error: "Failed to create tag" }, { status: 500 });
  }
}
