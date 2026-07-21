import React from "react";
import { Metadata } from "next";
import ServiceLandingPageTemplate from "@/components/services/ServiceLandingPageTemplate";
import { getPublishedProjects } from "@/modules/portfolio/services/portfolio.service";
import { mapDbCategoryToPublic } from "@/modules/portfolio/types/portfolio";
import { Project } from "@/types/home";

export const metadata: Metadata = {
  title: "Website Development Company in Kerala | Web Designers Kerala | HexaKode",
  description: "Looking for a premier Web Development Company in Kerala? HexaKode designs custom, responsive, and SEO-friendly websites using React, Next.js, and headless CMS.",
  keywords: [
    "Website Development Company in Kerala",
    "Website Development Company in Palakkad",
    "Website Development Company Near me",
    "Web Development Company Kerala",
    "Website Designers Kerala",
    "Custom Website Development",
    "Business Website Development",
    "Corporate Website Development",
    "Responsive Website Design",
    "Professional Website Development",
    "SEO Friendly Website Development",
    "Next.js Development Company",
    "Website Development Services Kerala",
    "Website Development Company in Palakkad"
  ],
  alternates: {
    canonical: "https://www.hexakode.in/services/web-development",
  }
};

const CHALLENGES = [
  {
    title: "Lack of Search Engine Visibility",
    description: "Many local businesses in Kerala fail to reach potential customers simply because their legacy websites lack structural SEO optimization, causing them to rank behind competitors on search engine result pages.",
    iconName: "globe",
  },
  {
    title: "Sluggish Loading Speeds & High Bounce Rates",
    description: "Websites built on bloated templates or outdated page builders experience extreme load-time lags. In today's fast-paced web, a one-second delay causes users to leave, resulting in high bounce rates and lost conversions.",
    iconName: "gauge",
  },
  {
    title: "Low User Conversion & Ineffective Lead Capturing",
    description: "A website is your online salesperson. If your layout lacks intuitive navigation, clear call-to-actions (CTAs), or user-friendly input fields, visitors will drop off, leading to zero sales conversions or business leads.",
    iconName: "trending-down",
  },
  {
    title: "Frequent Downtime & Security Vulnerabilities",
    description: "WordPress sites and generic databases require constant patch updates, plugin maintenance, and are highly vulnerable to hacking. Without dedicated engineering, legacy sites present high security risks and downtime.",
    iconName: "shield-alert",
  },
];

const WHY_CHOOSE_POINTS = [
  {
    title: "Blazing Fast Performance",
    desc: "We build modern React and Next.js platforms using Server-Side Rendering (SSR) and Static Site Generation (SSG). This results in near-instantaneous page loading speeds and perfect Core Web Vitals scorecards.",
  },
  {
    title: "Technical SEO Integrated",
    desc: "We build SEO-friendly web architectures from day one. By generating semantic HTML structure, proper meta headers, automated sitemaps, and Schema.org structured data, we ensure search engines crawl and rank your pages.",
  },
  {
    title: "Headless CMS Control",
    desc: "We decouple your visual interface from content management. By integrating headless platforms like Sanity CMS or Strapi, we give your business teams total editing freedom while keeping your code clean and secure.",
  },
  {
    title: "Scalable Cloud Hosting",
    desc: "We host websites on global serverless CDN networks like Vercel and AWS. This means your platform requires zero manual server maintenance, scales automatically during traffic spikes, and boasts a 99.99% uptime guarantee.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Discovery & Strategy",
    desc: "We sit down with you to outline your business goals, identify target customer personas, audit competitors, and establish functional specifications.",
  },
  {
    title: "Architecture & Wireframes",
    desc: "Our engineering team designs the logical sitemap, constructs user-friendly navigation flows, and plans database models and API integrations.",
  },
  {
    title: "Custom UI/UX Design",
    desc: "We draft premium, bespoke interface screens in Figma based on your brand colors. We construct clickable high-fidelity prototypes for your review.",
  },
  {
    title: "Clean React/Next.js Dev",
    desc: "We write clean, modular, and typed React components using TypeScript and Tailwind CSS. We ensure components are highly reusable and accessible.",
  },
  {
    title: "Headless CMS Configuration",
    desc: "We implement headless schemas, enabling your team to edit text, publish case studies, and upload media without running deploy scripts.",
  },
  {
    title: "Core Web Vitals Testing",
    desc: "We run page audits, check mobile responsiveness, test cross-browser compatibility, optimize media, and secure zero-layout shifts.",
  },
  {
    title: "Deployment & Support",
    desc: "We deploy the production bundle to global serverless edge servers. We remain on hand for continuous performance optimization and support.",
  },
];

