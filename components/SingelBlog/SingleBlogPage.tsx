"use client";
import { Calendar, Tag, ChevronLeft, Share2, Clock, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface Post {
  _id: string; title: string; slug: string; category: string;
  image?: string; tags: string[]; body: string;
  createdAt: string; metaTitle?: string; metaDescription?: string;
}
interface RelatedPost { _id: string; title: string; slug: string; image?: string; category: string; createdAt: string; }

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
}

function readingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function SingleBlogPage({ post, relatedPosts = [] }: { post: Post; relatedPosts?: RelatedPost[] }) {
  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const mins = readingTime(post.body || "");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky breadcrumb bar */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-sm min-w-0">
            <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors flex-shrink-0">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/blog" className="text-gray-400 hover:text-green-600 transition-colors flex-shrink-0">Blog</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium truncate">{post.title}</span>
          </div>
          <button onClick={share}
            className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Cover Image — full width */}
      {post.image && (
        <div className="relative w-full h-72 sm:h-96 lg:h-[480px] bg-gray-900">
          <Image src={post.image} alt={post.title} fill
            className="object-cover opacity-90"
            sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Overlay text */}
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <span className="inline-block bg-green-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-4xl drop-shadow-sm">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-white/70 text-sm">
              <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(post.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} />{mins} min read</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left: Article ─────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Title (when no cover image) */}
            {!post.image && (
              <div className="mb-8">
                <span className="inline-block bg-green-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                  {post.category}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1.5"><Clock size={13} />{mins} min read</span>
                </div>
              </div>
            )}

            {/* Article body */}
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 sm:px-10 lg:px-12 py-10">
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-gray-600 prose-p:leading-[1.85] prose-p:text-[16px]
                    prose-a:text-green-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-800
                    prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-gray-100
                    prose-blockquote:border-l-green-500 prose-blockquote:bg-green-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
                    prose-code:text-green-700 prose-code:bg-green-50 prose-code:px-1.5 prose-code:rounded
                    prose-pre:bg-gray-900 prose-pre:rounded-2xl
                    prose-li:text-gray-600 prose-li:text-[15px]
                    prose-ul:space-y-1 prose-ol:space-y-1"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              </div>

              {/* Tags + share */}
              <div className="px-6 sm:px-10 lg:px-12 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag size={12} className="text-gray-400" />
                    {post.tags.map(tag => (
                      <span key={tag}
                        className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-colors cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <button onClick={share}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </article>

            {/* Back link */}
            <div className="mt-6">
              <Link href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                <ChevronLeft size={16} /> Back to all articles
              </Link>
            </div>
          </div>

          {/* ── Right: Sidebar ────────────────────────────── */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-5">

              {/* Article info card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen size={15} className="text-green-600" /> Article Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category</span>
                    <span className="font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-xs">{post.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Published</span>
                    <span className="font-medium text-gray-700 text-xs">{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Read time</span>
                    <span className="font-medium text-gray-700 text-xs">{mins} min</span>
                  </div>
                </div>
              </div>

              {/* Share card */}
              <div className="bg-green-600 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-base mb-1">Looking to invest?</h3>
                <p className="text-green-100 text-sm mb-4">Browse thousands of properties across Pakistan. Find your dream home today.</p>
                <Link href="/properties"
                  className="block w-full bg-white text-green-700 font-bold text-sm py-2.5 rounded-xl text-center hover:bg-green-50 transition-colors">
                  Browse Properties →
                </Link>
              </div>

              {/* Back to blog */}
              <Link href="/blog"
                className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-600 font-semibold text-sm py-2.5 rounded-xl hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-colors">
                <ChevronLeft size={15} /> All Articles
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 mt-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Related Articles</h2>
            <Link href="/blog" className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700">
              All Articles <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedPosts.map(rp => (
              <Link key={rp._id} href={`/blog/${rp.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-green-200 transition-all">
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  {rp.image
                    ? <Image src={rp.image} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width:768px) 100vw, 33vw" />
                    : <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                        <BookOpen size={24} className="text-green-300" />
                      </div>
                  }
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{rp.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-green-700 transition-colors mb-2">{rp.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={11} />{formatDate(rp.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
