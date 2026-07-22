"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state

  // Detect if current route is an editor workspace (e.g. /admin/cms/blogs/new or /admin/cms/blogs/[id])
  const isEditorWorkspace = useMemo(() => {
    if (!pathname) return false;
    if (pathname === "/admin/cms/blogs/new") return true;
    return pathname.startsWith("/admin/cms/blogs/") && pathname !== "/admin/cms/blogs";
  }, [pathname]);

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse when entering editor; restore state when leaving
  useEffect(() => {
    const sessionPref = sessionStorage.getItem("admin_sidebar_collapsed");
    if (sessionPref !== null) {
      setIsCollapsed(sessionPref === "true");
      return;
    }

    if (isEditorWorkspace) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isEditorWorkspace, pathname]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      sessionStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Administrative Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Panel Scroll Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto w-full max-w-[1700px]"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
