import type { Metadata, Viewport } from "next";
import { Zen_Dots, Kalam, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

// ─── Font configuration ──────────────────────────────────────────────────────
const zenDots = Zen_Dots({
  variable: "--font-zen-dots",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const kalam = Kalam({
  variable: "--font-kalam",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "HexaKode | Code that powers growth",
  description:
    "Custom software, web applications, mobile apps, and digital experiences built to help businesses scale with technical precision and market-leading innovation.",
  keywords: [
    "Software Development",
    "Web App Development",
    "Mobile Apps",
    "UI/UX Design",
    "API Integrations",
    "HexaKode",
    "SaaS Platform",
    "Looking forward to engineering excellence",
  ],
  authors: [{ name: "HexaKode" }],
  openGraph: {
    title: "HexaKode | Code that powers growth",
    description:
      "Custom software, web applications, mobile apps, and digital experiences built to help businesses scale with technical precision and market-leading innovation.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { DemoModalProvider } from "@/components/common/DemoModal";
import { Toaster } from "sonner";
import AnalyticsTracker from "@/components/common/AnalyticsTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${zenDots.variable} ${kalam.variable} ${poppins.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-on-background antialiased">
        <DemoModalProvider>
          {children}
        </DemoModalProvider>
        <Toaster position="bottom-right" richColors />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!}
        />
        <AnalyticsTracker />
        {/*
          Microsoft Clarity integration using Next.js's optimized <Script> component.
          - Why layout.tsx: Placed globally in the root layout to ensure the tracker loads
            on every page of the application without duplicating tracking code inside individual pages.
          - Why afterInteractive: Strategy ensures the script is fetched and executed after
            the page becomes interactive, preventing it from blocking the initial page render.
          - Duplicate initialization prevention: Next.js handles route navigation in a single-page
            app model and ensures the script loader runs once, avoiding multiple injections.
          - SSR Compatibility: Run safely on client only (injected dynamically after hydration).
        */}
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
