"use client";
import { useState, useMemo } from "react";
import { Search, Calendar, ChevronRight, ChevronLeft, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Post {
  _id: string; title: string; slug: string; category: string;
  image?: string; tags: string[]; createdAt: string;
}

interface BlogData {
  data: Post[]; currentPage: number; totalPages: number; totalPosts: number;
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center mt-12 gap-2">
      {currentPage > 1 && (
        <Link href={`/blog?page=${currentPage - 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors">
          <ChevronLeft size={18} />
        </Link>
      )}
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        let p = i + 1;
        if (totalPages > 5) {
          if (currentPage <= 3) p = i + 1;
          else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
          else p = currentPage - 2 + i;
        }
        return (
          <Link key={p} href={`/blog?page=${p}`}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-colors ${p === currentPage ? "bg-green-600 text-white" : "border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600"}`}>
            {p}
          </Link>
        );
      })}
      {currentPage < totalPages && (
        <Link href={`/blog?page=${currentPage + 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors">
          <ChevronRight size={18} />
        </Link>
      )}
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog({ blogData, currentPage = 1 }: { blogData: BlogData; currentPage?: number }) {
  const posts = useMemo(() => blogData?.data || [], [blogData]);
  const pagination = { currentPage: blogData?.currentPage || currentPage, totalPages: blogData?.totalPages || 1 };
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [posts, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
                arzepak Properties Blog
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Real Estate Insights & Property Guides
              </h1>
              <p className="mt-3 text-gray-500 text-base leading-relaxed">
                Expert advice on buying, selling, renting, and investing in Pakistan&apos;s property market.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No articles found</h3>
            <p className="text-gray-400 mb-5">Nothing matching &quot;{search}&quot;</p>
            <button onClick={() => setSearch("")}
              className="px-5 py-2.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700">
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <Link key={article._id || i} href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 flex flex-col">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    {article.image
                      ? <Image src={article.image} alt={article.title} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw" />
                      : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={1.5} className="w-12 h-12 opacity-40">
                            <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" /><path d="M9 21V12h6v9" />
                          </svg>
                        </div>
                    }
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-base font-bold text-gray-900 leading-snug group-hover:text-green-700 transition-colors line-clamp-2 mb-3">
                      {article.title}
                    </h2>

                    {article.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {article.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                            <Tag size={8} />{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                      <Calendar size={12} />
                      {formatDate(article.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          </>
        )}
      </main>
    </div>
  );
}
