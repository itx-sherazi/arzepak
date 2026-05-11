export const dynamic = "force-dynamic";

import SingleBlogPage from "@/components/SingelBlog/SingleBlogPage";
import { notFound } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3006/api";

async function fetchPost(slug) {
  const res = await fetch(`${API}/blog/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const j = await res.json();
  return j.success ? j.data : null;
}

async function fetchRelated(category, currentSlug) {
  try {
    const res = await fetch(`${API}/blog/all?limit=4`, { cache: "no-store" });
    const j = await res.json();
    return (j.data || []).filter(p => p.slug !== currentSlug && p.category === category).slice(0, 3);
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { slug } = await Promise.resolve(params);
  const post = await fetchPost(slug);
  if (!post) return { title: "Post Not Found | arzepak Properties" };

  const description = (post.metaDescription || post.body || "")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);

  return {
    title: `${post.metaTitle || post.title} | arzepak Properties Blog`,
    description,
    openGraph: {
      title: post.metaTitle || post.title,
      description,
      type: "article",
      siteName: "arzepak Properties",
      images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await Promise.resolve(params);
  const post = await fetchPost(slug);
  if (!post) notFound();
  const relatedPosts = await fetchRelated(post.category, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.image || "",
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: { "@type": "Organization", name: "arzepak Properties" },
    publisher: { "@type": "Organization", name: "arzepak Properties" },
    description: post.metaDescription || "",
    keywords: (post.tags || []).join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SingleBlogPage post={post} relatedPosts={relatedPosts} />
    </>
  );
}
