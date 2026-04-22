"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Eye, Phone, MessageCircle, Share2, ChevronLeft, ChevronRight, CheckCircle2, Building2, Star, Users, Maximize2, Bed, Bath, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

import { apiUrl } from "@/lib/env";

const API = apiUrl;

function formatPrice(n: number) {
  if (n >= 10000000) return `PKR ${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000)   return `PKR ${(n / 100000).toFixed(1)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
}

interface Unit { name: string; minPrice?: number; maxPrice?: number; minArea?: number; maxArea?: number; areaUnit: string; bedrooms?: number; bathrooms?: number; }
interface Update { _id: string; title: string; content: string; image?: string; date: string; }
interface NearbyItem { label: string; mapsUrl?: string; }

interface Project {
  _id: string; title: string; slug: string; city: string; address: string;
  description?: string; developer?: string; marketedBy?: string;
  minPrice?: number; maxPrice?: number; totalUnits?: number; completionDate?: string;
  offering: string[]; amenities: string[];
  features?: { mainFeatures: string[]; plotFeatures: string[]; businessComm: string[]; nearbyFacilities: string[]; otherFacilities: string[]; };
  images: string[]; floorPlans: { label: string; image: string }[];
  paymentPlan?: string; paymentPlans?: { label: string; image: string }[];
  units: Unit[]; updates: Update[];
  isFeatured: boolean; views: number; status: string;
  latitude?: number; longitude?: number;
  /** Google Maps embed (Share → Embed) or https maps link */
  mapUrl?: string;
  /** Intro paragraph for the Nearby tab (admin-editable) */
  nearbyNote?: string;
  /** Quick links for Nearby tab; if empty, default categories are used */
  nearbyItems?: NearbyItem[];
}

function isTrustedMapsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.replace(/^www\./, "");
    return (
      host === "google.com" ||
      host === "maps.google.com" ||
      host.endsWith(".google.com") ||
      host === "goo.gl" ||
      host.endsWith(".goo.gl") ||
      host === "maps.app.goo.gl"
    );
  } catch {
    return false;
  }
}

const DEFAULT_NEARBY_LABELS = ["Schools", "Hospitals", "Parks & mosques", "Shopping & markets"] as const;