const TECHNOLOGIES = [
  {
    name: "Next.js",
    reason: "Next.js is the React framework for the web. It enables static site generation (SSG) and server-side rendering (SSR), yielding superior load speeds and top-tier SEO performance compared to single-page client apps.",
  },
  {
    name: "React",
    reason: "React is a component-driven JavaScript library. It lets our engineers build modular, reusable visual blocks that make the interface fast, scalable, and easy to maintain over long-term product lifecycles.",
  },
  {
    name: "TypeScript",
    reason: "TypeScript adds static type definitions on top of JavaScript. By checking code rules during compile-time, it prevents production crashes, improves developer productivity, and guarantees enterprise-grade stability.",
  },
  {
    name: "Tailwind CSS",
    reason: "Tailwind is a utility-first styling framework. It allows us to build custom responsive grids, fluid animations, and premium dark/light interfaces without bloated styling sheets or slow runtime execution times.",
  },
  {
    name: "Sanity CMS",
    reason: "Sanity is a real-time headless content platform. We configure custom editor workspaces, allowing your marketing team to edit homepage layouts and landing copy without modifying the core Next.js application code.",
  },
  {
    name: "Supabase & Firebase",
    reason: "We utilize serverless database layers to handle user profiles, real-time sync, auth rules, and cloud assets. This reduces custom server overhead and guarantees secure, instant read/write transactions.",
  },
  {
    name: "Node.js",
    reason: "For complex backend endpoints and database queries, we run high-performance asynchronous Node.js runtimes. This processes bulk transactional workloads securely and handles custom API logic.",
  },
  {
    name: "Vercel & AWS Edge",
    reason: "We deploy websites to edge caches. Pages are served instantly from the geographic location closest to your users, guaranteeing fast load times whether they browse from Palakkad, Kochi, or abroad.",
  },
];

const BENEFITS = [
  {
    title: "Rank Higher on Search Engines",
    desc: "Our technical SEO optimizations, schema marks, and semantic codes align with Google's quality crawlers, elevating your local search visibility.",
  },
  {
    title: "Zero Server Maintenance Overhead",
    desc: "Since pages are rendered statically and hosted on edge CDNs, you never have to deal with manual server restarts, CPU overloads, or configuration issues.",
  },
  {
    title: "Uncompromising Loading Speeds",
    desc: "By removing render-blocking assets, compiling script sizes, and optimizing image files, we achieve lightning-fast loading speeds on mobile devices.",
  },
];

