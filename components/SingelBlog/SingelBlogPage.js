"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  Calendar,
  Clock,
  ChevronLeft,
  Share2,
  Database,
  FileText,
  Phone,
  List,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CTASidebar from "./CTASidebar";
import { ArrowLeft } from "lucide-react";

export default function ArticleDetail({ blogDetail }) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  // Client-side structured data logic removed in favor of Server-Side implementation in page.js

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

  // Process content to add IDs to headings (useful for deep linking)
  const processedContent = useMemo(() => {
    if (!blogDetail?.body) return "";

    let content = blogDetail.body;
    let headingCount = 0;

    content = content.replace(
      /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
      (match, tag, attrs, text) => {
        const id = `heading-${headingCount++}`;
        if (attrs.includes("id=")) {
          return match;
        }
        return `<${tag} id="${id}"${attrs}>${text}</${tag}>`;
      },
    );

    return content;
  }, [blogDetail?.body]);

  const createMarkup = (html) => {
    return { __html: html };
  };

  if (!blogDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md border border-gray-200">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Article Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested article could not be loaded.
          </p>
          <Link
            href="/blog"
            className="bg-[#0356A6] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://firmographic.co/default-og.png";
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

  const imageUrl = getImageUrl(blogDetail.image);
  const wordCount = blogDetail.body
    ? blogDetail.body.replace(/<[^>]*>/g, "").split(/\s+/).length
    : 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-[#F5FAFF] flex flex-col font-sans pb-12">
      <div className="border-b border-slate-200/80 bg-white/90">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-600">
            <Link href="/" className="hover:text-[#0356A6] transition-colors">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/blog" className="hover:text-[#0356A6] transition-colors">
              Blog
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#0F1C36] font-medium truncate max-w-[min(100%,18rem)] sm:max-w-none">
              {blogDetail.title}
            </span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 w-full grow">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
          {/* Left Sidebar - Quick Actions (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 flex flex-col gap-4 items-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 writing-mode-vertical rotate-25">
                Quick Actions
              </p>

              <Link
                href="/contact"
                className="group relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0356A6] hover:border-[#0356A6] transition-all shadow-sm hover:shadow-md"
                aria-label="Get Data"
              >
                <Database className="w-4 h-4" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Get Data
                </span>
              </Link>

              <Link
                href="/contact"
                className="group relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0356A6] hover:border-[#0356A6] transition-all shadow-sm hover:shadow-md"
                aria-label="Book Demo"
              >
                <Calendar className="w-4 h-4" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Book Demo
                </span>
              </Link>

              <Link
                href="/contact"
                className="group relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-600 transition-all shadow-sm hover:shadow-md"
                aria-label="Download Sample"
              >
                <FileText className="w-4 h-4" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Get Sample
                </span>
              </Link>

              <Link
                href="/contact"
                className="group relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:border-purple-600 transition-all shadow-sm hover:shadow-md"
                aria-label="Contact Sales"
              >
                <Phone className="w-4 h-4" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Contact Sales
                </span>
              </Link>
            </div>
          </div>

          {/* Center Content - Blog Body */}
          <article className="lg:col-span-8 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200/90">
            {/* Mobile Back Button */}
            <div className="lg:hidden mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center text-gray-600 hover:text-[#0356A6] transition-colors font-medium text-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Blog
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-blue-50 text-[#0356A6] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-100">
                  {blogDetail.category || "General"}
                </span>
                <span className="text-slate-500 text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {readTime} min read
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F1C36] leading-[1.15] mb-6 tracking-tight">
                {blogDetail.title}
              </h1>

              <div className="flex items-center justify-between border-t border-b border-slate-100 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0356A6] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {blogDetail.author ? blogDetail.author.charAt(0) : "C"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F1C36]">
                      {blogDetail.author || "firmographic Team"}
                    </p>
                    <div className="flex items-center text-xs text-slate-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      <time dateTime={blogDetail.date}>
                        {formatDate(blogDetail.date)}
                      </time>
                    </div>
                  </div>
                </div>

                {/* Mobile Share */}
                <div className="flex lg:hidden gap-2">
                  <Share2 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <figure className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-sm mb-10 bg-slate-100">
              {!imageError ? (
                <Image
                  src={imageUrl}
                  alt={(blogDetail.tags && blogDetail.tags.length > 0) ? blogDetail.tags[0] : (blogDetail.title || "Article image")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-[#0356A6] flex items-center justify-center text-white/90">
                  firmographic Insights
                </div>
              )}
            </figure>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none 
              prose-headings:text-[#0F1C36] prose-headings:font-semibold prose-headings:tracking-tight
              prose-p:text-slate-700 prose-p:leading-relaxed
              prose-a:text-[#0356A6] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-li:text-gray-600 prose-li:marker:text-[#0356A6]
              prose-ol:list-decimal prose-ol:pl-6
              prose-blockquote:border-l-4 prose-blockquote:border-[#0356A6] prose-blockquote:bg-blue-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700
              prose-img:rounded-2xl prose-img:shadow-md
              prose-hr:border-gray-100 prose-hr:my-10
              prose-table:border-collapse prose-table:w-full prose-table:block prose-table:overflow-x-auto
              prose-th:bg-gray-50 prose-th:p-4 prose-th:text-left prose-th:text-gray-900 prose-th:font-semibold prose-th:border prose-th:border-gray-200
              prose-td:p-4 prose-td:border prose-td:border-gray-200 prose-td:text-gray-600
            "
            >
              <div dangerouslySetInnerHTML={createMarkup(processedContent)} />
            </div>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border border-slate-200/90 bg-[#F5FAFF] p-6">
              <h2 className="text-xl font-semibold text-[#0F1C36]">
                Need verified MSP / VAR contacts?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your ICP and filters — we’ll provide a relevant sample and
                help you shortlist the right partners.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/data-set"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0356A6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#024486]"
                >
                  Explore datasets
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-red-600"
                >
                  Get free sample
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            {blogDetail.faqs && blogDetail.faqs.length > 0 && (
              <div className="mt-16 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="grid gap-6">
                  {blogDetail.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-[#0356A6] rounded-full flex items-center justify-center font-bold text-sm">
                          Q{index + 1}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#0356A6] transition-colors">
                            {faq.question}
                          </h4>
                          <div className="prose prose-sm text-gray-600 max-w-none leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Tags */}
            {blogDetail.tags && blogDetail.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {blogDetail.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:text-[#0356A6] hover:border-blue-100 transition-all cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Right Sidebar - CTA */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="sticky top-32">
              <CTASidebar />

              {/* Popular Directories / Leads */}
              <div className="mt-6 bg-[#0F2B46] rounded-2xl shadow-lg border border-blue-900 p-6 text-white overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 opacity-10">
                  <Database className="w-32 h-32 -mr-8 -mt-8" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Get Verified Leads
                </h3>
                <p className="text-blue-200 text-xs mb-6 relative z-10">
                  Access comprehensive data lists for your sales pipeline.
                </p>

                <div className="space-y-3 relative z-10">
                  <Link
                    href="/managed-service-provider"
                    className="block p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all group backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        Managed Service Providers
                      </span>
                      <ArrowLeft className="w-4 h-4 text-blue-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-blue-500/20 text-blue-100 px-2 py-0.5 rounded border border-blue-500/30">
                        Top Rated
                      </span>
                      <span className="text-[10px] text-gray-400">
                        View Companies
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/value-added-resellers"
                    className="block p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all group backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        Value Added Resellers
                      </span>
                      <ArrowLeft className="w-4 h-4 text-blue-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-sky-500/20 text-sky-100 px-2 py-0.5 rounded border border-sky-500/30">
                        High Demand
                      </span>
                      <span className="text-[10px] text-gray-400">
                        View Companies
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/managed-security-services-provider"
                    className="block p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all group backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        MSSP Security Providers
                      </span>
                      <ArrowLeft className="w-4 h-4 text-blue-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-100 px-2 py-0.5 rounded border border-indigo-500/30">
                        Verified Data
                      </span>
                      <span className="text-[10px] text-gray-400">
                        View Companies
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
