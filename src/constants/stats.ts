/**
 * Single source of truth for HexaKode company statistics, metrics, and achievements.
 * All public-facing components and pages should consume metrics from this central configuration.
 */

export interface CompanyStatItem {
  id: string;
  value: number;
  suffix: string;
  formatted: string;
  label: string;
  subtext?: string;
  tags?: string[];
}

export const COMPANY_STATS = {
  completedProjects: {
    id: "completed-projects",
    value: 3,
    suffix: "+",
    formatted: "3+",
    label: "Completed Projects",
    subtext: "Delivered on time & on scope",
    tags: ["Revopz"],
  },
  technologiesUsed: {
    id: "technologies-used",
    value: 10,
    suffix: "+",
    formatted: "10+",
    label: "Technologies Used",
    subtext: "Modern & reliable stack",
    tags: [
      "Next.js",
      "React",
      "React Native",
      "Flutter",
      "Firebase",
      "Supabase",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Sanity CMS",
      "Prisma",
    ],
  },
  industriesServed: {
    id: "industries-served",
    value: 3,
    suffix: "+",
    formatted: "3+",
    label: "Industries Served",
    subtext: "Diverse market experience",
    tags: ["Manufacturing", "Publishing", "Event"],
  },
  clientSatisfaction: {
    id: "client-satisfaction",
    value: 100,
    suffix: "%",
    formatted: "100%",
    label: "Client Satisfaction",
    subtext: "Growing every month with 5-star trust",
  },
  founded: {
    id: "founded",
    value: 2026,
    suffix: "",
    formatted: "2026",
    label: "Founded",
    subtext: "Engineering from day one",
  },
} as const;
