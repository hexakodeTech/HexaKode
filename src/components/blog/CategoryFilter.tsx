"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  const handleSelectCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex gap-2.5 min-w-max pb-1">
        <button
          onClick={() => handleSelectCategory("")}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer",
            activeCategory === ""
              ? "bg-primary border-primary text-white shadow-sm"
              : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-700"
          )}
        >
          All Insights
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleSelectCategory(cat.slug)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer",
              activeCategory === cat.slug
                ? "bg-primary border-primary text-white shadow-sm"
                : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-700"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
