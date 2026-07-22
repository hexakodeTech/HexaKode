"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  Settings,
  LogOut,
  X,
  Database,
  Loader2,
  Calendar,
  Ticket,
  Building2,
  ChevronRight,
  LayoutGrid,
  BookOpen,
  Layers,
  Tag,
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Enquiries", path: "/admin/enquiries", icon: Inbox },
    { name: "Free Consultations", path: "/admin/demos", icon: Calendar },
    { name: "Referral Codes", path: "/admin/coupons", icon: Ticket },
    { name: "Clients", path: "/admin/clients", icon: Building2 },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  // CMS sub-navigation state
  const isCmsActive = pathname.startsWith("/admin/cms");
  const [cmsExpanded, setCmsExpanded] = useState(isCmsActive);

  const cmsSubItems = [
    { name: "Portfolio", path: "/admin/cms/portfolio", icon: LayoutGrid },
    { name: "Blogs", path: "/admin/cms/blogs", icon: BookOpen },
    { name: "Categories", path: "/admin/cms/categories", icon: Layers },
    { name: "Tags", path: "/admin/cms/tags", icon: Tag },
    { name: "Media Library", path: "/admin/cms/media", icon: ImageIcon },
  ];

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/admin");
      } else {
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-surface-container-lowest border-r border-outline-variant/30 py-5 transition-all duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
          isOpen ? "translate-x-0 w-64 px-4" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-16 md:px-2" : "md:w-64 md:px-4"}`}
      >
        {/* Header Branding */}
        <div
          className={`flex items-center mb-6 px-1 ${
            isCollapsed ? "md:justify-center" : "justify-between"
          }`}
        >
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5_VqrmGo0Yyz2eCzbJ2FcbcrPZN_jWkAN6euuVQzxrMkBQ2CfDpOjYWVe3aq_AIEswpv2MS4XO9VgfvgOFIYMSC9rIm3SjEQNwjrtmhhJmp1ft5nzoPat2z9QwmJwgn0zJZJsMIPoV_gQAD4p0NGbbo0TUaWEuuKEfg6nSP7dh7vq5hNBrqxnYyEYRa9qzr-Tg45hOyEIhgvax0BWxfDDB6uswBvAKj-sJbsOilWcd1wIOkM4PBdSVCjBDaXsnpVcMmsk_TKfO8Xk"
              alt="HexaKode Logo"
              className="h-7 w-auto shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-headline-sm text-sm font-semibold tracking-tight text-primary leading-none">
                  HexaKode
                </span>
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 mt-0.5">
                  Admin Console
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-on-surface-variant/70 hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-on-surface-variant hover:bg-surface-container md:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path === "/admin/clients" && pathname.startsWith("/admin/clients"));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center gap-3 py-2.5 rounded-lg text-sm transition-colors group cursor-pointer ${
                  isCollapsed ? "justify-center px-2" : "px-3"
                } ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 bg-surface-container rounded-lg border-l-2 border-secondary z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative z-10 w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-secondary" : "text-on-surface-variant/70"
                  }`}
                />
                {!isCollapsed && (
                  <span className="relative z-10 font-body-sm text-[13px] truncate">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}

          {/* ── CMS Section ───────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => {
              if (isCollapsed && onToggleCollapse) {
                onToggleCollapse();
              }
              setCmsExpanded((v) => !v);
            }}
            title={isCollapsed ? "CMS Management" : undefined}
            className={`relative flex items-center gap-3 w-full py-2.5 rounded-lg text-sm transition-colors group cursor-pointer ${
              isCollapsed ? "justify-center px-2" : "px-3"
            } ${
              isCmsActive
                ? "text-primary font-medium"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            {isCmsActive && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-surface-container rounded-lg border-l-2 border-secondary z-0"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Database
              className={`relative z-10 w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                isCmsActive ? "text-secondary" : "text-on-surface-variant/70"
              }`}
            />
            {!isCollapsed && (
              <>
                <span className="relative z-10 font-body-sm text-[13px] flex-1 text-left truncate">
                  CMS
                </span>
                <ChevronRight
                  className={`relative z-10 w-3.5 h-3.5 text-on-surface-variant/50 transition-transform duration-200 ${
                    cmsExpanded ? "rotate-90" : ""
                  }`}
                />
              </>
            )}
          </button>

          {/* CMS Sub-items (expanded mode only) */}
          {!isCollapsed && (
            <AnimatePresence initial={false}>
              {cmsExpanded && (
                <motion.div
                  key="cms-sub"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 pl-3 border-l border-outline-variant/25 space-y-0.5 py-1">
                    <Link
                      href="/admin/cms"
                      onClick={onClose}
                      className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                        pathname === "/admin/cms"
                          ? "text-secondary font-medium bg-surface-container"
                          : "text-on-surface-variant/70 hover:text-primary hover:bg-surface-container-low"
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span className="font-body-sm text-[12px]">CMS Hub</span>
                    </Link>

                    {cmsSubItems.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = pathname.startsWith(sub.path);
                      return (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          onClick={onClose}
                          className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                            isSubActive
                              ? "text-secondary font-medium bg-surface-container"
                              : "text-on-surface-variant/70 hover:text-primary hover:bg-surface-container-low"
                          }`}
                        >
                          <SubIcon className="w-3.5 h-3.5" />
                          <span className="font-body-sm text-[12px]">{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </nav>

        {/* Footer / Logout Section */}
        <div className="pt-3 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={isCollapsed ? "Logout Session" : undefined}
            className={`flex w-full items-center gap-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-error hover:bg-error-container/10 transition-colors group cursor-pointer disabled:opacity-50 ${
              isCollapsed ? "justify-center px-2" : "px-3"
            }`}
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-error shrink-0" />
            ) : (
              <LogOut className="w-4 h-4 text-on-surface-variant/70 group-hover:text-error transition-colors shrink-0" />
            )}
            {!isCollapsed && (
              <span className="font-body-sm text-[13px] truncate">
                {isLoggingOut ? "Ending Session..." : "Logout Session"}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