function googleMapsNearbyUrl(project: Project, category: string) {
  const q = `${category} near ${project.address}, ${project.city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function nearbyItemHref(project: Project, item: NearbyItem) {
  const u = item.mapsUrl?.trim();
  if (u && isTrustedMapsUrl(u)) return u;
  return googleMapsNearbyUrl(project, item.label);
}

/** Map card: reference-style overlay → tap reveals embed or opens Maps link */
function LocationMapPanel({
  project,
  mapRevealed,
  onRevealMap,
}: {
  project: Project;
  mapRevealed: boolean;
  onRevealMap: () => void;
}) {
  const mapUrl = project.mapUrl?.trim();
  const bgImg = project.images?.[0];
  const isEmbed = Boolean(mapUrl && isTrustedMapsUrl(mapUrl) && /\/maps\/embed/i.test(mapUrl));

  if (isEmbed && mapUrl) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-200/80 min-h-[280px] sm:min-h-[320px]">
        {!mapRevealed ? (
          <>
            {bgImg && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 scale-105"
                style={{ backgroundImage: `url(${bgImg})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100/90 via-slate-200/40 to-slate-300/60" />
            <button
              type="button"
              onClick={onRevealMap}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 cursor-pointer"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-7 max-w-md text-center">
                <MapPin className="w-11 h-11 text-green-600 mx-auto mb-3" strokeWidth={2} />
                <span className="block font-bold text-gray-900 text-lg leading-snug">Tap to view society map</span>
                <span className="block text-sm text-gray-500 mt-2 leading-relaxed">
                  Find the location of this project on an interactive map
                </span>
              </div>
            </button>
          </>
        ) : (
          <iframe
            title="Project location map"
            src={mapUrl}
            className="w-full min-h-[320px] sm:min-h-[400px] border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  const linkHref =
    mapUrl && isTrustedMapsUrl(mapUrl)
      ? mapUrl
      : project.latitude != null && project.longitude != null
        ? `https://www.google.com/maps?q=${project.latitude},${project.longitude}`
        : null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-200/80 min-h-[280px] sm:min-h-[320px]">
      {bgImg && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 scale-105"
          style={{ backgroundImage: `url(${bgImg})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100/85 via-slate-200/50 to-emerald-900/10" />
      {linkHref ? (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-7 max-w-md text-center">
            <MapPin className="w-11 h-11 text-green-600 mx-auto mb-3" strokeWidth={2} />
            <span className="block font-bold text-gray-900 text-lg leading-snug">Tap to open in Google Maps</span>
            <span className="block text-sm text-gray-500 mt-2 leading-relaxed">
              View the exact location and explore the area
            </span>
          </div>
        </a>
      ) : (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-7 max-w-md text-center">
            <MapPin className="w-11 h-11 text-gray-300 mx-auto mb-3" strokeWidth={2} />
            <span className="block font-bold text-gray-800 text-lg">Map link not added</span>
            <span className="block text-sm text-gray-500 mt-2">
              Add an embed or Maps link from the admin dashboard to show the map here.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx]   = useState(0);
  const [tab, setTab]         = useState<"overview"|"units"|"features"|"updates">("overview");
  const [showAllDesc, setShowAllDesc] = useState(false);
  const [sending, setSending] = useState(false);
  const [inquiry, setInquiry] = useState({ name: user?.name || "", phone: "", email: user?.email || "" });
  const [locationTab, setLocationTab] = useState<"map" | "nearby">("map");
  const [mapRevealed, setMapRevealed] = useState(false);
  const [selectedFP, setSelectedFP] = useState(0);

  useEffect(() => {
    fetch(`${API}/projects/${slug}`)
      .then(r => r.json())
      .then(j => { if (j.success) setProject(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user) setInquiry(f => ({ ...f, name: user.name, email: user.email }));
  }, [user]);

  const sendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.phone) return toast.error("Phone number required");
    setSending(true);
    try {
      const r = await fetch(`${API}/inquiries`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inquiry, propertyId: project?._id, message: `Inquiry about project: ${project?.title}` }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message);
      toast.success("Request sent! We'll call you soon.");
      setInquiry(f => ({ ...f, phone: "" }));
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
    setSending(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">🏗️</div>
      <h2 className="text-xl font-bold text-gray-700">Project not found</h2>
      <Link href="/new-projects" className="text-green-600 hover:underline">← All Projects</Link>
    </div>
  );

  const imgs = project.images?.length ? project.images : ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800"];

  const TABS = [
    { key: "overview",   label: "Overview" },
    { key: "units",      label: "Units", hide: !project.units?.length },
    { key: "features",   label: "Features", hide: !project.amenities?.length },
    { key: "updates",    label: `Updates (${project.updates?.length || 0})`, hide: !project.updates?.length },
  ].filter(t => !t.hide);

  const FEAT_LABELS: Record<string, string> = { mainFeatures: "Main Features", plotFeatures: "Plot Features", businessComm: "Business & Communication", nearbyFacilities: "Nearby Facilities", otherFacilities: "Other Facilities" };

  const nearbyTabRows: NearbyItem[] =
    project.nearbyItems?.length
      ? project.nearbyItems
      : DEFAULT_NEARBY_LABELS.map((label) => ({ label }));
  const nearbyTabIntro =
    project.nearbyNote?.trim() ||
    "Explore schools, hospitals, parks, and markets around this project on Google Maps.";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 flex-shrink-0">
            <ChevronLeft size={16} />Back
          </button>
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <span className="font-bold text-gray-800 hidden sm:block">arzepak<span className="text-green-600">Properties</span></span>
          </Link>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <Link href="/new-projects" className="text-sm text-gray-500 hover:text-green-600 flex-shrink-0">New Projects</Link>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <span className="text-sm text-gray-700 font-medium truncate">{project.title}</span>
          <div className="flex-1" />
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex-shrink-0">
            <Share2 size={14} /><span className="hidden sm:block">Share</span>
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="relative bg-black h-72 sm:h-[420px] overflow-hidden">
        <img src={imgs[imgIdx]} alt={project.title} className="w-full h-full object-cover opacity-90" />
        {imgs.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.slice(0, 8).map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? "bg-white scale-125" : "bg-white/40"}`} />
              ))}
            </div>
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">{imgIdx + 1} / {imgs.length}</div>
          </>
        )}
        {project.isFeatured && (
          <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Star size={12} fill="currentColor" /> FEATURED
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {imgs.length > 1 && (
        <div className="bg-black/90 flex gap-2 px-4 py-2 overflow-x-auto">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setImgIdx(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-green-500" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Title card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 leading-snug">{project.title}</h1>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1.5">
                    <MapPin size={14} className="text-green-500 flex-shrink-0" />{project.address}
                  </div>
                  {project.offering?.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      <span className="text-xs text-gray-500 font-medium">Offering:</span>
                      {project.offering.map(o => (
                        <span key={o} className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">{o}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {project.minPrice && project.maxPrice ? (
                    <>
                      <div className="text-xs text-gray-400 mb-0.5">Price Range</div>
                      <div className="text-xl font-bold text-green-700">{formatPrice(project.minPrice)}</div>
                      <div className="text-sm text-gray-500">to {formatPrice(project.maxPrice)}</div>
                    </>
                  ) : project.minPrice ? (
                    <>
                      <div className="text-xs text-gray-400 mb-0.5">Starting From</div>
                      <div className="text-xl font-bold text-green-700">{formatPrice(project.minPrice)}</div>
                    </>
                  ) : null}
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1 justify-end"><Eye size={12} />{project.views} views</div>
                </div>
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-50">
                {project.developer && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                    <Building2 size={15} className="text-green-600 flex-shrink-0" />
                    <div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Developer</div><div className="text-xs font-semibold text-gray-700">{project.developer}</div></div>
                  </div>
                )}
                {project.totalUnits && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                    <Users size={15} className="text-green-600 flex-shrink-0" />
                    <div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Total Units</div><div className="text-xs font-semibold text-gray-700">{project.totalUnits}</div></div>
                  </div>
                )}
                {project.completionDate && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                    <Star size={15} className="text-green-600 flex-shrink-0" />
                    <div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Completion</div><div className="text-xs font-semibold text-gray-700">{project.completionDate}</div></div>
                  </div>
                )}
                {project.marketedBy && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                    <Star size={15} className="text-green-600 flex-shrink-0" />
                    <div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Marketed By</div><div className="text-xs font-semibold text-gray-700">{project.marketedBy}</div></div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex overflow-x-auto border-b border-gray-100">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
                    className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? "border-green-600 text-green-700 bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview */}
                {tab === "overview" && project.description && (
                  <div>
                    <div className={`text-gray-600 text-sm leading-relaxed whitespace-pre-line ${!showAllDesc ? "line-clamp-6" : ""}`}>
                      {project.description}
                    </div>
                    <button onClick={() => setShowAllDesc(!showAllDesc)}
                      className="flex items-center gap-1 text-green-600 text-sm font-semibold mt-3 hover:underline">
                      {showAllDesc ? <><ChevronUp size={15}/>Show less</> : <><ChevronDown size={15}/>Show more</>}
                    </button>
                  </div>
                )}

                {/* Units */}
                {tab === "units" && (
                  <div className="space-y-4">
                    {project.units.map((u, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-green-200 transition-colors">
                        <h3 className="font-bold text-gray-800 mb-2">{u.name}</h3>
                        {u.minPrice && u.maxPrice && (
                          <div className="text-green-700 font-semibold text-sm mb-2">
                            {formatPrice(u.minPrice)} to {formatPrice(u.maxPrice)}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {u.minArea && u.maxArea && (
                            <span className="flex items-center gap-1"><Maximize2 size={12} />Area: {u.minArea} – {u.maxArea} {u.areaUnit}</span>
                          )}
                          {u.bedrooms != null && <span className="flex items-center gap-1"><Bed size={12} />{u.bedrooms} Bedrooms</span>}
                          {u.bathrooms != null && <span className="flex items-center gap-1"><Bath size={12} />{u.bathrooms} Bathrooms</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Features */}
                {tab === "features" && (
                  <div className="space-y-5">
                    {project.amenities?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {project.amenities.map(a => (
                            <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />{a}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {project.features && Object.entries(project.features).map(([key, list]) =>
                      list?.length > 0 ? (
                        <div key={key}>
                          <h3 className="font-semibold text-gray-800 mb-3">{FEAT_LABELS[key]}</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {list.map((f: string) => (
                              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />{f}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}

                {/* Updates */}
                {tab === "updates" && (
                  <div className="space-y-5">
                    {[...project.updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(u => (
                      <div key={u._id} className="flex gap-4 pb-5 border-b border-gray-50 last:border-0">
                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 ml-1" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-400 mb-1">{formatDate(u.date)}</div>
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">{u.title}</h4>
                          {u.content && <p className="text-xs text-gray-600 leading-relaxed">{u.content}</p>}
                          {u.image && <img src={u.image} alt="" className="mt-3 rounded-xl border border-gray-100 max-w-sm w-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* Location & Nearby — society-map style */}
            {project.address && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 pt-5 pb-2">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Location & Nearby</h2>
                </div>

                {/* Tab bar + More maps */}
                <div className="flex flex-wrap items-end justify-between gap-2 px-5 border-b border-gray-100">
                  <div className="flex gap-6">
                    <button
                      type="button"
                      onClick={() => { setLocationTab("map"); setMapRevealed(false); }}
                      className={`pb-3 text-xs font-bold tracking-wide uppercase transition-colors relative ${
                        locationTab === "map" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {project.city ? `${project.city} — Map` : "Project map"}
                      {locationTab === "map" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationTab("nearby")}
                      className={`pb-3 text-xs font-bold tracking-wide uppercase transition-colors relative ${
                        locationTab === "nearby" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Nearby
                      {locationTab === "nearby" && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                      )}
                    </button>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.city} Pakistan`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pb-3 text-xs font-semibold text-green-600 hover:text-green-700 whitespace-nowrap"
                  >
                    More {project.city} maps →
                  </a>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-600 mb-4 flex items-start gap-2">
                    <MapPin size={16} className="text-green-600 shrink-0 mt-0.5" />
                    <span>{project.address}</span>
                  </p>

                  {locationTab === "map" && (
                    <LocationMapPanel
                      project={project}
                      mapRevealed={mapRevealed}
                      onRevealMap={() => setMapRevealed(true)}
                    />
                  )}

                  {locationTab === "nearby" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{nearbyTabIntro}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {nearbyTabRows.map((item, idx) => (
                          <a
                            key={`${item.label}-${idx}`}
                            href={nearbyItemHref(project, item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm font-medium text-gray-800 hover:border-green-200 hover:bg-green-50/60 transition-colors"
                          >
                            <span>{item.label}</span>
                            <span className="text-green-600 text-xs font-semibold">Open map</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Floor Plans — standalone section ── */}
            {project.floorPlans?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Floor Plans</h2>
                </div>

                <div className="flex min-h-[340px]">
                  {/* Left: scrollable tab list */}
                  <div className="w-56 flex-shrink-0 border-r border-gray-100 overflow-y-auto max-h-[520px]">
                    {project.floorPlans.map((fp, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFP(i)}
                        className={`w-full flex items-center gap-3 px-4 py-4 text-left border-b border-gray-50 transition-colors relative ${
                          selectedFP === i ? "bg-green-50/70 text-green-700" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {selectedFP === i && (
                          <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-600 rounded-r-full" />
                        )}
                        {/* Blueprint icon */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                          className={`w-5 h-5 flex-shrink-0 ${selectedFP === i ? "text-green-600" : "text-gray-400"}`}>
                          <rect x="3" y="3" width="18" height="18" rx="1.5" />
                          <path d="M3 9h18M9 9v12M3 15h6" />
                        </svg>
                        <span className="flex-1 text-xs font-semibold leading-snug line-clamp-2">
                          {fp.label || `Floor Plan ${i + 1}`}
                        </span>
                        <ChevronRight size={14} className={`flex-shrink-0 flex-none ${selectedFP === i ? "text-green-500" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>

                  {/* Right: image viewer */}
                  <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/40 min-h-[340px]">
                    {project.floorPlans[selectedFP]?.image ? (
                      <img
                        key={selectedFP}
                        src={project.floorPlans[selectedFP].image}
                        alt={project.floorPlans[selectedFP].label || `Floor Plan ${selectedFP + 1}`}
                        className="max-w-full max-h-[480px] w-auto object-contain rounded-2xl border border-gray-200 shadow-sm bg-white"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-gray-300 py-12">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-14 h-14">
                          <rect x="3" y="3" width="18" height="18" rx="1.5" /><path d="M3 9h18M9 9v12M3 15h6" />
                        </svg>
                        <span className="text-sm text-gray-400">No image uploaded for this floor plan</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* ── Payment Plans — standalone horizontal carousel ── */}
            {(project.paymentPlans?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Payment Plans</h2>
                </div>
                <div className="px-6 py-5">
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {project.paymentPlans!.map((pp, i) => (
                      <div key={i} className="flex-shrink-0 w-64 sm:w-72 rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-gray-50/60 hover:shadow-md transition-shadow">
                        {pp.image ? (
                          <img src={pp.image} alt={pp.label || `Payment Plan ${i + 1}`}
                            className="w-full aspect-[4/3] object-cover" />
                        ) : (
                          <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 text-gray-300">
                              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>
                            </svg>
                          </div>
                        )}
                        {pp.label && (
                          <div className="px-4 py-3 text-center">
                            <span className="text-sm font-semibold text-gray-800">{pp.label}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-80 xl:w-96 space-y-4 flex-shrink-0">
            {/* Call / WhatsApp */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Request a Call</h3>
              <form onSubmit={sendInquiry} className="space-y-3">
                <input required type="text" placeholder="Your Name *" value={inquiry.name}
                  onChange={e => setInquiry(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <div className="flex gap-2">
                  <span className="flex items-center justify-center border border-gray-200 rounded-xl px-3 text-sm text-gray-500 bg-gray-50">🇵🇰 +92</span>
                  <input required type="tel" placeholder="Phone Number *" value={inquiry.phone}
                    onChange={e => setInquiry(f => ({ ...f, phone: e.target.value }))}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <input type="email" placeholder="Email (Optional)" value={inquiry.email}
                  onChange={e => setInquiry(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <button type="submit" disabled={sending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-60 transition-colors">
                  {sending ? "Sending..." : "Request Call"}
                </button>
                <div className="relative flex items-center gap-2 my-1">
                  <div className="flex-1 h-px bg-gray-100"/><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-100"/>
                </div>
                <div className="flex gap-2">
                  <a href={`https://wa.me/923001234567`} target="_blank" rel="noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors">
                    <MessageCircle size={15} />WhatsApp
                  </a>
                  <a href="tel:+923001234567"
                    className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
                    <Phone size={15} />Call Now
                  </a>
                </div>
                <p className="text-[10px] text-gray-400 text-center">By submitting this form, you agree to our Terms of Use.</p>
              </form>
            </div>

            {/* Project Summary */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Project Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">City</span><span className="font-medium text-gray-700">{project.city}</span></div>
                {project.developer && <div className="flex justify-between"><span className="text-gray-500">Developer</span><span className="font-medium text-gray-700">{project.developer}</span></div>}
                {project.totalUnits && <div className="flex justify-between"><span className="text-gray-500">Total Units</span><span className="font-medium text-gray-700">{project.totalUnits}</span></div>}
                {project.completionDate && <div className="flex justify-between"><span className="text-gray-500">Completion</span><span className="font-medium text-gray-700">{project.completionDate}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Status</span>
                  <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${project.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{project.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
