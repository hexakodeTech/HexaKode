"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubItem {
  label: string;
  href: string;
  isFutureReady?: boolean;
  icon: React.ElementType;
}

interface MobileAccordionProps {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  items: SubItem[];
  pathname: string;
  onCloseDrawer: () => void;
  isParentActive: boolean;
}

export default function MobileAccordion({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  items,
  pathname,
  onCloseDrawer,
  isParentActive,
}: MobileAccordionProps) {
  return (
    <div className="flex flex-col">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
        className={cn(
          "flex items-center justify-between min-h-[52px] px-3.5 rounded-xl text-[16px] font-medium tracking-tight transition-all duration-200 border-l-2 cursor-pointer text-left w-full select-none",
          isParentActive
            ? "text-secondary bg-secondary/5 border-secondary font-semibold"
            : "text-on-surface-variant hover:text-primary hover:bg-slate-50 border-transparent"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4.5 h-4.5 text-secondary/80 shrink-0" />
          <span>{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-300 shrink-0",
            isOpen ? "rotate-180 text-secondary" : "text-on-surface-variant/60"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden pl-4 pr-2 space-y-1 mt-1 border-l border-slate-100 ml-4"
          >
            {items.map((item) => {
              const ItemIcon = item.icon;
              const isItemActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onCloseDrawer}
                  className={cn(
                    "flex items-center gap-3 min-h-[48px] px-3.5 rounded-lg text-[14px] text-on-surface-variant hover:text-secondary hover:bg-slate-50 transition-colors select-none",
                    isItemActive && "text-secondary font-semibold bg-secondary/5"
                  )}
                >
                  <ItemIcon className="w-4 h-4 text-secondary/70 shrink-0" />
                  <span>{item.label}</span>
                  {item.isFutureReady && (
                    <span className="text-[7.5px] uppercase tracking-wide bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full scale-90 ml-auto">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
