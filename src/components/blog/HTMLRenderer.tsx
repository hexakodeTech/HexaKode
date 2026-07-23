"use client";

import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { slugifyHeading } from "@/modules/blog/utils/helpers";

interface HTMLRendererProps {
  html: string;
  className?: string;
}

/**
 * Renders sanitized HTML blog content from Tiptap editor.
 * Applies DOMPurify sanitization client-side for XSS protection.
 * Ensures heading elements (h2, h3, h4) receive stable unique ids for TOC navigation.
 */
export default function HTMLRenderer({ html, className = "" }: HTMLRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "h1","h2","h3","h4","h5","h6","p","br","strong","em","u","s","del",
          "blockquote","ul","ol","li","a","img","table","thead","tbody","tr","th","td",
          "pre","code","hr","span","div","figure","figcaption","mark",
        ],
        ALLOWED_ATTR: ["href","src","alt","class","id","target","rel","style","data-*","colspan","rowspan"],
        ALLOW_DATA_ATTR: true,
      });
      ref.current.innerHTML = clean;

      // Assign stable, unique IDs and scroll-margin-top to headings (h2, h3, h4)
      const headingEls = ref.current.querySelectorAll<HTMLElement>("h2, h3, h4");
      const usedCounts = new Map<string, number>();

      headingEls.forEach((el) => {
        const text = (el.textContent || "").trim();
        if (!text) return;

        const baseSlug = slugifyHeading(text) || "heading";
        const count = (usedCounts.get(baseSlug) || 0) + 1;
        usedCounts.set(baseSlug, count);

        const uniqueId = count === 1 ? baseSlug : `${baseSlug}-${count}`;
        el.id = uniqueId;
        el.classList.add("scroll-mt-28");
      });

      // Handle deep-linked scroll on initial load or refresh with hash
      if (typeof window !== "undefined" && window.location.hash) {
        const targetId = decodeURIComponent(window.location.hash.slice(1));
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    }
  }, [html]);

  return (
    <div
      ref={ref}
      className={`prose max-w-none ${className}`}
    />
  );
}
