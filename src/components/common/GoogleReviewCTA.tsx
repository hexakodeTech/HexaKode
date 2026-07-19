"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Section from "./Section";
import Container from "./Container";
import SectionHeading from "./SectionHeading";
import Card from "../ui/Card";
import { fadeUp } from "@/lib/motion";

interface GoogleReviewCTAProps {
  variant: "section" | "card" | "link";
  className?: string;
}

export default function GoogleReviewCTA({ variant, className }: GoogleReviewCTAProps) {
  const reviewUrl = "https://g.page/r/CTn-k2k1DxsjEAE/review";

  if (variant === "link") {
    return (
      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body-sm text-body-sm text-on-primary-container/50 hover:text-white transition-colors duration-300 flex items-center gap-1.5"
      >
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span>Review us on Google</span>
      </a>
    );
  }

  if (variant === "card") {
    return (
      <div className="max-w-md mx-auto w-full px-4">
        <Card
          variant="light"
          className="p-6 md:p-8 flex flex-col items-center text-center border-outline-variant/30 hover:border-secondary/40 transition-all duration-300"
        >
          <div className="text-secondary mb-4 p-3 rounded-full bg-secondary-container text-primary border border-secondary-container/50">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <h4 className="font-headline-sm text-lg md:text-xl font-bold mb-2 text-navy-dark">
            Enjoyed your experience?
          </h4>
          <p className="text-on-surface-variant font-body-md mb-6">
            We'd love to hear your feedback.
          </p>
          <motion.a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-6 py-3 cursor-pointer select-none bg-primary text-on-primary hover:shadow-lg transition-all duration-300 btn-shimmer text-sm font-semibold gap-2"
          >
            <Star className="w-4.5 h-4.5 fill-white text-white" />
            <span>Leave a Google Review</span>
          </motion.a>
        </Card>
      </div>
    );
  }

  // variant === "section"
  return (
    <Section id="google-reviews" variant="white" spacing="medium" className="border-t border-outline-variant/20 relative">
      {/* Background glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(251,191,36,0.03)_0%,transparent_70%)] pointer-events-none filter blur-2xl z-0" />

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <SectionHeading
            badge="GOOGLE REVIEWS"
            title="Love Working with HexaKode?"
            subtitle="Your feedback helps us grow and enables more businesses to discover HexaKode. If we've delivered a great experience, we'd truly appreciate a quick review on Google."
            align="center"
            theme="light"
            className="mb-8 md:mb-10"
          />

          <motion.a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center font-label-mono text-label-mono rounded px-8 py-4 cursor-pointer select-none bg-primary text-on-primary hover:shadow-lg transition-all duration-300 btn-shimmer text-base font-semibold gap-2 shadow-sm"
          >
            <Star className="w-5 h-5 fill-white text-white" />
            <span>Leave a Google Review</span>
          </motion.a>

          <p className="text-on-surface-variant font-body-sm text-xs mt-6 max-w-md leading-relaxed text-slate-400">
            Your review supports our local presence and helps other businesses choose a trusted technology partner.
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
