"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Lazy-load the heavy modal UI (react-hook-form, zod, framer-motion AnimatePresence)
// only when the user actually opens the modal
const DemoModalContent = dynamic(() => import("./DemoModalContent"), {
  ssr: false,
});

export interface DemoModalOptions {
  source?: string;
  inquiryType?: string;
}

interface DemoModalContextType {
  openDemoModal: (options?: DemoModalOptions) => void;
  closeDemoModal: () => void;
}

const DemoModalContext = createContext<DemoModalContextType | undefined>(undefined);

export function useDemoModal() {
  const context = useContext(DemoModalContext);
  if (!context) {
    throw new Error("useDemoModal must be used within a DemoModalProvider");
  }
  return context;
}

export function DemoModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<DemoModalOptions>({});

  const openDemoModal = useCallback((options?: DemoModalOptions) => {
    setModalOptions(options || {});
    setIsOpen(true);
  }, []);

  const closeDemoModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DemoModalContext.Provider value={{ openDemoModal, closeDemoModal }}>
      {children}
      {isOpen && (
        <DemoModalContent
          isOpen={isOpen}
          modalOptions={modalOptions}
          onClose={closeDemoModal}
        />
      )}
    </DemoModalContext.Provider>
  );
}
