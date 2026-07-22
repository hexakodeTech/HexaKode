"use client";

import React, { useState, useEffect } from "react";
import { TocHeading as HeadingItem } from "@/modules/blog/utils/helpers";
import { cn } from "@/lib/utils";
import { List, ChevronDown, ChevronUp } from "lucide-react";

interface TableOfContentsProps {
  headings: HeadingItem[];
  isMobile?: boolean;
}

export default function TableOfContents({
  headings,
  isMobile = false,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);
      let currentActiveId = "";

      for (const el of headingElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
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

  if (isMobile) {
    return (
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 overflow-hidden mb-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-navy-dark hover:bg-slate-100/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <List className="w-4 h-4 text-primary" />
            Table of Contents ({headings.length})
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {isOpen && (
          <nav className="px-4 pb-4 pt-1 space-y-2.5 border-t border-slate-200/60">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
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
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 sticky top-28 self-start w-full">
      <h4 className="text-xs font-bold text-navy-dark uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
        <List className="w-3.5 h-3.5 text-primary" />
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
