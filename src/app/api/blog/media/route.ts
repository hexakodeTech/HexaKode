import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/modules/portfolio/lib/supabaseAdmin";
import { verifyAdminAuth } from "@/lib/auth/utils";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminAuth();
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const mediaFiles: any[] = [];

    // Let's try listing from both blog-assets and portfolio-assets under blog/ subfolders
    const buckets = ["blog-assets", "portfolio-assets"];
    const subfolders = ["covers", "editor", "general"];

    for (const bucket of buckets) {
      for (const folder of subfolders) {
        const { data, error } = await supabase.storage
          .from(bucket)
          .list(`blog/${folder}`, { limit: 100, sortBy: { column: "created_at", order: "desc" } });

        if (error || !data) continue;

        for (const file of data) {
          if (file.name === ".emptyFolderPlaceholder") continue;
          
          const path = `blog/${folder}/${file.name}`;
          const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

          mediaFiles.push({
            name: file.name,
            id: file.id,
            bucket,
            path,
            url: publicUrlData?.publicUrl,
            metadata: file.metadata,
            createdAt: file.created_at,
          });
        }
      }
    }

    // Sort by createdAt descending
    mediaFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, files: mediaFiles });
  } catch (error: any) {
    console.error("[GET /api/blog/media]", error);
    return NextResponse.json({ success: false, files: [] });
  }
}
