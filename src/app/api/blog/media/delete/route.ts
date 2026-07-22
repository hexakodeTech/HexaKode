import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/modules/portfolio/lib/supabaseAdmin";
import { verifyAdminAuth } from "@/lib/auth/utils";

export async function POST(req: NextRequest) {
  try {
    await verifyAdminAuth();
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { path, bucket } = await req.json();

    if (!path || !bucket) {
      return NextResponse.json({ success: false, error: "Missing path or bucket parameters" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/blog/media/delete]", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete file" }, { status: 500 });
  }
}
