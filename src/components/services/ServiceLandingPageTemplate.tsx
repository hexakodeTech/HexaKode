"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, ArrowRight, ShieldCheck, CheckCircle, HelpCircle, Globe, Gauge, TrendingDown, ShieldAlert, Smartphone, Activity, Layers, Users, Compass, ShoppingCart, LayoutGrid, EyeOff } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import Card from "../ui/Card";
import ProjectCard from "../common/ProjectCard";
import ContactForm from "@/components/contact/ContactForm";
import ContactDetailsCard from "@/components/contact/ContactDetailsCard";
import { useDemoModal } from "../common/DemoModal";
import { MOCK_TESTIMONIALS } from "@/mock-data/testimonials";
import { fadeUp, staggerContainer } from "@/lib/motion";

export interface Challenge {
  title: string;
  description: string;
  iconName: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  gauge: Gauge,
  "trending-down": TrendingDown,
  "shield-alert": ShieldAlert,
  smartphone: Smartphone,
  activity: Activity,
  layers: Layers,
  users: Users,
  compass: Compass,
  "shopping-cart": ShoppingCart,
  "layout-grid": LayoutGrid,
  "eye-off": EyeOff,
};

export interface Technology {
  name: string;
  reason: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceLandingPageTemplateProps {
  badge: string;
  h1: string;
  heroDescription: string;
  serviceName: string;
  serviceUrl: string;
  metaDescription: string;
  
  challenges: Challenge[];
  whyChooseDesc: string;
  whyChoosePoints: { title: string; desc: string }[];
  processSteps: { title: string; desc: string }[];
  technologies: Technology[];
  benefits: { title: string; desc: string }[];
  faqs: FAQItem[];
  
  projects: any[]; // Already filtered by the caller
  otherServices?: { name: string; url: string }[];
}

const SERVICE_INFOS = {
  "/services/web-development": {
    name: "Website Development",
    desc: "High-performance web apps built with Next.js & React.",
    iconName: "globe",
  },
  "/services/mobile-app-development": {
    name: "Mobile App Development",
    desc: "Cross-platform Android & iOS apps powered by Flutter.",
    iconName: "smartphone",
  },
  "/services/ui-ux-design": {
    name: "UI/UX Design",
    desc: "Intuitive research, wireframes, and design systems in Figma.",
    iconName: "compass",
  },
};

const INDUSTRIES = [
  { name: "Manufacturing", icon: "🏭", desc: "Automating factory floors and supply chains." },
  { name: "Healthcare", icon: "🏥", desc: "Compliant applications and patient portals." },
  { name: "Retail & E-commerce", icon: "🛍️", desc: "High-performance storefronts and shopping experiences." },
  { name: "Education", icon: "🎓", desc: "Learning management systems and school trackers." },
  { name: "Hospitality", icon: "🏨", desc: "Reservation platforms and booking engines." },
  { name: "Startups", icon: "🚀", desc: "Rapid prototyping and scalable infrastructure." },
  { name: "Government", icon: "🏛️", desc: "Secure public services and citizen portals." },
  { name: "Professional Services", icon: "💼", desc: "Enterprise operations and dashboard managers." },
];

export default function ServiceLandingPageTemplate({
  badge,
  h1,
  heroDescription,
  serviceName,
  serviceUrl,
  metaDescription,
  challenges,
  whyChooseDesc,
  whyChoosePoints,
  processSteps,
  technologies,
  benefits,
  faqs,
  projects,
}: ServiceLandingPageTemplateProps) {
  const { openDemoModal } = useDemoModal();
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  // Filter mock testimonials to active ones
  const activeTestimonials = MOCK_TESTIMONIALS.filter((t) => t.status === "Active").slice(0, 3);

  // Dynamically calculate related services to display
  const relatedServices = Object.entries(SERVICE_INFOS)
    .filter(([url]) => url !== serviceUrl)
    .map(([url, info]) => ({
      url,
      ...info,
    }));

  // JSON-LD Structured Data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "provider": {
      "@type": "Organization",
      "name": "HexaKode",
      "url": "https://www.hexakode.in",
      "logo": "https://www.hexakode.in/logo-icon.png"
    },
    "description": metaDescription,
    "areaServed": {
      "@type": "State",
      "name": "Kerala",
      "alternateName": "KL"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HexaKode",
    "url": "https://www.hexakode.in",
    "logo": "https://www.hexakode.in/logo-icon.png",
    "sameAs": [
      "https://www.linkedin.com/company/hexakode-tech",
      "https://www.instagram.com/hexakodetech"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.hexakode.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://www.hexakode.in/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": serviceName,
        "item": `https://www.hexakode.in${serviceUrl}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* Dynamic JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-[32px] md:pt-[20px]">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 md:py-32 overflow-hidden bg-white">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-[80px] pointer-events-none" />

          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 text-left">
                {/* Visible Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-xs text-slate-400 font-medium">
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                  <span className="text-slate-300">/</span>
                  <Link href="/services" className="hover:text-primary transition-colors">
                    Services
                  </Link>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-600 font-semibold">{serviceName}</span>
                </nav>

                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 bg-secondary-container text-primary border border-secondary-container/80">
                  {badge}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-dark tracking-tight leading-tight">
                  {h1}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-slate-500 font-normal leading-relaxed max-w-3xl">
                  {heroDescription}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => openDemoModal({ source: `${serviceName} Hero`, inquiryType: "Technical Discovery Call" })}
                    className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-8 py-4 bg-primary text-on-primary hover:shadow-lg transition-all duration-300 btn-shimmer text-base font-semibold cursor-pointer"
                  >
                    Book a Free Consultation
                  </button>
                  <a
                    href="#portfolio"
                    className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-8 py-4 border border-outline-variant/40 text-navy-dark hover:bg-slate-50 transition-all duration-300 text-base font-semibold cursor-pointer"
                  >
                    View Our Work
                  </a>
                </div>
                {/* Trust Indicators */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-6">
                  <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Trusted Technology Partner
                  </p>
                  <div className="flex gap-4 text-sm font-bold text-navy-dark/70 items-center">
                    <span>⚡ ISO compliant standards</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>🤝 100% transparent delivery</span>
                  </div>
                </div>
              </div>

              {/* Graphic Visual Block */}
              <div className="lg:col-span-4 hidden lg:flex justify-center relative">
                <div className="w-72 h-72 rounded-2xl bg-gradient-to-tr from-primary/10 to-secondary/10 border border-outline-variant/30 flex items-center justify-center p-8 relative shadow-premium-hover">
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl -z-10" />
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                      ✓
                    </div>
                    <h3 className="font-bold text-navy-dark text-lg">Production Ready</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      We optimize every line of code for performance, security, and responsive layouts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* BUSINESS CHALLENGES */}
        <Section id="challenges" variant="muted" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Common Business Challenges We Address"
                  subtitle="We help companies navigate technical roadblocks to unlock business growth and capture their market potential."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4"
              >
                {challenges.map((challenge, idx) => {
                  const ChallengeIcon = ICON_MAP[challenge.iconName] || Globe;
                  return (
                    <motion.div key={idx} variants={fadeUp} className="h-full">
                      <Card
                        variant="light"
                        className="p-8 h-full flex flex-col items-start border-outline-variant/30 hover:border-secondary/40 transition-all duration-300"
                      >
                        <div className="text-secondary mb-6 inline-block p-3 rounded-xl bg-secondary-container text-primary border border-secondary-container/50">
                          <ChallengeIcon className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="text-lg font-bold text-navy-dark mb-3 tracking-tight">
                          {challenge.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {challenge.description}
                        </p>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* WHY HEXAKODE */}
        <Section id="why-hexakode" variant="white" spacing="large">
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Why Partner with HexaKode?"
                  subtitle={whyChooseDesc}
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4"
              >
                {whyChoosePoints.map((point, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="h-full">
                    <div className="p-8 h-full bg-white rounded-2xl border border-slate-100 flex flex-col justify-start hover-lift hover-glow">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 font-bold text-sm">
                        ✓
                      </div>
                      <h3 className="text-lg font-bold text-navy-dark mb-3 tracking-tight">
                        {point.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* DEVELOPMENT PROCESS */}
        <Section id="process" variant="muted" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Our Engineering Process"
                  subtitle="How we guide your custom solution from discovery to continuous long-term support."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6 mt-4 relative"
              >
                {processSteps.map((step, index) => (
                  <motion.div key={index} variants={fadeUp} className="h-full relative">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100/80 flex flex-col items-center text-center h-full hover-lift">
                      <div className="w-8 h-8 rounded-full bg-navy-dark text-white flex items-center justify-center font-bold text-xs mb-4 shadow-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-sm font-bold text-navy-dark mb-2 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* TECHNOLOGIES SECTION */}
        <Section id="technologies" variant="white" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Core Technologies We Leverage"
                  subtitle="We select stable, modern, and highly performance-optimized stacks specifically suited for your service's demands."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4"
              >
                {technologies.map((tech, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="h-full">
                    <div className="p-8 h-full bg-slate-50/50 rounded-2xl border border-slate-100/80 flex flex-col justify-start">
                      <h4 className="text-xl font-bold text-navy-dark mb-3 tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        {tech.name}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {tech.reason}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* INDUSTRIES WE SERVE */}
        <Section id="industries" variant="muted" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Industries We Serve"
                  subtitle="Engineering solutions designed to handle complex workflows across key economic sectors."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4"
              >
                {INDUSTRIES.map((ind, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="h-full">
                    <Card
                      variant="light"
                      className="p-6 h-full flex flex-col items-center text-center border-outline-variant/30 hover:border-secondary/40 transition-all duration-300"
                    >
                      <span className="text-3xl mb-4 select-none">{ind.icon}</span>
                      <h3 className="text-base font-bold text-navy-dark mb-2 tracking-tight">
                        {ind.name}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {ind.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* BENEFITS SECTION */}
        <Section id="benefits" variant="white" spacing="large">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Business Outcomes & Benefits"
                  subtitle="Invest in tech that delivers clear, measurable performance metrics and conversions."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4"
              >
                {benefits.map((benefit, idx) => (
                  <motion.div key={idx} variants={fadeUp} className="h-full">
                    <div className="p-8 h-full bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-start">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-navy-dark mb-3 tracking-tight">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* PORTFOLIO GRID SECTION (Automatically Filtered) */}
        {projects.length > 0 && (
          <Section id="portfolio" variant="muted" spacing="large">
            <Container>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col"
              >
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
                >
                  <SectionHeading
                    title={`Our Latest ${serviceName} Projects`}
                    subtitle={`A detailed selection of our production-ready ${serviceName.toLowerCase()} solutions.`}
                    align="left"
                    theme="light"
                    className="mb-0 max-w-2xl"
                  />
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center text-sm font-semibold text-slate-800 nav-link-underline py-1 group shrink-0 self-start sm:self-auto"
                  >
                    View All Work
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>

                <motion.div
                  variants={staggerContainer}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-4"
                >
                  {projects.map((project) => (
                    <motion.div key={project.id} variants={fadeUp} className="h-full">
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* View All Portfolio button after projects grid */}
                <motion.div variants={fadeUp} className="flex justify-center mt-12">
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-8 py-4 border border-outline-variant/40 text-navy-dark hover:bg-slate-50 transition-all duration-300 text-base font-semibold group cursor-pointer"
                    prefetch={true}
                  >
                    <span>View All Portfolio</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </motion.div>
            </Container>
          </Section>
        )}

        {/* TOPICAL INTERNAL LINKING MODULE */}
        <Section id="related-services" variant="muted" spacing="large" className="border-t border-outline-variant/10">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  title="Related Services"
                  subtitle="Explore our other engineering capabilities to accelerate your business goals."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-4"
              >
                {relatedServices.map((serv, index) => {
                  const IconComponent = ICON_MAP[serv.iconName] || Globe;
                  return (
                    <motion.div key={index} variants={fadeUp} className="h-full">
                      <Link href={serv.url} className="flex flex-col h-full select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl" prefetch={true}>
                        <Card
                          variant="light"
                          className="h-full border-outline-variant/30 hover:border-secondary/40 flex flex-col p-8 justify-between hover-lift hover-glow w-full"
                        >
                          <div>
                            <div className="text-secondary mb-6 inline-block p-3 rounded-xl bg-secondary-container text-primary border border-secondary-container/50">
                              <IconComponent className="w-6 h-6 text-secondary" />
                            </div>
                            <h3 className="text-xl font-bold text-navy-dark mb-3 tracking-tight group-hover:text-primary transition-colors">
                              {serv.name}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                              {serv.desc}
                            </p>
                          </div>
                          <span className="inline-flex items-center text-secondary hover:text-primary text-sm font-semibold transition-colors duration-200 mt-auto">
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* FAQ ACCORDION SECTION */}
        <Section id="faq" variant="white" spacing="large" className="border-t border-outline-variant/20">
          <Container>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col"
            >
              <motion.div variants={fadeUp}>
                <SectionHeading
                  badge="FAQs"
                  title="Frequently Asked Questions"
                  subtitle="Quick, educational answers scoping real customer concerns and tech stack details."
                  align="center"
                  theme="light"
                />
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="max-w-3xl mx-auto w-full mt-4 space-y-4"
              >
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-outline-variant/30 bg-white/70 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-secondary/35 shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        id={`faq-btn-${idx}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-content-${idx}`}
                        className="w-full flex justify-between items-center px-6 py-5 text-left font-headline-sm text-[16px] md:text-[18px] font-semibold text-navy-dark hover:text-primary transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-secondary/5 rounded-t-xl"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ease-in-out ${
                            isOpen ? "rotate-180 text-secondary" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-content-${idx}`}
                            role="region"
                            aria-labelledby={`faq-btn-${idx}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transition: { height: { duration: 0.35, ease: "easeOut" }, opacity: { duration: 0.25 } }
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: { height: { duration: 0.3, ease: "easeIn" }, opacity: { duration: 0.2 } }
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-1 text-on-surface-variant font-body-md leading-relaxed border-t border-outline-variant/10 bg-slate-50/20">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </Container>
        </Section>

        {/* CONTACT SECTION */}
        <section
          id="contact"
          className="transition-colors duration-1000 relative overflow-hidden w-full pb-20 pt-16 bg-white text-on-background border-t border-outline-variant/20"
        >
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
              {/* Form Area (Left) */}
              <div className="lg:col-span-8 bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl border border-outline-variant/30 p-6 md:p-10 shadow-premium">
                <ContactForm isDark={false} />
              </div>
              
              {/* Details & Info Sidebar (Right) */}
              <div className="lg:col-span-4 space-y-8 w-full">
                <ContactDetailsCard isDark={false} />
                <div className="p-8 rounded-xl border border-outline-variant/10 glass-card bg-slate-50/40 text-on-background">
                  <h3 className="font-headline-sm text-headline-sm mb-4 text-primary font-bold">
                    Let's Connect
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    Our team responds to all scoping and consultation requests within 24-48 business hours. Let's design something incredible together.
                  </p>
                  <button
                    onClick={() => openDemoModal({ source: `${serviceName} Contact section`, inquiryType: "Technical Discovery Call" })}
                    className="w-full inline-flex items-center justify-center font-label-mono text-label-mono rounded px-6 py-3 bg-secondary text-white hover:brightness-110 hover:shadow-lg transition-all duration-300 text-sm font-semibold cursor-pointer"
                  >
                    ⭐ Book Consultation
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </section>

      </main>

      <Footer />
    </>
  );
}
