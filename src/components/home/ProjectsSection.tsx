"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import ProjectCard from "../common/ProjectCard";
import SecondaryButton from "../common/SecondaryButton";
import { useDemoModal } from "../common/DemoModal";
import { Project } from "../../types/home";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { openDemoModal } = useDemoModal();
  return (
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
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 md:mb-10 w-full"
          >
            <div className="flex-1 max-w-2xl">
              <SectionHeading
                title="Featured Projects"
                subtitle="A selection of our most impactful work across various industries."
                align="left"
                theme="light"
                className="mb-0 max-w-none"
              />
            </div>
            <div className="shrink-0 self-start sm:self-auto pb-1">
              <Link
                href="/portfolio"
                className="inline-flex items-center text-sm font-semibold text-slate-800 nav-link-underline py-1 group"
              >
                View All Work
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {projects.length === 0 ? (
            // Professional empty state matching the requirements
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white border border-slate-100/80 shadow-sm max-w-xl mx-auto w-full mt-8"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                🚀
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-semibold text-slate-600">
                No featured projects available yet.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={fadeUp} className="h-full">
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            className="flex justify-center mt-12"
          >
            <SecondaryButton onClick={() => openDemoModal({ source: "Homepage Portfolio Section", inquiryType: "Technical Discovery Call" })} variant="light">
              Book a Free Consultation
            </SecondaryButton>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
