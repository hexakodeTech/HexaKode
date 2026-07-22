"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DesktopNavigation from "./nav/DesktopNavigation";
import MobileNavigation from "./nav/MobileNavigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ease-out",
        scrolled
          ? "bg-surface/90 border-outline-variant/30 backdrop-blur-md shadow-premium"
          : "bg-surface/70 border-outline-variant/10 backdrop-blur-sm"
      )}
    >
      <div className="px-4 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto">
        {/* Desktop Navigation System (>= 1024px) */}
        <DesktopNavigation pathname={pathname} />

        {/* Mobile Navigation System (< 1024px) */}
        <MobileNavigation pathname={pathname} />
      </div>
    </header>
  );
}
