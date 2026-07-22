"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Breadcrumb from "@/components/blog/Breadcrumb";
import HTMLRenderer from "@/components/blog/HTMLRenderer";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import AuthorCard from "@/components/blog/AuthorCard";
import NewsletterCTA from "@/components/blog/NewsletterCTA";
import {
  formatBlogDate,
  calculateReadingTime,
  extractTableOfContents,
} from "@/modules/blog/utils/helpers";

export interface BlogArticleViewData {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string | null;
  category?: { name: string; slug?: string } | null;
  tags?: Array<{ id?: string; name: string } | { tagId?: string; tag: { name: string } }>;
  authorName?: string | null;
  authorAvatar?: string | null;
}

interface BlogArticleViewProps {
  post: BlogArticleViewData;
  isPreview?: boolean;
  pageUrl?: string;
}

export default function BlogArticleView({
  post,
  isPreview = false,
  pageUrl = "https://www.hexakode.in/blog/preview",
}: BlogArticleViewProps) {
  const displayTitle = post.title || "Untitled Article";
  const displayImage =
    post.featuredImage && post.featuredImage.trim() !== ""
      ? post.featuredImage
      : "/images/blog-placeholder.svg";

  const readingTime = useMemo(
    () => calculateReadingTime(post.content || ""),
    [post.content]
  );

  const headings = useMemo(
    () => extractTableOfContents(post.content || ""),
    [post.content]
  );

  const normalizedTags = useMemo(() => {
    if (!post.tags) return [];
    return post.tags.map((t: any, idx: number) => {
      if (t.name) return { id: t.id || `tag-${idx}`, name: t.name };
      if (t.tag?.name) return { id: t.tagId || `tag-${idx}`, name: t.tag.name };
      return { id: `tag-${idx}`, name: String(t) };
    });
  }, [post.tags]);

  const displayDate = formatBlogDate(
    post.publishedAt || post.createdAt || new Date()
  );

  /**
   * Fallback Meta Description / Excerpt:
   * If post.excerpt is missing or empty, generate a preview snippet from first paragraph
   * without modifying stored data.
   */
  const displayExcerpt = useMemo(() => {
    if (post.excerpt && post.excerpt.trim() !== "") {
      return post.excerpt.trim();
    }
    const plainText = (post.content || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!plainText) return "";
    return plainText.length > 160 ? `${plainText.slice(0, 157)}...` : plainText;
  }, [post.excerpt, post.content]);

  /**
   * Option A Content Split:
   * Render first introductory paragraph(s) before cover image.
   */
  const contentParts = useMemo(() => {
    const rawHtml = post.content || "";
    if (!post.featuredImage) return { intro: "", body: rawHtml };

    const pEndIndex = rawHtml.indexOf("</p>");
    if (pEndIndex !== -1 && pEndIndex < 1200) {
      const secondPEndIndex = rawHtml.indexOf("</p>", pEndIndex + 4);
      const targetIndex =
        secondPEndIndex !== -1 && secondPEndIndex < 1800
          ? secondPEndIndex + 4
          : pEndIndex + 4;

      return {
        intro: rawHtml.slice(0, targetIndex),
        body: rawHtml.slice(targetIndex),
      };
    }

    return { intro: "", body: rawHtml };
  }, [post.content, post.featuredImage]);

  return (
    <div className="flex-1 flex flex-col w-full bg-background overflow-x-hidden">
      {/* ── Content-First Hero Header ───────────────────────────────────── */}
      <Section
        variant="muted"
        className="py-8 md:py-12 border-b border-outline-variant/10 text-left"
      >
        <Container className="max-w-4xl">
          {/* 1. Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Blog", href: "/blog" },
              { label: displayTitle },
            ]}
          />

          {/* 2. Category • Publish Date • Reading Time */}
          <div className="flex flex-wrap items-center gap-3 text-xs mt-4 mb-2">
            {post.category?.name && (
              <span className="px-3 py-1 rounded-lg bg-primary text-[11px] font-bold tracking-wider text-white uppercase shadow-xs">
                {post.category.name}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {displayDate}
            </span>
            {readingTime > 0 && (
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {readingTime} min read
              </span>
            )}
          </div>

          {/* 3. Blog Title */}
          <h1 className="font-headline-xl text-display-sm md:text-display-md text-navy-dark font-extrabold tracking-tight leading-tight my-3">
            {displayTitle}
          </h1>

          {/* 4. Meta Description (Short Excerpt) — Immediately below title */}
          {displayExcerpt ? (
            <p className="text-[18px] md:text-[20px] font-normal text-slate-600 leading-[1.7] max-w-[760px] my-4">
              {displayExcerpt}
            </p>
          ) : null}

          {/* 5. Author Information & Share Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Written by {post.authorName || "HexaKode Team"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ShareButtons url={pageUrl} title={displayTitle} />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Article Content Grid ────────────────────────────────────────── */}
      <Section variant="white" spacing="medium" className="py-8 md:py-12 text-left">
        <Container className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Article Body Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Mobile Collapsible Table of Contents */}
            {headings.length > 0 && (
              <div className="block lg:hidden">
                <TableOfContents headings={headings} isMobile={true} />
              </div>
            )}

            {/* Introductory Text (Renders immediately above fold before cover image) */}
            {contentParts.intro ? (
              <HTMLRenderer html={contentParts.intro} />
            ) : null}

            {/* 6. Featured Image (Positioned after introduction) */}
            {post.featuredImage && (
              <div className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] overflow-hidden rounded-2xl border border-slate-100/80 bg-slate-50 shadow-xs my-2">
                <Image
                  src={displayImage}
                  alt={displayTitle}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            {/* 7. Main Article Body Content */}
            <HTMLRenderer
              html={
                contentParts.body ||
                post.content ||
                "<p className='text-slate-400 italic'>No content written yet.</p>"
              }
            />

            {/* Tags */}
            {normalizedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100">
                {normalizedTags.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 text-xs font-semibold"
                  >
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {t.name}
                  </span>
                ))}
              </div>
            )}

            {/* Author Card & Share Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100 items-center">
              <AuthorCard
                author={{
                  name: post.authorName || "HexaKode Team",
                  avatar: post.authorAvatar || undefined,
                }}
              />
              <div className="flex md:justify-end">
                <ShareButtons url={pageUrl} title={displayTitle} />
              </div>
            </div>
          </div>

          {/* Sticky Desktop Table of Contents Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28 self-start hidden lg:flex">
            {!isPreview && (
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors group self-start border border-slate-100 rounded-xl px-4 py-2 bg-slate-50/30"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Back to Blog</span>
              </Link>
            )}

            {headings.length > 0 ? (
              <TableOfContents headings={headings} />
            ) : (
              <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 text-xs text-slate-400 italic">
                Add H2 or H3 headings to auto-generate Table of Contents.
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Footer CTA & Newsletter Section */}
      <Section variant="white" className="border-t border-slate-100/60 pb-16 bg-slate-50/30">
        <Container>
          <NewsletterCTA />
        </Container>
      </Section>
    </div>
  );
}
