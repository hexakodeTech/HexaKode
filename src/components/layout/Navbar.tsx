"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Smartphone, Palette, ChevronDown } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import Brand from "../common/Brand";
import { cn } from "../../lib/utils";
import { useDemoModal } from "../common/DemoModal";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Book a Free Consultation", href: "#", onClick: true },
];

const SERVICE_DROPDOWN_ITEMS = [
  {
    label: "Website Development",
    href: "/services/web-development",
    description: "Custom websites, business websites & web applications",
    icon: Globe,
  },
  {
    label: "Mobile App Development",
    href: "/services/mobile-app-development",
    description: "Android, iOS & Flutter applications",
    icon: Smartphone,
  },
  {
    label: "UI/UX Design",
    href: "/services/ui-ux-design",
    description: "User interface, user experience & product design",
    icon: Palette,
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
  const pathname = usePathname();
  const { openDemoModal } = useDemoModal();

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleItemBlur = (e: React.FocusEvent) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
      timeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 150);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) return;
    
    const panel = dropdownRef.current?.querySelector('[role="menu"]');
    const focusableElements = panel?.querySelectorAll('a');
    if (!focusableElements || focusableElements.length === 0) return;
    
    const items = Array.from(focusableElements) as HTMLAnchorElement[];
    const activeIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % items.length;
      items[nextIndex].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (activeIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsDropdownOpen(false);
      const triggerLink = dropdownRef.current?.querySelector('a');
      (triggerLink as HTMLElement)?.focus();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleGlobalKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b backdrop-blur-md shadow-sm",
        scrolled
          ? "bg-surface/90 border-outline-variant/30 py-2"
          : "bg-surface/80 border-outline-variant/20 py-4"
      )}
    >
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105 shrink-0">
            <Image
              src="/logo-icon.png"
              alt="HexaKode Logo"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <Brand variant="navbar" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link) => {
            if (link.onClick) {
              return (
                <button
                  key={link.label}
                  onClick={() => openDemoModal({ source: "Navigation", inquiryType: "Technical Discovery Call" })}
                  className="font-body-md transition-colors duration-300 hover:text-primary text-on-surface-variant cursor-pointer bg-transparent border-none outline-none p-0 text-left"
                >
                  {link.label}
                </button>
              );
            }

            if (link.label === "Services") {
              return (
                <div
                  key={link.label}
                  ref={dropdownRef}
                  className="relative py-2 group/dropdown"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onKeyDown={handleKeyDown}
                >
                  <Link
                    href={link.href}
                    onFocus={handleMouseEnter}
                    onBlur={handleBlur}
                    aria-haspopup="menu"
                    aria-expanded={isDropdownOpen}
                    className={cn(
                      "font-body-md transition-colors duration-300 hover:text-primary flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary/20 rounded px-1.5 py-0.5 outline-none select-none",
                      pathname.startsWith("/services")
                        ? "text-primary font-semibold border-b border-secondary"
                        : "text-on-surface-variant"
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isDropdownOpen ? "rotate-180 text-primary" : "text-on-surface-variant")} />
                  </Link>

                  {/* Dropdown Panel */}
                  <div
                    role="menu"
                    aria-label="Services Submenu"
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl border border-outline-variant/30 shadow-premium p-4 flex flex-col gap-1 transition-all duration-200 origin-top z-50",
                      isDropdownOpen ? "opacity-100 scale-100 visible pointer-events-auto" : "opacity-0 scale-95 invisible pointer-events-none"
                    )}
                  >
                    {SERVICE_DROPDOWN_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          role="menuitem"
                          onBlur={handleItemBlur}
                          className="flex gap-4 p-3.5 rounded-xl hover:bg-slate-50 transition-colors duration-200 text-left group focus-visible:ring-2 focus-visible:ring-primary/20 outline-none"
                          prefetch={true}
                        >
                          <div className="w-10 h-10 rounded-lg bg-secondary-container/30 text-primary flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
                            <Icon className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-bold text-navy-dark text-sm group-hover:text-primary transition-colors">
                              {item.label}
                            </h4>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "font-body-md transition-colors duration-300 hover:text-primary",
                  isActive
                    ? "text-primary font-semibold border-b border-secondary"
                    : "text-on-surface-variant"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <PrimaryButton
            href="/contact#contact-form"
            variant="primary"
            shimmer={true}
            magnetic={true}
            className="px-6 py-3"
          >
            Start Your Project
          </PrimaryButton>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-surface border-b border-outline-variant/30 shadow-lg px-margin-mobile py-6 transition-all duration-300 md:hidden flex flex-col gap-6 origin-top",
          isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-4">
          {NAV_LINKS.map((link) => {
            if (link.onClick) {
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    setIsOpen(false);
                    openDemoModal({ source: "Mobile Navigation", inquiryType: "Technical Discovery Call" });
                  }}
                  className="font-body-md py-1 self-start transition-colors duration-300 hover:text-primary text-on-surface-variant cursor-pointer bg-transparent border-none outline-none p-0 text-left"
                >
                  {link.label}
                </button>
              );
            }

            if (link.label === "Services") {
              return (
                <div key={link.label} className="w-full flex flex-col">
                  <div className="flex items-center justify-between w-full py-1">
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "font-body-md transition-colors duration-300 hover:text-primary",
                        pathname.startsWith("/services") ? "text-primary font-semibold" : "text-on-surface-variant"
                      )}
                    >
                      {link.label}
                    </Link>
                    <button
                      onClick={() => setIsMobileSubmenuOpen(!isMobileSubmenuOpen)}
                      className="p-2 -mr-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      aria-label="Toggle services submenu"
                    >
                      <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", isMobileSubmenuOpen ? "rotate-180" : "")} />
                    </button>
                  </div>
                  
                  {/* Mobile Submenu Items */}
                  <div
                    className={cn(
                      "flex flex-col gap-3 pl-4 border-l border-slate-100 overflow-hidden transition-all duration-300 origin-top mt-2",
                      isMobileSubmenuOpen ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0 pointer-events-none mt-0"
                    )}
                  >
                    {SERVICE_DROPDOWN_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => {
                            setIsOpen(false);
                            setIsMobileSubmenuOpen(false);
                          }}
                          className="flex items-center gap-3 py-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                          prefetch={true}
                        >
                          <Icon className="w-4 h-4 text-secondary shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "font-body-md py-1 self-start transition-colors duration-300 hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-on-surface-variant"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <PrimaryButton
          href="/contact#contact-form"
          variant="primary"
          onClick={() => setIsOpen(false)}
          className="w-full text-center"
        >
          Start Your Project
        </PrimaryButton>
      </div>
    </header>
  );
}

