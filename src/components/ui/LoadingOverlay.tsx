"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Props for the LoadingOverlay component.
 *
 * @example
 * <LoadingOverlay
 *   open={isProcessing}
 *   title="Verifying referral..."
 *   description="Please wait while we check your code."
 * />
 */
interface LoadingOverlayProps {
  /** Controls visibility. When true the overlay fades in and blocks interaction. */
  open: boolean;
  /** Primary text shown below the spinner. */
  title?: string;
  /** Secondary descriptive text shown below the title. */
  description?: string;
}

/**
 * Full-viewport loading overlay with glassmorphism design.
 *
 * Reusable across the website wherever a blocking loading state is needed.
 * Matches HexaKode's dark/blue brand palette.
 *
 * Features:
 * - Dimmed + blurred backdrop preventing all interaction
 * - Centered dark glassmorphism card with subtle blue glow
 * - Animated CSS spinner in brand secondary color (#5dcafd)
 * - Smooth fade in/out via Framer Motion AnimatePresence
 * - Body scroll lock while open
 */
export default function LoadingOverlay({
  open,
  title = "Loading...",
  description,
}: LoadingOverlayProps) {
  // Lock body scroll while the overlay is visible.
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(5, 12, 24, 0.65)" }}
          aria-live="assertive"
          aria-busy="true"
          role="status"
        >
          {/* Blur backdrop — a separate layer so the card itself isn't blurred */}
          <div className="absolute inset-0 backdrop-blur-md" />

          {/* Glassmorphism card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center gap-5 px-10 py-9 rounded-2xl border border-white/[0.08] shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(15, 28, 44, 0.88), rgba(2, 6, 23, 0.92))",
              boxShadow:
                "0 0 60px rgba(93, 202, 253, 0.08), 0 0 20px rgba(93, 202, 253, 0.04), 0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Spinner */}
            <div
              className="w-10 h-10 rounded-full border-[3px] border-white/10 animate-spin"
              style={{
                borderTopColor: "#5dcafd",
              }}
            />

            {/* Title — uses a key to animate text changes smoothly */}
            <AnimatePresence mode="wait">
              <motion.p
                key={title}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="font-headline-sm text-white text-center text-[15px] tracking-wide"
              >
                {title}
              </motion.p>
            </AnimatePresence>

            {description && (
              <p className="text-slate-400 text-center text-[13px] font-body-sm max-w-[260px] leading-relaxed -mt-1">
                {description}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
