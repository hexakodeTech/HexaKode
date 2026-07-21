export interface HeadingItem {
  text: string;
  id: string;
  level: 2 | 3;
}

/**
 * Calculates estimated reading time in minutes based on block word counts.
 */
export function calculateReadingTime(content: any[]): number {
  if (!content || !Array.isArray(content)) return 1;
  let wordCount = 0;
  content.forEach((block) => {
    if (block._type === "block" && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          wordCount += child.text.trim().split(/\s+/).filter(Boolean).length;
        }
      });
    }
  });
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Alias helper for estimateReadTime.
 */
export function estimateReadTime(content: any[]): number {
  return calculateReadingTime(content);
}

/**
 * Generates an array of heading markers with slug anchors from Portable Text headers.
 */
export function generateTableOfContents(content: any[]): HeadingItem[] {
  if (!content || !Array.isArray(content)) return [];
  const headings: HeadingItem[] = [];
  
  content.forEach((block) => {
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text = block.children?.map((c: any) => c.text || "").join("") || "";
      if (text.trim()) {
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        headings.push({
          text,
          id,
          level: block.style === "h2" ? 2 : 3,
        });
      }
    }
  });
  
  return headings;
}

/**
 * Formats date strings into friendly displays.
 */
export function formatPublishDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
