import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/modules/portfolio/lib/supabaseAdmin";
import { verifyAdminAuth } from "@/lib/auth/utils";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  // CSRF check
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ success: false, error: "CSRF check failed" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ success: false, error: "Malformed origin" }, { status: 403 });
    }
  }

  try {
    await verifyAdminAuth();
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "File too large. Max 5MB." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `blog/${folder}/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Attempt upload to 'blog-assets' bucket
    let bucket = "blog-assets";
    let uploadResult = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    // Fallback to 'portfolio-assets' bucket if 'blog-assets' fails (e.g., if it doesn't exist)
    if (uploadResult.error) {
      bucket = "portfolio-assets";
      uploadResult = await supabase.storage.from(bucket).upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });
    }

    if (uploadResult.error) throw uploadResult.error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ success: true, url: data.publicUrl, path, bucket });
  } catch (error: any) {
    console.error("[POST /api/blog/media/upload]", error);
    return NextResponse.json({ success: false, error: error.message || "Upload failed" }, { status: 500 });
  }
}
