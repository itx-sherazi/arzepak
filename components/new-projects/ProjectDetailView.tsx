"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, Share2, ChevronLeft, ChevronRight, CheckCircle2, Building2, Star, Users, Maximize2, Bed, Bath, ChevronDown, ChevronUp, X, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { getProjectBySlug } from "@/services/projects";
import { postInquiry } from "@/services/inquiries";
import type { NearbyItem, ProjectDetail } from "@/types/project";
import { formatPriceFull, formatProjectDate } from "./projectFormatting";
import { DEFAULT_NEARBY_LABELS, FEATURE_LABELS, nearbyItemHref } from "./locationUtils";
import LocationMapPanel from "./LocationMapPanel";

/* ── Lightbox ─────────────────────────────────────────────── */
function Lightbox({ imgs, startIdx, onClose }: { imgs: string[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);

  const prev = useCallback(() => setIdx(i => (i - 1 + imgs.length) % imgs.length), [imgs.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % imgs.length), [imgs.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col" onClick={onClose}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <span className="text-white/70 text-sm font-medium">{idx + 1} / {imgs.length}</span>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Main image */}
      <div className="flex-1 flex items-center justify-center relative px-14 overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-10">
          <ChevronLeft size={22} />
        </button>
        <img
          key={idx}
          src={imgs[idx]}
          alt=""
          className="max-h-full max-w-full object-contain select-none"
          draggable={false}
        />
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-10">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex-shrink-0 pb-4 pt-3 px-4 overflow-x-auto" onClick={e => e.stopPropagation()}>
        <div className="flex gap-2 justify-center min-w-max mx-auto">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-white opacity-100" : "border-transparent opacity-40 hover:opacity-70"}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Gallery (Zameen.com style) ────────────────────────────── */
function Gallery({ imgs, featured, onOpen }: { imgs: string[]; featured: boolean; onOpen: (i: number) => void }) {
  const shown = imgs.slice(0, 4);
  const right = shown.slice(1, 4);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      <div className="flex gap-1 h-72 sm:h-[440px] bg-black overflow-hidden">
        {/* Main image */}
        <div className="flex-1 min-w-0 cursor-pointer relative overflow-hidden" onClick={() => onOpen(0)}>
          <img src={shown[0]} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
          {featured && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
              <Star size={11} fill="currentColor" /> FEATURED
            </span>
          )}
        </div>

        {/* Right column — up to 3 thumbnails */}
        {right.length > 0 && (
          <div className="flex flex-col gap-1 w-[30%] flex-shrink-0">
            {right.map((img, i) => {
              const isLast = i === right.length - 1 && imgs.length > 4;
              return (
                <div key={i} className="flex-1 relative cursor-pointer overflow-hidden" onClick={() => onOpen(i + 1)}>
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
                  {isLast && imgs.length > 4 && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">+{imgs.length - 4} more</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Photo count button */}
      <button onClick={() => onOpen(0)}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors">
        <Camera size={13} />
        {imgs.length} Photos
      </button>
    </div>
  );
}

/* ── Project header (below gallery) ───────────────────────── */
function ProjectHeader({ project }: { project: ProjectDetail }) {
  const hasPrice = project.minPrice || project.maxPrice;
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: logo + name + address */}
          <div className="flex items-start gap-3 min-w-0">
            {project.logo && (
              <img src={project.logo} alt={project.title}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-gray-200 object-contain bg-white flex-shrink-0 shadow-sm p-1" />
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{project.title}</h1>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                <MapPin size={13} className="text-green-500 flex-shrink-0" />
                <span className="truncate">{project.address}{project.city ? `, ${project.city}` : ""}</span>
              </div>
              {project.offering?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mt-1.5">
                  {project.offering.map(o => (
                    <span key={o} className="text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">{o}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: price */}
          {hasPrice && (
            <div className="flex-shrink-0 text-right">
              <div className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Price Range</div>
              <div className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                {project.minPrice && project.maxPrice
                  ? <>{formatPriceFull(project.minPrice)} <span className="text-gray-400 font-semibold text-base">to</span> {formatPriceFull(project.maxPrice)}</>
                  : formatPriceFull(project.minPrice ?? project.maxPrice ?? 0)
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */
export default function ProjectDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [tab, setTab] = useState<"overview" | "units" | "features" | "updates">("overview");
  const [showAllDesc, setShowAllDesc] = useState(false);
  const [sending, setSending] = useState(false);
  const [inquiry, setInquiry] = useState({ name: user?.name || "", phone: "", email: user?.email || "" });
  const [locationTab, setLocationTab] = useState<"map" | "nearby">("map");
  const [mapRevealed, setMapRevealed] = useState(false);
  const [selectedFP, setSelectedFP] = useState(0);
  const [fpLightbox, setFpLightbox] = useState(false);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    getProjectBySlug(String(slug))
      .then(j => { if (!cancel) { if (j.success) setProject(j.data); else setProject(null); } })
      .catch(() => { if (!cancel) setProject(null); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [slug]);

  useEffect(() => {
    if (user) setInquiry(f => ({ ...f, name: user.name, email: user.email }));
  }, [user]);

  const sendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.phone) return toast.error("Phone number required");
    setSending(true);
    try {
      await postInquiry({ ...inquiry, propertyId: project?._id, message: `Inquiry about project: ${project?.title}` });
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
    { key: "overview", label: "Overview" },
    { key: "units", label: "Units", hide: !project.units?.length },
    { key: "features", label: "Features", hide: !project.amenities?.length },
    { key: "updates", label: `Updates (${project.updates?.length || 0})`, hide: !project.updates?.length },
  ].filter(t => !t.hide);

  const nearbyTabRows: NearbyItem[] =
    project.nearbyItems?.length ? project.nearbyItems : DEFAULT_NEARBY_LABELS.map(label => ({ label }));
  const nearbyTabIntro = project.nearbyNote?.trim() || "Explore schools, hospitals, parks, and markets around this project on Google Maps.";

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox imgs={imgs} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}

      {/* Breadcrumbs + Share */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
            <Link href="/new-projects" className="text-gray-400 hover:text-green-600 transition-colors">New Projects</Link>
            <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
            {project.city && <>
              <span className="text-gray-400">{project.city}</span>
              <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
            </>}
            <span className="text-gray-700 font-semibold truncate max-w-[160px] sm:max-w-xs">{project.title}</span>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex-shrink-0 transition-colors">
            <Share2 size={14} /><span className="hidden sm:block">Share</span>
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-0">
        <Gallery imgs={imgs} featured={project.isFeatured} onOpen={i => setLightboxIdx(i)} />
      </div>

      {/* Project header (logo + name + price) */}
      <ProjectHeader project={project} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left content */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Meta chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.developer && (
                <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <Building2 size={15} className="text-green-600 flex-shrink-0" />
                  <div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Developer</div><div className="text-xs font-semibold text-gray-700">{project.developer}</div></div>
                </div>
              )}
              {project.totalUnits && (
                <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <Users size={15} className="text-green-600 flex-shrink-0" />
                  <div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Total Units</div><div className="text-xs font-semibold text-gray-700">{project.totalUnits}</div></div>
                </div>
              )}
              {project.completionDate && (
                <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <Star size={15} className="text-green-600 flex-shrink-0" />
                  <div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Completion</div><div className="text-xs font-semibold text-gray-700">{project.completionDate}</div></div>
                </div>
              )}
              {project.marketedBy && (
                <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <Star size={15} className="text-green-600 flex-shrink-0" />
                  <div><div className="text-[10px] text-gray-400 uppercase tracking-wide">Marketed By</div><div className="text-xs font-semibold text-gray-700">{project.marketedBy}</div></div>
                </div>
              )}
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
                {tab === "overview" && project.description && (
                  <div>
                    <div className={`text-gray-600 text-sm leading-relaxed whitespace-pre-line ${!showAllDesc ? "line-clamp-6" : ""}`}>
                      {project.description}
                    </div>
                    <button onClick={() => setShowAllDesc(!showAllDesc)}
                      className="flex items-center gap-1 text-green-600 text-sm font-semibold mt-3 hover:underline">
                      {showAllDesc ? <><ChevronUp size={15} />Show less</> : <><ChevronDown size={15} />Show more</>}
                    </button>
                  </div>
                )}

                {tab === "units" && (
                  <div className="space-y-4">
                    {(project.units ?? []).map((u, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4 hover:border-green-200 transition-colors">
                        <h3 className="font-bold text-gray-800 mb-2">{u.name}</h3>
                        {u.minPrice && u.maxPrice && (
                          <div className="text-green-700 font-semibold text-sm mb-2">
                            {formatPriceFull(u.minPrice)} to {formatPriceFull(u.maxPrice)}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {u.minArea && u.maxArea && <span className="flex items-center gap-1"><Maximize2 size={12} />Area: {u.minArea} – {u.maxArea} {u.areaUnit}</span>}
                          {u.bedrooms != null && <span className="flex items-center gap-1"><Bed size={12} />{u.bedrooms} Bedrooms</span>}
                          {u.bathrooms != null && <span className="flex items-center gap-1"><Bath size={12} />{u.bathrooms} Bathrooms</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tab === "features" && (
                  <div className="space-y-5">
                    {(project.amenities?.length ?? 0) > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {(project.amenities ?? []).map(a => (
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
                          <h3 className="font-semibold text-gray-800 mb-3">{FEATURE_LABELS[key]}</h3>
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

                {tab === "updates" && (
                  <div className="space-y-5">
                    {[...(project.updates ?? [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(u => (
                      <div key={u._id} className="flex gap-4 pb-5 border-b border-gray-50 last:border-0">
                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 ml-1" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-400 mb-1">{formatProjectDate(u.date)}</div>
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

            {/* Location & Nearby */}
            {project.address && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 pt-5 pb-2">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Location & Nearby</h2>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-2 px-5 border-b border-gray-100">
                  <div className="flex gap-6">
                    {["map", "nearby"].map(t => (
                      <button key={t} type="button" onClick={() => { setLocationTab(t as "map" | "nearby"); if (t === "map") setMapRevealed(false); }}
                        className={`pb-3 text-xs font-bold tracking-wide uppercase transition-colors relative ${locationTab === t ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
                        {t === "map" ? (project.city ? `${project.city} — Map` : "Project map") : "Nearby"}
                        {locationTab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />}
                      </button>
                    ))}
                  </div>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.city} Pakistan`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="pb-3 text-xs font-semibold text-green-600 hover:text-green-700 whitespace-nowrap">
                    More {project.city} maps →
                  </a>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 mb-4 flex items-start gap-2">
                    <MapPin size={16} className="text-green-600 shrink-0 mt-0.5" /><span>{project.address}</span>
                  </p>
                  {locationTab === "map" && (
                    <LocationMapPanel project={project} mapRevealed={mapRevealed} onRevealMap={() => setMapRevealed(true)} />
                  )}
                  {locationTab === "nearby" && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{nearbyTabIntro}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {nearbyTabRows.map((item, idx) => (
                          <a key={`${item.label}-${idx}`} href={nearbyItemHref(project, item)} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm font-medium text-gray-800 hover:border-green-200 hover:bg-green-50/60 transition-colors">
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

            {/* Floor Plan Lightbox */}
            {fpLightbox && project.floorPlans[selectedFP]?.image && (
              <Lightbox
                imgs={project.floorPlans.filter(fp => fp.image).map(fp => fp.image)}
                startIdx={project.floorPlans.filter(fp => fp.image).findIndex((_, i) => i === selectedFP) ?? 0}
                onClose={() => setFpLightbox(false)}
              />
            )}

            {/* Floor Plans */}
            {project.floorPlans?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Floor Plans</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{project.floorPlans.length} plan{project.floorPlans.length > 1 ? "s" : ""} available</p>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                    {project.floorPlans[selectedFP]?.label || `Plan ${selectedFP + 1}`}
                  </span>
                </div>

                {/* Mobile: horizontal scrollable tab chips */}
                <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-50 sm:hidden">
                  {project.floorPlans.map((fp, i) => (
                    <button key={i} type="button" onClick={() => setSelectedFP(i)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                        selectedFP === i
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
                      }`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 flex-shrink-0">
                        <rect x="3" y="3" width="18" height="18" rx="1.5" /><path d="M3 9h18M9 9v12M3 15h6" />
                      </svg>
                      {fp.label || `Plan ${i + 1}`}
                    </button>
                  ))}
                </div>

                {/* Desktop: side-by-side | Mobile: image full width */}
                <div className="flex flex-col sm:flex-row min-h-[340px] sm:min-h-[420px]">
                  {/* Left tab list — desktop only */}
                  <div className="hidden sm:block w-72 flex-shrink-0 border-r border-gray-100 overflow-y-auto max-h-[580px]">
                    {project.floorPlans.map((fp, i) => (
                      <button key={i} onClick={() => setSelectedFP(i)}
                        className={`w-full flex items-center gap-3 px-5 py-4 text-left border-b border-gray-50 transition-all relative ${
                          selectedFP === i ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                        }`}>
                        {selectedFP === i && <span className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full" />}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedFP === i ? "bg-green-100" : "bg-gray-100"}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                            className={`w-5 h-5 ${selectedFP === i ? "text-green-600" : "text-gray-400"}`}>
                            <rect x="3" y="3" width="18" height="18" rx="1.5" /><path d="M3 9h18M9 9v12M3 15h6" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold leading-snug line-clamp-1">{fp.label || `Floor Plan ${i + 1}`}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">Tap to view</div>
                        </div>
                        <ChevronRight size={15} className={`flex-shrink-0 ${selectedFP === i ? "text-green-500" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>

                  {/* Image viewer */}
                  <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/60 relative min-h-[320px] sm:min-h-[480px]">
                    {project.floorPlans[selectedFP]?.image ? (
                      <>
                        <div className="relative group cursor-zoom-in w-full h-full absolute inset-0" onClick={() => setFpLightbox(true)}>
                          <img key={selectedFP}
                            src={project.floorPlans[selectedFP].image}
                            alt={project.floorPlans[selectedFP].label || `Floor Plan ${selectedFP + 1}`}
                            className="w-full h-full object-contain bg-white transition-transform duration-200 group-hover:scale-[1.01]" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                            <span className="bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                              <Camera size={12} /> Tap to expand
                            </span>
                          </div>
                          {project.floorPlans[selectedFP].label && (
                            <div className="absolute bottom-10 left-0 right-0 text-center">
                              <span className="bg-black/40 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">{project.floorPlans[selectedFP].label}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-gray-300 py-12">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-14 h-14">
                          <rect x="3" y="3" width="18" height="18" rx="1.5" /><path d="M3 9h18M9 9v12M3 15h6" />
                        </svg>
                        <span className="text-sm text-gray-400">No image for this floor plan</span>
                      </div>
                    )}

                    {/* Prev / Next */}
                    {project.floorPlans.length > 1 && (
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <button type="button"
                          onClick={() => setSelectedFP(i => (i - 1 + project.floorPlans.length) % project.floorPlans.length)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors shadow-sm">
                          <ChevronLeft size={16} />
                        </button>
                        <button type="button"
                          onClick={() => setSelectedFP(i => (i + 1) % project.floorPlans.length)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors shadow-sm">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Plans */}
            {(project.paymentPlans?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Payment Plans</h2>
                </div>
                <div className="px-6 py-5">
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {project.paymentPlans!.map((pp, i) => (
                      <div key={i} className="flex-shrink-0 w-64 sm:w-72 rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-gray-50/60 hover:shadow-md transition-shadow">
                        {pp.image
                          ? <img src={pp.image} alt={pp.label || `Payment Plan ${i + 1}`} className="w-full aspect-[4/3] object-cover" />
                          : <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-12 h-12 text-gray-300">
                                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>
                              </svg>
                            </div>
                        }
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Request a Call</h3>
              <form onSubmit={sendInquiry} className="space-y-3">
                <input required type="text" placeholder="Your Name *" value={inquiry.name}
                  onChange={e => setInquiry(f => ({ ...f, name: e.target.value }))} className={inp} />
                <div className="flex gap-2">
                  <span className="flex items-center justify-center border border-gray-200 rounded-xl px-3 text-sm text-gray-500 bg-gray-50">🇵🇰 +92</span>
                  <input required type="tel" placeholder="Phone Number *" value={inquiry.phone}
                    onChange={e => setInquiry(f => ({ ...f, phone: e.target.value }))} className={`flex-1 ${inp}`} />
                </div>
                <input type="email" placeholder="Email (Optional)" value={inquiry.email}
                  onChange={e => setInquiry(f => ({ ...f, email: e.target.value }))} className={inp} />
                <button type="submit" disabled={sending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-60 transition-colors">
                  {sending ? "Sending..." : "Request Call"}
                </button>
                <div className="relative flex items-center gap-2 my-1">
                  <div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="flex gap-2">
                  <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer"
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

            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Project Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">City</span><span className="font-medium text-gray-700">{project.city}</span></div>
                {project.developer && <div className="flex justify-between"><span className="text-gray-500">Developer</span><span className="font-medium text-gray-700">{project.developer}</span></div>}
                {project.totalUnits && <div className="flex justify-between"><span className="text-gray-500">Total Units</span><span className="font-medium text-gray-700">{project.totalUnits}</span></div>}
                {project.completionDate && <div className="flex justify-between"><span className="text-gray-500">Completion</span><span className="font-medium text-gray-700">{project.completionDate}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Status</span>
                  <span className="font-semibold text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{project.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
