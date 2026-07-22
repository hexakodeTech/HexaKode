"use client";

import React, { useState, useEffect } from "react";
import { TocHeading as HeadingItem } from "@/modules/blog/utils/helpers";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
      let currentActiveId = "";

      for (const el of headingElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            currentActiveId = el.id;
          }
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      } else if (headings.length > 0) {
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 sticky top-28 self-start w-full">
      <h4 className="text-xs font-bold text-navy-dark uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
        Table of Contents
      </h4>
      <nav className="space-y-3">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              window.history.pushState(null, "", `#${heading.id}`);
            }}
            className={cn(
              "block text-xs font-medium leading-relaxed transition-colors duration-200",
              heading.level === 3 ? "pl-4 text-[11px]" : "",
              activeId === heading.id
                ? "text-primary font-bold border-l-2 border-primary pl-2 -ml-2"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
