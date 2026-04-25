"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Eye, Star, Building2, ChevronRight } from "lucide-react";
import { getProjectsList } from "@/services/projects";
import type { ProjectListItem } from "@/types/project";
import { formatPriceShort } from "./projectFormatting";

export default function NewProjectsListView() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    getProjectsList({ page, limit: 20 })
      .then((j) => {
        if (cancel) return;
        setProjects((j.data as ProjectListItem[]) || []);
        setTotal(j.total || 0);
        setPages(j.pages || 1);
      })
      .catch(() => {
        if (!cancel) setProjects([]);
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-base font-bold text-gray-800">
              arzepak<span className="text-green-600">Properties</span>
            </span>
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-600">New Projects</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">New Real Estate Projects</h1>
          <p className="text-green-100 text-sm">{total} projects across Pakistan — Invest in your future</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-lg font-bold text-gray-700">No projects yet</h3>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new real estate projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                key={p._id}
                href={`/new-projects/${p.slug}`}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-green-200 transition-all"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.images?.[0] || "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600"}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.isFeatured && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> FEATURED
                    </span>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      p.status === "BOOKING_OPEN"
                        ? "bg-green-600 text-white"
                        : p.status === "UNDER_CONSTRUCTION"
                          ? "bg-orange-500 text-white"
                          : p.status === "LAUNCHING_SOON"
                            ? "bg-purple-600 text-white"
                            : p.status === "COMPLETED"
                              ? "bg-blue-600 text-white"
                              : p.status === "SOLD_OUT"
                                ? "bg-red-600 text-white"
                                : "bg-gray-500 text-white"
                    }`}
                  >
                    {p.status.replace(/_/g, " ")}
                  </span>
                  {p.images?.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                      📷 {p.images.length}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-base leading-snug group-hover:text-green-700 transition-colors line-clamp-2 mb-1">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                    <MapPin size={12} className="text-green-500 flex-shrink-0" />
                    {p.address}
                  </div>

                  {p.offering?.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {p.offering.map((o) => (
                        <span key={o} className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {o}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end justify-between pt-3 border-t border-gray-50">
                    <div>
                      {p.minPrice && p.maxPrice ? (
                        <>
                          <div className="text-xs text-gray-400">Price Range</div>
                          <div className="font-bold text-green-700 text-sm">
                            PKR {formatPriceShort(p.minPrice)} – {formatPriceShort(p.maxPrice)}
                          </div>
                        </>
                      ) : p.minPrice ? (
                        <>
                          <div className="text-xs text-gray-400">Starting From</div>
                          <div className="font-bold text-green-700 text-sm">PKR {formatPriceShort(p.minPrice)}</div>
                        </>
                      ) : null}
                    </div>
                    <div className="text-right">
                      {p.developer && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 justify-end">
                          <Building2 size={11} />
                          {p.developer}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-400 justify-end mt-0.5">
                        <Eye size={11} />
                        {p.views}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500 self-center">
              Page {page} of {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