const FAQS = [
  {
    question: "Why does my business need a professional website?",
    answer: "A professional website acts as your primary digital storefront. It builds trust, communicates your brand value, and ensures that customers looking for your services on Google or social media find a secure, credible platform instead of a broken generic page.",
  },
  {
    question: "How much does website development cost in Kerala?",
    answer: "The cost of developing a custom website depends entirely on the features, integrations, page volume, and CMS requirements. Custom Next.js projects require dedicated engineering but offer extreme long-term value, high security, and near-zero hosting costs compared to heavy subscription templates.",
  },
  {
    question: "How long does it take to build a custom website?",
    answer: "Timeline spans depend on complexity. A custom corporate or business landing page project typically takes 2 to 4 weeks. Larger web applications with backend portals, client dashboards, or advanced database integrations may take 6 to 12 weeks from discovery to final deploy.",
  },
  {
    question: "What is the difference between a custom website and a template-based site?",
    answer: "Template-based websites (like generic WordPress or Wix) contain bloated, pre-written code, resulting in slow load speeds, poor security, and restrictive layout changes. Custom Next.js sites are coded from scratch, resulting in flawless performance, custom designs, robust security, and top-tier SEO flexibility.",
  },
  {
    question: "Will my website be mobile-friendly and responsive?",
    answer: "Yes, 100%. We employ mobile-first CSS grids and fluid layouts. Every screen is meticulously tested on multiple physical mobile screens, tablets, and wide-screen desktops to ensure readability and flawless interaction transitions.",
  },
  {
    question: "How do you ensure my website is optimized for SEO?",
    answer: "We configure structural technical SEO. This includes writing clean semantic HTML code, setting custom titles and descriptions for every page, automating sitemap generation, indexing robots directives, and implementing JSON-LD breadcrumb and service schema codes.",
  },
  {
    question: "Do you provide headless CMS integration?",
    answer: "Yes. We integrate headless CMS platforms like Sanity CMS. This gives your business team a user-friendly dashboard to edit text, post blogs, and update media. The content is compiled statically at build-time, preserving high speed.",
  },
  {
    question: "Can you migrate my legacy site to Next.js or React?",
    answer: "Absolutely. We specialize in legacy migrations. We will extract your current database contents, redesign the visual assets, build a high-performance React/Next.js frontend, and configure 301 redirects to ensure your legacy search engine ranks are preserved.",
  },
  {
    question: "Do you offer maintenance and support after the website launch?",
    answer: "Yes. Our partnership continues post-launch. We provide regular code audits, next-gen library upgrades, performance optimizations, bug fixes, and feature expansions to ensure your platform scales alongside your company's growth.",
  },
  {
    question: "How do we get started with your web development services?",
    answer: "Simply book a free consultation or fill out the contact form. Our engineering team will arrange a discovery call to discuss your goals, review technical requirements, and deliver a tailored roadmap and quotation.",
  },
];

export default async function WebDevelopmentPage() {
  let mappedProjects: Project[] = [];
  try {
    const dbProjects = await getPublishedProjects();
    const webProjects = dbProjects.filter((p) => mapDbCategoryToPublic(p.category) === "Web").slice(0, 6);
    
    mappedProjects = webProjects.map((p) => {
      const publicCategory = mapDbCategoryToPublic(p.category);
      return {
        id: p.id,
        title: p.title,
        category: publicCategory,
        imageUrl: p.coverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e",
        tags: p.technologies.map((t) => t.name),
        href: `/portfolio/${p.slug}`,
        description: p.shortDescription,
        featured: p.featured,
      };
    });
  } catch (error) {
    console.error("Error loading projects for Web Development page:", error);
  }

  return (
    <ServiceLandingPageTemplate
      badge="WEB DEVELOPMENT KERALA"
      h1="Website Development"
      heroDescription="We build fast, high-performance, and SEO-friendly websites that convert visitors into customers. Leverage our React, Next.js, and headless CMS expertise to grow your digital presence with speed and scale."
      serviceName="Custom Web Development"
      serviceUrl="/services/web-development"
      metaDescription="Looking for a premier Web Development Company in Kerala? HexaKode designs custom, responsive, and SEO-friendly websites using React, Next.js, and headless CMS."
      challenges={CHALLENGES}
      whyChooseDesc="At HexaKode, we do not believe in cheap templates. We write bespoke, performance-tuned React and Next.js codes tailored to your business operations."
      whyChoosePoints={WHY_CHOOSE_POINTS}
      processSteps={PROCESS_STEPS}
      technologies={TECHNOLOGIES}
      benefits={BENEFITS}
      faqs={FAQS}
      projects={mappedProjects}
    />
  );
}
