import { client, isSanityConfigured } from "@/sanity/lib/sanity.client";
import { groq } from "next-sanity";

export interface GetBlogsParams {
  search?: string;
  category?: string;
  tag?: string;
  sort?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

/**
 * Fetch a paginated, filtered list of published blogs.
 */
export async function getBlogs({
  search,
  category,
  tag,
  sort = "newest",
  page = 1,
  limit = 12,
}: GetBlogsParams = {}) {
  if (!isSanityConfigured) return { posts: [], total: 0 };
  try {
    const start = (page - 1) * limit;
    const end = start + limit;

    let filters = `_type == "blog" && status == "published"`;

    if (category) {
      filters += ` && category->slug.current == $category`;
    }
    if (tag) {
      filters += ` && $tag in tags[]->slug.current`;
    }
    if (search) {
      filters += ` && (title match $search || shortDescription match $search || category->name match $search || tags[]->name match $search)`;
    }

    let order = `publishedAt desc`;
    if (sort === "oldest") {
      order = `publishedAt asc`;
    }

    const query = groq`{
      "posts": *[${filters}] | order(${order})[$start...$end] {
        _id,
        title,
        "slug": slug.current,
        shortDescription,
        featuredImage,
        publishedAt,
        lastUpdated,
        author {
          name,
          avatar
        },
        category-> {
          name,
          "slug": slug.current
        },
        tags[]-> {
          name,
          "slug": slug.current
        },
        readingTime,
        featured
      },
      "total": count(*[${filters}])
    }`;

    const queryParams: Record<string, any> = {
      start,
      end,
    };
    if (search) queryParams.search = `*${search}*`;
    if (category) queryParams.category = category;
    if (tag) queryParams.tag = tag;

    return await client.fetch(query, queryParams);
  } catch (error) {
    console.error("Error fetching blogs from Sanity:", error);
    return { posts: [], total: 0 };
  }
}

/**
 * Fetch a single blog by its slug.
 */
export async function getBlogBySlug(slug: string) {
  if (!isSanityConfigured) return null;
  try {
    const query = groq`*[_type == "blog" && slug.current == $slug && status == "published"][0] {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      featuredImage,
      publishedAt,
      lastUpdated,
      author {
        name,
        avatar
      },
      category-> {
        _id,
        name,
        "slug": slug.current,
        description
      },
      tags[]-> {
        name,
        "slug": slug.current
      },
      readingTime,
      featured,
      content,
      seo {
        metaTitle,
        metaDescription,
        keywords,
        openGraphImage,
        canonicalUrl
      }
    }`;
    return await client.fetch(query, { slug });
  } catch (error) {
    console.error(`Error fetching blog detail (${slug}) from Sanity:`, error);
    return null;
  }
}

/**
 * Fetch the latest featured blog post.
 */
export async function getFeaturedBlog() {
  if (!isSanityConfigured) return null;
  try {
    const query = groq`*[_type == "blog" && status == "published" && featured == true] | order(publishedAt desc)[0] {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      featuredImage,
      publishedAt,
      lastUpdated,
      author {
        name,
        avatar
      },
      category-> {
        name,
        "slug": slug.current
      },
      tags[]-> {
        name,
        "slug": slug.current
      },
      readingTime,
      featured
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching featured blog from Sanity:", error);
    return null;
  }
}

/**
 * Fetch related blogs, matching category/tags first and falling back to latest posts.
 */
export async function getRelatedBlogs(slug: string, categorySlug?: string, tagsArr: string[] = []) {
  if (!isSanityConfigured) return [];
  try {
    const query = groq`*[_type == "blog" && status == "published" && slug.current != $slug && (category->slug.current == $categorySlug || count(tags[]->slug.current[@ in $tagsArr]) > 0)] | order(publishedAt desc)[0...4] {
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      featuredImage,
      publishedAt,
      author {
        name,
        avatar
      },
      category-> {
        name,
        "slug": slug.current
      },
      readingTime
    }`;

    const related = await client.fetch(query, { slug, categorySlug, tagsArr });

    if (related.length < 4) {
      const fillCount = 4 - related.length;
      const excludeSlugs = [slug, ...related.map((r: any) => r.slug)];
      const fillQuery = groq`*[_type == "blog" && status == "published" && !(slug.current in $excludeSlugs)] | order(publishedAt desc)[0...$fillCount] {
        _id,
        title,
        "slug": slug.current,
        shortDescription,
        featuredImage,
        publishedAt,
        author {
          name,
          avatar
        },
        category-> {
          name,
          "slug": slug.current
        },
        readingTime
      }`;
      const fillBlogs = await client.fetch(fillQuery, { excludeSlugs, fillCount });
      return [...related, ...fillBlogs];
    }

    return related;
  } catch (error) {
    console.error(`Error fetching related blogs (${slug}) from Sanity:`, error);
    return [];
  }
}

/**
 * Fetch all active categories.
 */
export async function getCategories() {
  if (!isSanityConfigured) return [];
  try {
    const query = groq`*[_type == "blogCategory"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      icon
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching categories from Sanity:", error);
    return [];
  }
}

/**
 * Fetch all tags.
 */
export async function getTags() {
  if (!isSanityConfigured) return [];
  try {
    const query = groq`*[_type == "blogTag"] | order(name asc) {
      _id,
      name,
      "slug": slug.current
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching tags from Sanity:", error);
    return [];
  }
}

/**
 * Search posts by query string.
 */
export async function searchBlogs(searchTerm: string) {
  return await getBlogs({ search: searchTerm });
}
