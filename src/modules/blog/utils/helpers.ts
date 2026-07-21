/**
 * Estimate reading time from HTML content.
 * Strips HTML tags and counts words at ~200 wpm.
 */
export function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Generate a URL-safe slug from a title string.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

/**
 * Format a date for display.
 */
export function formatBlogDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface TocHeading {
  id: string;
  level: number;
  text: string;
}

/**
 * Extract H2/H3 headings from HTML for Table of Contents.
 * Headings must have an id attribute (set by Tiptap).
 */
export function extractTableOfContents(htmlContent: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, "").trim();
    if (id && text) {
      headings.push({ id, level, text });
    }
  }
  return headings;
}

/**
 * Extract FAQ entries from HTML for JSON-LD FAQPage schema.
 * Looks for question headings followed by paragraph answers.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}

export function extractFaqEntries(htmlContent: string): FaqEntry[] {
  const faqs: FaqEntry[] = [];
  const questionPattern = /^(what|how|why|when|where|who|is|are|can|do|does|should|will|which)/i;

  const parts = htmlContent.split(/(?=<h[23])/i);
  for (const part of parts) {
    const headingMatch = part.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
    if (!headingMatch) continue;
    const question = headingMatch[1].replace(/<[^>]*>/g, "").trim();
    if (!question.endsWith("?") && !questionPattern.test(question)) continue;

    const afterHeading = part.slice(headingMatch.index! + headingMatch[0].length);
    const parasMatch = afterHeading.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (!parasMatch) continue;
    const answer = parasMatch[1].replace(/<[^>]*>/g, "").trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}
