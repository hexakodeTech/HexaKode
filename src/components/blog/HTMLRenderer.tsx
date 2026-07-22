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
      className={`prose max-w-none ${className}`}
    />
  );
}
