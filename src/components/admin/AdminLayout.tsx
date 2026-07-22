"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export default function AdminLayout({ children, hideSidebar = false }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar Navigation (hidden when hideSidebar is true) */}
      {!hideSidebar && (
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Main Administrative Area */}
      <div className="flex flex-1 flex-col overflow-hidden w-full min-w-0">
        {/* Top Header */}
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Panel Scroll Area */}
        <main className={`flex-1 overflow-y-auto ${hideSidebar ? "p-3 sm:p-5 md:p-6" : "px-6 py-8 md:px-8"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`w-full ${hideSidebar ? "max-w-full" : "mx-auto max-w-container-max"}`}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
