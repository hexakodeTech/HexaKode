"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BlogCard from "./BlogCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogGridProps {
  posts: any[];
  total: number;
  limit: number;
}

export default function BlogGrid({ posts, total, limit }: BlogGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/blog?${params.toString()}`);
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100/50">
        <p className="text-slate-400 text-base font-medium">
          No articles found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {posts.map((post) => (
          <div key={post._id} className="h-full">
            <BlogCard post={post} />
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4 border-t border-slate-100 pt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center border transition-all cursor-pointer",
                  currentPage === pageNum
                    ? "bg-primary border-primary text-white shadow-sm"
                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                )}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
