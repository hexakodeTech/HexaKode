import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/sanity.image";
import { AlertCircle, AlertTriangle, CheckCircle, Info, Terminal } from "lucide-react";

interface PortableTextRendererProps {
  value: any[];
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 font-normal">{children}</p>,
    h1: ({ children }) => {
      const text = children?.toString() || "";
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return <h1 id={id} className="text-3xl md:text-4xl font-extrabold text-navy-dark mt-10 mb-6 scroll-mt-24">{children}</h1>;
    },
    h2: ({ children }) => {
      const text = children?.toString() || "";
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return <h2 id={id} className="text-2xl md:text-3xl font-extrabold text-navy-dark mt-10 mb-5 scroll-mt-24">{children}</h2>;
    },
    h3: ({ children }) => {
      const text = children?.toString() || "";
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return <h3 id={id} className="text-xl md:text-2xl font-bold text-navy-dark mt-8 mb-4 scroll-mt-24">{children}</h3>;
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary bg-slate-50 rounded-r-2xl py-5 px-6 my-8 text-navy-dark font-medium italic text-base md:text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2.5 pl-4 mb-6 text-slate-600 text-base md:text-lg font-normal">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-2.5 pl-4 mb-6 text-slate-600 text-base md:text-lg font-normal">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="marker:text-primary pl-2">{children}</li>,
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-navy-dark">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-red-500 font-mono text-sm">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-primary hover:text-primary-dark font-semibold underline underline-offset-4 transition-colors"
        >
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => {
      const href = value?.reference?._type === "blog"
        ? `/blog/${value?.reference?.slug?.current || value?.reference?.slug}`
        : `/portfolio/${value?.reference?.slug?.current || value?.reference?.slug}`;
      return (
        <Link href={href} className="text-primary hover:text-primary-dark font-semibold underline underline-offset-4 transition-colors">
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value).width(900).url();
      return (
        <figure className="my-10 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 flex flex-col">
          <div className="relative w-full aspect-[16/9] lg:aspect-[16/10]">
            <Image
              src={imageUrl}
              alt={value.alt || "Article Image"}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              loading="lazy"
            />
          </div>
          {value.caption && (
            <figcaption className="p-4 bg-slate-50/50 border-t border-slate-100 text-center text-xs font-semibold text-slate-400">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => {
      if (!value?.code) return null;
      return (
        <div className="my-8 rounded-2xl border border-slate-200 bg-[#0f172a] text-slate-200 overflow-hidden font-mono text-sm leading-relaxed shadow-lg">
          <div className="px-5 py-3.5 bg-[#1e293b]/70 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 select-none">
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              {value.filename || "code-snippet"}
            </span>
            <span className="uppercase text-[10px] tracking-wider text-slate-500 bg-[#0f172a] px-2 py-0.5 rounded border border-slate-800">
              {value.language || "text"}
            </span>
          </div>
          <pre className="p-6 overflow-x-auto whitespace-pre no-scrollbar">
            <code>{value.code}</code>
          </pre>
        </div>
      );
    },
    table: ({ value }) => {
      if (!value?.rows || !Array.isArray(value.rows)) return null;
      return (
        <div className="my-8 overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <tbody>
              {value.rows.map((row: any, rIdx: number) => (
                <tr
                  key={rIdx}
                  className={rIdx === 0 ? "bg-slate-50 border-b border-slate-100" : "border-b border-slate-50/60 last:border-0"}
                >
                  {row.cells?.map((cell: string, cIdx: number) => {
                    const CellTag = rIdx === 0 ? "th" : "td";
                    return (
                      <CellTag
                        key={cIdx}
                        className={
                          rIdx === 0
                            ? "p-4 font-bold text-xs uppercase tracking-wider text-navy-dark"
                            : "p-4 text-sm text-slate-600 font-medium"
                        }
                      >
                        {cell}
                      </CellTag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    callout: ({ value }) => {
      if (!value?.text) return null;
      const type = value.type || "info";

      const styles = {
        info: {
          bg: "bg-[#f0f9ff] border-[#bae6fd]",
          text: "text-[#0369a1]",
          icon: Info,
        },
        warning: {
          bg: "bg-[#fffbeb] border-[#fde68a]",
          text: "text-[#b45309]",
          icon: AlertTriangle,
        },
        success: {
          bg: "bg-[#f0fdf4] border-[#bbf7d0]",
          text: "text-[#15803d]",
          icon: CheckCircle,
        },
        tip: {
          bg: "bg-[#faf5ff] border-[#e9d5ff]",
          text: "text-[#7e22ce]",
          icon: AlertCircle,
        },
      };

      const style = styles[type as keyof typeof styles] || styles.info;
      const Icon = style.icon;

      return (
        <div className={`my-8 flex items-start gap-4 p-5 rounded-2xl border-l-4 ${style.bg} text-left`}>
          <div className={`shrink-0 mt-0.5 ${style.text}`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className={`text-sm md:text-base leading-relaxed font-semibold ${style.text}`}>
            {value.text}
          </p>
        </div>
      );
    },
    youtubeEmbed: ({ value }) => {
      if (!value?.url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = value.url.match(regExp);
      const videoId = match && match[2].length === 11 ? match[2] : null;

      if (!videoId) return null;

      return (
        <div className="my-10 overflow-hidden border border-slate-100 rounded-2xl bg-slate-50 flex flex-col shadow-sm">
          <div className="relative w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      );
    },
  },
};

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value) return null;
  return (
    <div className="prose prose-slate max-w-none">
      <PortableText value={value} components={components} />
    </div>
  );
}
