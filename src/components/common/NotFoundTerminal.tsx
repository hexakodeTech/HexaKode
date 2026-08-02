"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const DEV_TIPS = [
  "Tip: Dynamic imports for below-the-fold components reduce initial TBT.",
  "Tip: Setting fetchPriority='high' on hero images drops LCP significantly.",
  "Tip: Prefer Next.js ISR (revalidate) for lightning-fast TTFB on public pages.",
  "Tip: Preload critical fonts with display='swap' to eliminate FOUT.",
  "Tip: Clean semantic HTML structure guarantees a 100 Accessibility score.",
];

export default function NotFoundTerminal() {
  const [copied, setCopied] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const terminalCode = `// 404_PAGE_NOT_FOUND.ts
import { RouteResolver } from "@hexakode/engine";

export async function resolveRoute(path: string) {
  const route = await RouteResolver.find(path);
  
  if (!route) {
    throw new Error("HTTP 404: Path '${typeof window !== 'undefined' ? window.location.pathname : '/unknown'}' not found");
  }
  
  return route; // ❌ Returned undefined
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % DEV_TIPS.length);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Terminal Container */}
      <div className="rounded-2xl bg-[#0b1329] border border-slate-800/80 shadow-2xl overflow-hidden text-left transition-all duration-300 hover:border-secondary/30 group">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-[#070d1d] border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-secondary" />
              hexakode://404-handler
            </span>
          </div>

          <button
            onClick={handleCopy}
            type="button"
            className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5 text-xs flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-secondary/50"
            aria-label="Copy error code snippet"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Terminal Code Body */}
        <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto text-slate-300 space-y-2">
          <div className="text-slate-500">// Status: 404 (Not Found)</div>
          <div className="flex items-start gap-2">
            <span className="text-secondary font-bold">&gt;</span>
            <span>
              <span className="text-cyan-400">const</span> path ={" "}
              <span className="text-amber-300">&quot;UNKNOWN_ROUTE&quot;</span>;
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✗</span>
            <span className="text-red-300">
              Error: Route not registered in system architecture.
            </span>
          </div>
          <div className="pt-2 text-slate-400 border-t border-slate-800/60 mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              System operational
            </span>
            <span className="text-[11px] text-slate-500">HTTP 404</span>
          </div>
        </div>

        {/* Developer Tip Interactive Footer */}
        <div className="px-5 py-3.5 bg-[#0e172e] border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 flex-1 min-w-0">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin-slow" />
            <p className="truncate text-[11.5px] text-slate-300 font-sans">
              {DEV_TIPS[tipIndex]}
            </p>
          </div>
          <button
            onClick={nextTip}
            type="button"
            className="shrink-0 text-[11px] font-sans font-semibold text-secondary hover:text-cyan-300 transition-colors px-2 py-1 rounded bg-secondary/10 hover:bg-secondary/20"
            aria-label="Show next developer tip"
          >
            Next Tip →
          </button>
        </div>
      </div>

      {/* Recommended Quick Nav Pill Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
          Quick Links:
        </span>
        <Link
          href="/services"
          className="text-xs font-medium text-slate-600 hover:text-navy-dark bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
        >
          Services
        </Link>
        <Link
          href="/portfolio"
          className="text-xs font-medium text-slate-600 hover:text-navy-dark bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
        >
          Portfolio
        </Link>
        <Link
          href="/contact#contact-form"
          className="text-xs font-medium text-slate-600 hover:text-navy-dark bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
