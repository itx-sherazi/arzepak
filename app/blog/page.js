export const dynamic = "force-dynamic";

import Blog from "@/components/Blog/Blog";

export const metadata = {
  title: "Blog | Real Estate Insights — arzepak Properties",
  description: "Expert property guides, market trends, investment tips, and real estate news for Pakistan. Stay informed with arzepak Properties blog.",
  openGraph: {
    title: "Blog | arzepak Properties",
    description: "Expert property guides, market trends, and real estate news for Pakistan.",
    siteName: "arzepak Properties",
    type: "website",
  },
};

async function fetchBlogs(page = 1) {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3006/api";
  const res = await fetch(`${API}/blog/all?page=${page}&limit=12`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default async function BlogPage({ searchParams }) {
  const page = Number((await searchParams)?.page) || 1;
  let blogData = { data: [], currentPage: 1, totalPages: 1, totalPosts: 0 };
  try { blogData = await fetchBlogs(page); } catch {}

  return <Blog blogData={blogData} currentPage={page} />;
}
