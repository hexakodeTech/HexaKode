"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/config/sanity.config";
import { isSanityConfigured } from "@/sanity/lib/sanity.client";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101010]">
        <div className="max-w-md w-full mx-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="mb-2 text-lg font-bold text-white">Sanity Studio Not Configured</h1>
          <p className="mb-6 text-sm text-white/50 leading-relaxed">
            The Sanity CMS credentials in your <code className="rounded bg-white/10 px-1.5 py-0.5 text-amber-300 font-mono text-xs">.env.local</code> file are placeholder values. Update them with your real Sanity project details to use the Studio.
          </p>
          <div className="rounded-xl bg-black/30 p-4 text-left font-mono text-xs text-white/70 space-y-1 border border-white/5">
            <p><span className="text-emerald-400">NEXT_PUBLIC_SANITY_PROJECT_ID</span>=<span className="text-amber-300">your-project-id</span></p>
            <p><span className="text-emerald-400">NEXT_PUBLIC_SANITY_DATASET</span>=<span className="text-amber-300">production</span></p>
            <p><span className="text-emerald-400">NEXT_PUBLIC_SANITY_API_VERSION</span>=<span className="text-amber-300">2026-06-16</span></p>
          </div>
          <p className="mt-5 text-xs text-white/30">
            You can find your project ID at{" "}
            <a href="https://sanity.io/manage" target="_blank" rel="noopener noreferrer" className="text-white/50 underline underline-offset-2 hover:text-white transition-colors">
              sanity.io/manage
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      <NextStudio config={config} />
    </div>
  );
}
