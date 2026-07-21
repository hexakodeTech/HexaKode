import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ReadingProgress from "@/components/blog/ReadingProgress";
import Breadcrumb from "@/components/blog/Breadcrumb";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import AuthorCard from "@/components/blog/AuthorCard";
import HTMLRenderer from "@/components/blog/HTMLRenderer";
import RelatedBlogs from "@/components/blog/RelatedBlogs";
import NewsletterCTA from "@/components/blog/NewsletterCTA";
import {
  getPublishedBlogBySlug,
  getRelatedBlogs,
  getAllPublishedBlogSlugs,
  incrementBlogViews,
} from "@/modules/blog/services/blog.service";
import { formatBlogDate, extractTableOfContents, extractFaqEntries } from "@/modules/blog/utils/helpers";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPublishedBlogBySlug(slug).catch(() => null);
  if (!post) return { title: "Article Not Found | HexaKode" };

  const title = post.seoTitle || `${post.title} | HexaKode Blog`;
  const description = post.metaDescription || post.excerpt || "";
  const canonical = post.canonicalUrl || `https://www.hexakode.in/blog/${post.slug}`;
  const ogImage = post.ogImage || post.featuredImage || undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorName],
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedBlogSlugs().catch(() => []);
  return slugs.map((slug: string) => ({ slug }));
}

export default async function BlogDetailPage(props: PageProps) {
  const { slug } = await props.params;

  const post = await getPublishedBlogBySlug(slug).catch(() => null);
  if (!post) notFound();

  // Async: increment views (non-blocking)
  incrementBlogViews(post.id).catch(() => {});

  const relatedPosts = await getRelatedBlogs(post.id, post.categoryId).catch(() => []);

  const headings = extractTableOfContents(post.content);
  const faqEntries = extractFaqEntries(post.content);
  const pageUrl = `https://www.hexakode.in/blog/${post.slug}`;
  const displayImage = post.featuredImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: displayImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: {
      "@type": "Organization",
      name: "HexaKode",
      logo: { "@type": "ImageObject", url: "https://www.hexakode.in/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.hexakode.in" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.hexakode.in/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
    ],
  };

  // FAQ JSON-LD
  const faqJsonLd = faqEntries.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  // Adapt related posts for RelatedBlogs component
  const adaptedRelated = relatedPosts.map((r: any) => ({
    _id: r.id,
    title: r.title,
    slug: r.slug,
    shortDescription: r.excerpt,
    _featuredImageUrl: r.featuredImage,
    publishedAt: r.publishedAt?.toISOString() ?? r.createdAt.toISOString(),
    readingTime: r.readingTime,
    author: { name: r.authorName },
    category: r.category ? { name: r.category.name, slug: r.category.slug } : null,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <Navbar />
      <ReadingProgress />

      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-28">

        {/* Header */}
        <Section variant="muted" className="py-12 md:py-16 border-b border-outline-variant/10 text-left">
          <Container className="max-w-4xl">
            <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

            <div className="flex flex-wrap items-center gap-3.5 mb-6 mt-4">
              {post.category && (
                <span className="px-3.5 py-1 rounded-lg bg-primary text-xs font-bold tracking-wider text-white uppercase shadow-sm">
                  {post.category.name}
                </span>
              )}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatBlogDate(post.publishedAt ?? post.createdAt)}
                </span>
                {post.readingTime > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} min read
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-headline-xl text-display-sm md:text-display-md text-navy-dark font-extrabold tracking-tight leading-tight mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="font-body-lg text-body-lg text-slate-500 leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}
          </Container>
        </Section>

        {/* Content + Sidebar */}
        <Section variant="white" spacing="large" className="pt-12 pb-24 text-left">
          <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Article Content */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Hero Image */}
              <div className="relative w-full aspect-[16/9] lg:aspect-[16/10] overflow-hidden rounded-2xl border border-slate-100/80 bg-slate-50">
                <Image
                  src={displayImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>

              {/* Body */}
              <div className="mt-4">
                <HTMLRenderer html={post.content} />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-100">
                  {post.tags.map((t: any) => (
                    <span
                      key={t.tagId}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 hover:border-slate-200 hover:text-slate-700 transition-colors text-xs font-semibold"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {t.tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Author + Share */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-100 items-center">
                <AuthorCard
                  author={{ name: post.authorName, avatar: post.authorAvatar || undefined }}
                />
                <div className="flex md:justify-end">
                  <ShareButtons url={pageUrl} title={post.title} />
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-8 sticky top-28 self-start hidden lg:flex">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors group self-start border border-slate-100 rounded-xl px-4 py-2 bg-slate-50/30"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Back to Blog</span>
              </Link>
              {headings.length > 0 && <TableOfContents headings={headings} />}
            </div>

          </Container>
        </Section>

        {/* Related Articles */}
        <Section variant="white" className="border-t border-slate-100/60 pb-16 bg-slate-50/30">
          <Container>
            <Suspense fallback={<div className="h-60 bg-slate-100 rounded-2xl animate-pulse" />}>
              <RelatedBlogs posts={adaptedRelated} />
            </Suspense>
            <NewsletterCTA />
          </Container>
        </Section>

      </main>
      <Footer />
    </>
  );
}
