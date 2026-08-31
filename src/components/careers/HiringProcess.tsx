"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, UserCheck, MessageSquare, Code2, Sparkles } from "lucide-react";
import { hiringSteps } from "@/data/careers";

const stepIcons = [UserCheck, CheckCircle2, MessageSquare, Code2, Sparkles];

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function HiringProcess() {
  return (
    <section id="hiring-process" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
      <div className="max-w-container-max mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest mb-4 block">
            How We Hire
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4 tracking-tight">
            Our Hiring Process
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            A straightforward, transparent, and respectful interview process designed to understand your strengths and vision.
          </p>
        </motion.div>

        {/* 5-Step Process Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {hiringSteps.map((step, idx) => {
            const Icon = stepIcons[idx % stepIcons.length];
            return (
              <motion.div
                key={step.stepNumber}
                variants={cardVariant}
                className="group relative bg-white rounded-2xl border border-outline-variant/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-secondary/30 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-label-mono text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-md border border-secondary/20">
                      Step {step.stepNumber}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-secondary group-hover:bg-secondary/10 transition-colors duration-200">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2.5 tracking-tight group-hover:text-secondary transition-colors duration-200">
                    {step.title}
                  </h3>

                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-[11px] font-medium text-slate-400">
                  <span>Phase {idx + 1} of 5</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
