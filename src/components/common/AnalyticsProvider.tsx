"use client";

import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import AnalyticsTracker from "./AnalyticsTracker";

/**
 * Determines whether a given pathname belongs to the admin panel.
 * Matches /admin, /admin/, and any /admin/* subroutes.
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * AnalyticsProvider — renders GA4 script and the global click/event tracker
 * ONLY for public-facing routes.
 *
 * Admin routes (/admin, /admin/*) are completely excluded:
 *  - No GA4 script is injected.
 *  - No click/interaction events are sent.
 *  - No page_view events are recorded.
 */
export default function AnalyticsProvider() {
  const pathname = usePathname();

  // Hard stop: do not render anything for admin routes.
  if (!GA_ID || isAdminRoute(pathname)) {
    return null;
  }

  return (
    <>
      {/*
        GoogleAnalytics from @next/third-parties/google:
        - Injects the gtag.js script once.
        - Automatically tracks page_view on every client-side route change
          via Next.js router integration — no manual page_view call needed.
        - strategy="afterInteractive" ensures it doesn't block render.
      */}
      <GoogleAnalytics gaId={GA_ID} />

      {/*
        AnalyticsTracker: global document-level click handler that fires
        custom events (email_click, phone_click, whatsapp_click, etc.)
        for public-website interactions only.
      */}
      <AnalyticsTracker />
    </>
  );
}
