import React, { memo } from "react";
import { cn } from "@/lib/utils";

export interface TechLogoEntry {
  name: string;
  renderIcon: () => React.ReactNode;
}

export interface TechnologyChipProps {
  /** Technology data object containing name and icon renderer */
  technology: TechLogoEntry;
  /** Optional additional class names for the chip wrapper */
  className?: string;
}

/**
 * Reusable technology chip used in "Technologies We Use" sections.
 * Displays an icon alongside a technology name with a hover interaction.
 *
 * Wrapped in React.memo since chip content is static and does not
 * benefit from re-renders triggered by parent state changes.
 */
const TechnologyChip = memo(function TechnologyChip({
  technology,
  className,
}: TechnologyChipProps) {
  return (
    <div
      className={cn(
        // Layout
        "flex items-center gap-3",
        // Sizing
        "px-5 py-3.5 min-h-[44px]",
        // Appearance
        "bg-white rounded-xl border border-slate-200/70 shadow-2xs",
        // Hover interactions (no layout shift — uses transform only)
        "hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
        // Transition
        "transition-all duration-300",
        // Group context for icon child transitions
        "group cursor-default",
        className
      )}
    >
      {/* Icon container — grayscale by default, full colour on hover */}
      <div
        className="w-6 h-6 flex items-center justify-center shrink-0 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
        aria-hidden="true"
      >
        {technology.renderIcon()}
      </div>

      {/* Technology name */}
      <span className="text-xs font-semibold tracking-[0.015em] text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
        {technology.name}
      </span>
    </div>
  );
});

export default TechnologyChip;
