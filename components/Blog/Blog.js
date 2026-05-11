"use client";
import React, { useState, useMemo } from "react";
import { Search, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import FAQSection from "@/components/faq-section";
import { faqs } from "@/data/faqs";

function BlogPagination({ currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-16 mb-12">
      <div className="flex items-center gap-2">
        {currentPage > 1 && (
          <Link
            href={`/blog?page=${currentPage - 1}`}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-[#0356A6] hover:text-[#0356A6] transition-all"
          >
            <ChevronLeft size={20} />
          </Link>
        )}

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <Link
              key={pageNum}
              href={`/blog?page=${pageNum}`}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all ${
                pageNum === currentPage
                  ? "bg-[#0356A6] text-white border border-[#0356A6]"
                  : "text-gray-600 border border-gray-200 hover:border-[#0356A6] hover:text-[#0356A6]"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}

        {currentPage < totalPages && (
          <Link
            href={`/blog?page=${currentPage + 1}`}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-[#0356A6] hover:text-[#0356A6] transition-all"
          >
            <ChevronRight size={20} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function BlogDetailPage({ blogData, currentPage = 1 }) {
  const mainArticles = useMemo(() => {
    if (!blogData) return [];
    if (blogData.data && Array.isArray(blogData.data)) return blogData.data;
    if (Array.isArray(blogData)) return blogData;
    if (blogData.blogs && Array.isArray(blogData.blogs)) return blogData.blogs;
    return [];
  }, [blogData]);

  const pagination = useMemo(() => {
    if (blogData?.data && Array.isArray(blogData.data)) {
      return {
        currentPage: blogData.currentPage || currentPage || 1,
        totalPages: blogData.totalPages || 1,
        totalPosts: blogData.totalPosts || 0,
      };
    }
    return {
      currentPage: currentPage || 1,
      totalPages: 1,
      totalPosts: mainArticles.length,
    };
  }, [blogData, currentPage, mainArticles.length]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!Array.isArray(mainArticles)) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mainArticles;
    return mainArticles.filter(
      (article) =>
        article.title && article.title.toLowerCase().includes(q),
    );
  }, [mainArticles, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://via.placeholder.com/800x600?text=Blog+Image";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://api.firmographic.co";
      return `${baseUrl}${imagePath}`;
    }
    if (imagePath.includes("/api/v1/uploads")) {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://api.firmographic.co";
      return `${baseUrl}${imagePath.replace("/api/v1/uploads", "/uploads")}`;
    }
    return imagePath;
  };

  return (
    <div className="bg-[#F5FAFF] min-h-screen">
      {/* Hero Section */}
      <div className="border-b mt-10 border-slate-200/80 bg-gradient-to-b from-[#e8f4fc] to-[#F5FAFF] relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Left Side: Text Content */}
            <div className="max-w-3xl text-left">
              <p className="inline-flex items-center rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0356A6]">
                firmographic blog
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0F1C36] sm:text-4xl lg:text-5xl">
                Insights for MSP, VAR, and IT channel teams
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Practical strategies, trends, and data-driven guides for managed
                service providers, value added resellers, MSSPs, and channel
                partner growth.
              </p>
            </div>

            {/* Right Side: Search Bar (Bottom Aligned) */}
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-[#0356A6]/40 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
                />
                <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: All Blogs */}
          <div className="lg:col-span-8">
            <h2 className="text-xl font-semibold text-[#0F1C36] mb-6">
              All articles
            </h2>

            {!Array.isArray(filteredArticles) ||
            filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 mb-6">
                  We couldn&apos;t find any articles matching &quot;
                  {searchQuery}&quot;.
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-6 py-2.5 bg-[#0356A6] text-white rounded-full hover:bg-[#024486] transition-colors font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article, index) => (
                  <motion.article
                    key={article._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300 border border-slate-200/90"
                  >
                    {/* Image */}
                    <Link
                      href={`/blog/${article.slug}`}
                      className="block relative h-56 overflow-hidden"
                    >
                      <Image
                        src={getImageUrl(article.image)}
                        alt={article.title || "Blog image"}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Category & Date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-[#0356A6] bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                          {article.category || "Article"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-[#0F1C36] mb-3 leading-snug group-hover:text-[#0356A6] transition-colors line-clamp-2">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title || "Untitled Article"}
                        </Link>
                      </h3>
                      <div className="flex items-center text-slate-500 text-xs mt-auto pt-4 border-t border-slate-100">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {formatDate(article.date || article.createdAt)}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            <BlogPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          </div>

          {/* Right Column: Latest Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              {/* Latest Posts Widget */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-[#0F1C36] mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <span className="bg-[#0356A6] w-2 h-2 rounded-full" />
                  Latest Insights
                </h3>

                <div className="flex flex-col gap-6">
                  {mainArticles.slice(0, 5).map((article, index) => (
                    <Link
                      key={index}
                      href={`/blog/${article.slug}`}
                      className="group flex gap-4 items-start"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={getImageUrl(article.image)}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-bold text-[#0F2B46] group-hover:text-[#0356A6] transition-colors line-clamp-2 leading-snug mb-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center text-gray-400 text-[10px]">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(article.date || article.createdAt)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter / CTA Widget */}
              <div className="bg-[#0F1C36] rounded-2xl p-6 text-white mt-8 relative overflow-hidden">
                <div className="relative z-10 w-full">
                  <h3 className="text-lg font-bold mb-2">
                    Want a curated sample?
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Tell us your ICP and filters — we’ll share a relevant sample
                    and help you shortlist the right partners.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/contact"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl text-sm text-center transition-colors"
                    >
                      Get free sample
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom CTA + FAQ */}
      <section className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200/90 bg-[#F5FAFF] p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-[#0F1C36]">
                  Need verified MSP or VAR contacts for outreach?
                </h2>
                <p className="mt-2 text-slate-600">
                  Use our directories and datasets to reach decision-makers with
                  accurate, refreshed B2B data.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/data-set"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0356A6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#024486]"
                >
                  Explore datasets
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-red-600"
                >
                  Get free sample
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection data={faqs.blog} />
    </div>
  );
}
