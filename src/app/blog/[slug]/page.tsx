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
import PortableTextRenderer from "@/components/blog/PortableTextRenderer";
import RelatedBlogs from "@/components/blog/RelatedBlogs";
import NewsletterCTA from "@/components/blog/NewsletterCTA";
import { getBlogBySlug, getRelatedBlogs, getBlogs } from "@/lib/queries/blog";
import { urlFor } from "@/sanity/lib/sanity.image";
import { formatPublishDate, generateTableOfContents } from "@/utils/blog";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found | HexaKode",
    };
  }

  const title = post.seo?.metaTitle || `${post.title} | HexaKode Blog`;
  const description = post.seo?.metaDescription || post.shortDescription;
  const canonical = post.seo?.canonicalUrl || `https://www.hexakode.in/blog/${post.slug}`;
  const ogImageUrl = post.seo?.openGraphImage
    ? urlFor(post.seo.openGraphImage).width(1200).height(630).url()
    : post.featuredImage
    ? urlFor(post.featuredImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.lastUpdated,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

/**
 * Automatically extracts question headings and subsequent paragraph nodes to form FAQPage JSON-LD.
 */
function extractFaqSchema(content: any[], url: string) {
  if (!content || !Array.isArray(content)) return null;
  const questions: { question: string; answer: string }[] = [];

  for (let i = 0; i < content.length; i++) {
    const block = content[i];
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text = block.children?.map((c: any) => c.text || "").join("") || "";
      const isQuestion = text.trim().endsWith("?") || 
                         /^(what|why|how|who|where|when|should|can|is|are|do|does)\b/i.test(text.trim());
      
      if (isQuestion) {
        let answerText = "";
        for (let j = i + 1; j < content.length; j++) {
          const nextBlock = content[j];
          if (nextBlock._type === "block") {
            if (nextBlock.style === "h1" || nextBlock.style === "h2" || nextBlock.style === "h3") {
              break;
            }
            const pText = nextBlock.children?.map((c: any) => c.text || "").join("") || "";
            answerText += (answerText ? " " : "") + pText;
          }
        }
        if (answerText.trim()) {
          questions.push({
            question: text.trim(),
            answer: answerText.trim(),
          });
        }
      }
    }
  }

  if (questions.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((q) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer,
      },
    })),
  };
}

export default async function BlogDetailPage(props: PageProps) {
  const params = await props.params;
  const post = await getBlogBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const pageUrl = `https://www.hexakode.in/blog/${post.slug}`;
  const headings = generateTableOfContents(post.content || []);
  
  const tagSlugs = post.tags?.map((t: any) => t.slug) || [];
  const relatedPosts = await getRelatedBlogs(post.slug, post.category?.slug, tagSlugs);

  // Article structured JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [
      post.featuredImage ? urlFor(post.featuredImage).width(1200).height(675).url() : ""
    ],
    "datePublished": post.publishedAt,
    "dateModified": post.lastUpdated || post.publishedAt,
    "author": [
      {
        "@type": "Person",
        "name": post.author?.name || "HexaKode Editor",
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "HexaKode",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.hexakode.in/logo-icon.png"
      }
    },
    "description": post.shortDescription
  };

  const faqSchema = extractFaqSchema(post.content || [], pageUrl);

  const displayImage = post.featuredImage
    ? urlFor(post.featuredImage).width(1200).height(675).url()
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuB2YxLvd3x5jPAxgZFL6XMO5u3FKnZOqm3Sw5jiYFwt6C_1rbby046caqliXpWGTpjLpPwnIvaeaOmdE4lDZVyZ_sdZvktvMtR48G9PDwq9PdT4z5dmEyDZmvTGdtk0tGLYG3aND_F-CKnXlxCnvDioVyszWJ-5hrLBoAQmefvVnmK51ys89hcKnm770jq6SVjM3Pg-onRL9YM_DO5PLioIGZ3Onw3JrHAYxnPC4ePN8pVa9SN1k4ErAvN0hneQVUTOK8JkgL9fql8e";

  return (
    <>
      <Navbar />
      <ReadingProgress />

      {/* Structured Metadata injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="flex-1 flex flex-col w-full bg-background overflow-x-hidden pt-28">
        
        {/* POST HEADER HEADER */}
        <Section variant="muted" className="py-12 md:py-16 border-b border-outline-variant/10 text-left">
          <Container className="max-w-4xl">
            <Breadcrumb
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title }
              ]}
            />

            <div className="flex flex-wrap items-center gap-3.5 mb-6 mt-4">
              {post.category && (
                <span className="px-3.5 py-1 rounded-lg bg-primary text-xs font-bold tracking-wider text-white uppercase shadow-sm">
                  {post.category.name}
                </span>
              )}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatPublishDate(post.publishedAt)}
                </span>
                {post.readingTime && (
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
            <p className="font-body-lg text-body-lg text-slate-500 leading-relaxed max-w-3xl">
              {post.shortDescription}
            </p>
          </Container>
        </Section>

        {/* DETAILS LAYOUT CONTAINER */}
        <Section variant="white" spacing="large" className="pt-12 pb-24 text-left">
          <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Content Block */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Feature Hero Image */}
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

              {/* Portable text nodes rendering */}
              <div className="mt-4">
                <PortableTextRenderer value={post.content} />
              </div>

              {/* Tag Chips list */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-slate-100">
                  {post.tags.map((tag: any) => (
                    <span
                      key={tag.slug}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-100 hover:border-slate-200 hover:text-slate-700 transition-colors text-xs font-semibold"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Social actions & Author card mobile rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-100 items-center">
                <AuthorCard author={post.author} />
                <div className="flex md:justify-end">
                  <ShareButtons url={pageUrl} title={post.title} />
                </div>
              </div>

            </div>

            {/* Right: Sticky Sidebar TableOfContents */}
            <div className="lg:col-span-4 flex flex-col gap-8 sticky top-28 self-start hidden lg:flex">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors group self-start border border-slate-100 rounded-xl px-4 py-2 bg-slate-50/30"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Back to Blog</span>
              </Link>
              <TableOfContents headings={headings} />
            </div>

          </Container>
        </Section>

        {/* RELATED ARTICLES FOOTER LIST */}
        <Section variant="white" className="border-t border-slate-100/60 pb-16 bg-slate-50/30">
          <Container>
            <Suspense fallback={<div className="h-60 bg-slate-100 rounded-2xl animate-pulse" />}>
              <RelatedBlogs posts={relatedPosts} />
            </Suspense>
            <NewsletterCTA />
          </Container>
        </Section>

      </main>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  try {
    const data = await getBlogs({ limit: 100 });
    return data.posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for blogs:", error);
    return [];
  }
}
