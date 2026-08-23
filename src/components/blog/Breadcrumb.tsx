import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 select-none pb-4" aria-label="Breadcrumb">
      <Link href="/" className="flex items-center gap-1 hover:text-slate-700 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-slate-600 font-bold truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-slate-700 transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
