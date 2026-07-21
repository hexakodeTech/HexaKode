"use client";

import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";

interface HTMLRendererProps {
  html: string;
  className?: string;
}

/**
 * Renders sanitized HTML blog content from Tiptap editor.
 * Applies DOMPurify sanitization client-side for XSS protection.
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
    }
  }, [html]);

  return (
    <div
      ref={ref}
      className={`prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h3:text-xl prose-h3:mt-8 prose-p:leading-relaxed prose-p:text-slate-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-slate-800 prose-pre:bg-slate-900 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-img:rounded-xl prose-img:shadow-sm prose-table:border-collapse prose-th:border prose-th:border-slate-200 prose-th:p-3 prose-th:bg-slate-50 prose-td:border prose-td:border-slate-200 prose-td:p-3 prose-strong:text-slate-900 prose-li:text-slate-700 ${className}`}
    />
  );
}
