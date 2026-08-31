import { CultureCard, CareerBenefit, FAQ } from "@/types/careers";

// ─── Why Join HexaKode (Culture & Value Cards) ────────────────────────────────

export const cultureCards: CultureCard[] = [
  {
    id: "real-world-projects",
    title: "Real-World Projects",
    description:
      "Work on production systems that solve actual business challenges across diverse industries, creating tangible impact from day one.",
    icon: "Globe2",
    accentBg: "bg-secondary/10",
    accentText: "text-secondary",
  },
  {
    id: "learning-and-growth",
    title: "Learning & Growth",
    description:
      "Continuous skill elevation through code reviews, mentorship, and opportunities to experiment with modern engineering tools.",
    icon: "TrendingUp",
    accentBg: "bg-primary-fixed/60",
    accentText: "text-on-primary-fixed-variant",
  },
  {
    id: "collaborative-environment",
    title: "Collaborative Culture",
    description:
      "A transparent, supportive team where every engineer and designer has a voice, and good ideas win regardless of seniority.",
    icon: "Users",
    accentBg: "bg-tertiary-fixed/60",
    accentText: "text-on-tertiary-fixed-variant",
  },
  {
    id: "modern-technologies",
    title: "Modern Tech Stack",
    description:
      "Build with React, Next.js, TypeScript, React Native, Node.js, Prisma, and leading cloud platforms without being bogged down by legacy bloat.",
    icon: "Cpu",
    accentBg: "bg-secondary/10",
    accentText: "text-secondary",
  },
  {
    id: "ownership-and-responsibility",
    title: "Ownership & Autonomy",
    description:
      "Take end-to-end ownership of features and architectural decisions with the trust and flexibility to do your best work.",
    icon: "Zap",
    accentBg: "bg-primary-fixed/60",
    accentText: "text-on-primary-fixed-variant",
  },
  {
    id: "career-development",
    title: "Career Development",
    description:
      "Clear advancement pathways that reward technical excellence, problem solving, client collaboration, and leadership.",
    icon: "BarChart3",
    accentBg: "bg-tertiary-fixed/60",
    accentText: "text-on-tertiary-fixed-variant",
  },
];

// ─── How We Hire (Hiring Process Steps) ───────────────────────────────────────

export interface HiringStep {
  stepNumber: string;
  title: string;
  description: string;
}

export const hiringSteps: HiringStep[] = [
  {
    stepNumber: "01",
    title: "Application",
    description:
      "Submit your resume, GitHub, or portfolio showcasing what you have built and your technical strengths.",
  },
  {
    stepNumber: "02",
    title: "Initial Review",
    description:
      "Our team reviews your experience, code samples, and alignment with our engineering standards.",
  },
  {
    stepNumber: "03",
    title: "Introductory Interview",
    description:
      "A 30-minute conversation to discuss your background, aspirations, work style, and what you are looking for.",
  },
  {
    stepNumber: "04",
    title: "Technical / Role Discussion",
    description:
      "A deep dive into your technical problem-solving, architectural thinking, or design craft with our core engineers.",
  },
  {
    stepNumber: "05",
    title: "Final Decision",
    description:
      "We value your time. You receive a prompt, transparent decision with comprehensive feedback and offer details.",
  },
];

// ─── Benefits ─────────────────────────────────────────────────────────────────

export const benefits: CareerBenefit[] = [
  {
    id: "health",
    title: "Health & Wellness",
    description:
      "Supportive wellness initiatives and flexible work-life balance to help you stay energized and focused.",
    icon: "HeartPulse",
  },
  {
    id: "learning",
    title: "Learning & Upskilling",
    description:
      "Access to courses, developer tooling, and structured time dedicated to mastering emerging technologies.",
    icon: "BookOpen",
  },
  {
    id: "equipment",
    title: "Modern Tooling",
    description:
      "Work with cutting-edge developer tools, modern cloud environments, and ergonomic hardware setups.",
    icon: "Monitor",
  },
  {
    id: "growth",
    title: "Direct Client Collaboration",
    description:
      "Direct exposure to client projects and technical leadership opportunities as our company continues to grow.",
    icon: "BarChart3",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const faqs: FAQ[] = [
  {
    id: "remote",
    question: "Do you offer remote positions?",
    answer:
      "Yes. We support remote and hybrid work models with flexible scheduling focused on outcomes, ownership, and clear communication.",
  },
  {
    id: "tech-stack",
    question: "What technologies does HexaKode use?",
    answer:
      "Our primary tech stack includes Next.js, React, TypeScript, React Native, Node.js, Tailwind CSS, Prisma, PostgreSQL, Firebase, and Supabase. We select the best reliable tools for each project's architectural requirements.",
  },
  {
    id: "process",
    question: "What is the hiring process?",
    answer:
      "Our process is transparent and structured in 5 simple steps: (1) Application, (2) Initial Review, (3) Introductory Interview, (4) Technical / Role Discussion, and (5) Final Decision.",
  },
  {
    id: "freshers",
    question: "Do you hire freshers and interns?",
    answer:
      "Yes. We periodically hire motivated early-career engineers and interns who demonstrate strong foundational fundamentals, problem-solving skills, and a genuine eagerness to build.",
  },
  {
    id: "general-application",
    question: "Can I submit a general application?",
    answer:
      "Absolutely. Even when no active roles are listed, you can submit a general application with your profile and resume. We review every submission and reach out as new openings arise.",
  },
];
