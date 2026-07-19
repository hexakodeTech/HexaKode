"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Palette, TrendingUp, Smartphone, HeartHandshake } from "lucide-react";
import Section from "../common/Section";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import Card from "../ui/Card";
import { fadeUp, staggerContainer } from "@/lib/motion";

const FEATURES = [
  {
    id: "fast-delivery",
    title: "Fast Delivery",
    description: "Efficient planning and streamlined development processes help us deliver quality solutions on time without compromising standards.",
    icon: Zap,
    gridClass: "col-span-12 md:col-span-6 lg:col-span-4",
  },
  {
    id: "modern-ui-ux",
    title: "Modern UI/UX",
    description: "Beautiful, intuitive interfaces designed to create exceptional user experiences and improve customer engagement.",
    icon: Palette,
    gridClass: "col-span-12 md:col-span-6 lg:col-span-4",
  },
  {
    id: "seo-friendly",
    title: "SEO-Friendly Development",
    description: "Every website is built with technical SEO best practices, clean code, semantic structure, and performance optimization from day one.",
    icon: TrendingUp,
    gridClass: "col-span-12 md:col-span-6 lg:col-span-4",
  },
  {
    id: "mobile-first",
    title: "Mobile-First Design",
    description: "Our products are designed for mobile devices first, ensuring a seamless experience across phones, tablets, and desktops.",
    icon: Smartphone,
    gridClass: "col-span-12 md:col-span-6 lg:col-span-6",
  },
  {
    id: "ongoing-support",
    title: "Ongoing Support",
    description: "Our partnership doesn't end at launch. We provide continuous support, maintenance, and improvements as your business grows.",
    icon: HeartHandshake,
    gridClass: "col-span-12 md:col-span-12 lg:col-span-6",
  },
];

export default function WhyChooseHexaKode() {
  return (
    <Section id="why-choose" variant="white" spacing="large" className="border-y border-outline-variant/30">
      {/* Background glow overlay */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-secondary/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500/5 rounded-full filter blur-[80px] pointer-events-none" />

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
              badge="WHY CHOOSE HEXAKODE"
              title="Why Businesses Choose HexaKode"
              subtitle="We combine thoughtful design, modern technologies, and reliable engineering to deliver digital products that help businesses grow with confidence."
              align="center"
              theme="light"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-12 gap-6 md:gap-8 mt-4"
          >
            {FEATURES.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={fadeUp}
                  className={feature.gridClass}
                >
                  <motion.div whileHover="hover" className="h-full">
                    <Card
                      variant="light"
                      className="p-8 h-full flex flex-col items-start border-outline-variant/30 hover:border-secondary/40 transition-all duration-300"
                    >
                      {/* Icon with hover spring bounce */}
                      <motion.div
                        className="text-secondary mb-6 inline-block p-3 rounded-xl bg-secondary-container text-primary border border-secondary-container/50"
                        variants={{
                          hover: { y: -6 },
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <IconComponent className="w-6 h-6 text-secondary" aria-hidden="true" />
                      </motion.div>

                      <h3 className="text-headline-sm font-headline-sm mb-3 text-on-background">
                        {feature.title}
                      </h3>
                      <p className="text-on-surface-variant text-body-md leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
