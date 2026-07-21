import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-16";

/**
 * True only when the project ID is a real, non-placeholder Sanity project ID.
 * Sanity project IDs are lowercase alphanumeric strings (no hyphens except
 * that some IDs may contain them, but "hexakode-project" is a placeholder).
 * We treat any value containing the word "project" as a placeholder.
 */
export const isSanityConfigured =
  Boolean(projectId) &&
  projectId !== "hexakode-project" &&
  !projectId.includes("your-project") &&
  !projectId.includes("placeholder");

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});
