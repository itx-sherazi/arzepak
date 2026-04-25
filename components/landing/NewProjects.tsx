"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getProjectsPreview } from "@/services/projects";
import type { ProjectCardPreview } from "@/types/project";

function statusStyle(s: string) {
  switch (s) {
    case "BOOKING_OPEN":      return { label: "Booking Open",       cls: "bg-green-600" };
    case "UNDER_CONSTRUCTION":return { label: "Under Construction", cls: "bg-orange-500" };
    case "COMPLETED":         return { label: "Completed",          cls: "bg-blue-600" };
    case "LAUNCHING_SOON":    return { label: "Launching Soon",     cls: "bg-purple-600" };
    default:                  return { label: s,                    cls: "bg-gray-500" };
  }
}

function minPrice(units: ProjectCardPreview["units"]) {
  if (!units?.length) return null;
  const min = Math.min(...units.map(u => u.minPrice).filter(Boolean));
  if (!min || !isFinite(min)) return null;
  if (min >= 10000000) return `PKR ${(min / 10000000).toFixed(1)} Cr`;
  if (min >= 100000)   return `PKR ${(min / 100000).toFixed(0)} Lac`;
  return `PKR ${min.toLocaleString()}`;
}

export default function NewProjects() {
  const [projects, setProjects] = useState<ProjectCardPreview[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancel = false;
    getProjectsPreview({ limit: 3, sort: "-createdAt" })
      .then((j) => {
        if (!cancel) setProjects((j.data as ProjectCardPreview[]) || []);
      })
      .catch(() => { if (!cancel) setProjects([]); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, []);

  const skeletons = [1, 2, 3];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">New Projects</h2>
            <p className="text-gray-500 mt-1 text-sm">Latest real estate developments in Pakistan</p>
          </div>
          <Link href="/new-projects" className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1">
            All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? skeletons.map(i => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-10 bg-gray-100 rounded mt-4" />
                  </div>
                </div>
              ))
            : projects.length === 0
            ? (
                <div className="col-span-3 text-center py-16 text-gray-400">
                  <div className="text-4xl mb-3">🏗️</div>
                  <p className="text-sm">No projects yet. Add some from the admin dashboard.</p>
                </div>
              )
            : projects.map(p => {
                const { label, cls } = statusStyle(p.status);
                const price = minPrice(p.units);
                const img   = p.images?.[0] || "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80";

                return (
                  <Link key={p._id} href={`/new-projects/${p.slug}`}
                    className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group block">
                    <div className="relative h-52 overflow-hidden">
                      <img src={img} alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <span className={`absolute top-3 left-3 ${cls} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                        {label}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{p.title}</h3>
                      {p.developer && <p className="text-gray-500 text-sm mb-1">by {p.developer}</p>}
                      <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                        <MapPin size={14} className="text-green-500 flex-shrink-0" />
                        {p.city}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          {price ? (
                            <>
                              <div className="text-xs text-gray-400">Starting from</div>
                              <div className="text-green-600 font-bold text-base">{price}</div>
                            </>
                          ) : (
                            <div className="text-green-600 font-bold text-base">Contact for Price</div>
                          )}
                        </div>
                        <span className="bg-green-50 hover:bg-green-600 hover:text-white text-green-700 text-sm font-semibold px-4 py-2 rounded-xl transition-all border border-green-200 hover:border-green-600">
                          Details
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
