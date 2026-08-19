import type { Metadata } from "next";

/**
 * Admin layout — shared by all /admin/* routes.
 *
 * robots: noindex, nofollow ensures that:
 * - Search engines do not index any admin page.
 * - No admin URL appears in search results.
 * - This applies automatically to every current and future admin route
 *   without requiring per-page metadata configuration.
 *
 * Note: robots.txt also disallows /admin/ at the crawler level,
 * providing a second layer of protection.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
