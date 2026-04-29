"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize2, Phone, MessageCircle, Share2,
  ChevronLeft, ChevronRight, CheckCircle2, Building2, Calendar,
  Layers, X, Camera, Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { fetchPropertyBySlug } from "@/services/properties";
import { postInquiry } from "@/services/inquiries";
import type { PropertyDetail } from "@/types/property";
import { formatPriceDetail } from "./propertyFormatting";

/* ── helpers ─────────────────────────────────── */
function extractYtId(url: string): string | null {
  const m = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function formatPKR(n: number) {
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(2)} Crore`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(1)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

/* ── Lightbox ─────────────────────────────────── */
function Lightbox({ imgs, ytVideos, startIdx, onClose }: { imgs: string[]; ytVideos: string[]; startIdx: number; onClose: () => void }) {
  const [tab, setTab]   = useState<"images" | "videos">("images");
  const [idx, setIdx]   = useState(startIdx);
  const prev = useCallback(() => setIdx(i => (i - 1 + imgs.length) % imgs.length), [imgs.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % imgs.length), [imgs.length]);

  useEffect(() => {
    if (tab !== "images") return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [tab, prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        {/* Tabs */}
        <div className="flex gap-1">
          <button type="button" onClick={() => setTab("images")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${tab === "images" ? "bg-white text-gray-900" : "text-white/60 hover:text-white"}`}>
            <Camera size={13} /> Images ({imgs.length})
          </button>
          {ytVideos.length > 0 && (
            <button type="button" onClick={() => setTab("videos")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${tab === "videos" ? "bg-white text-gray-900" : "text-white/60 hover:text-white"}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-500"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
              Videos ({ytVideos.length})
            </button>
          )}
        </div>
        {tab === "images" && <span className="text-white/50 text-sm">{idx + 1} / {imgs.length}</span>}
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
          <X size={20} />
        </button>
      </div>

      {/* Images view */}
      {tab === "images" && (
        <>
          <div className="flex-1 flex items-center justify-center relative px-14 overflow-hidden" onClick={onClose}>
            <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center z-10">
              <ChevronLeft size={22} />
            </button>
            <img key={idx} src={imgs[idx]} alt="" className="max-h-full max-w-full object-contain select-none" draggable={false} onClick={e => e.stopPropagation()} />
            <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center z-10">
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="flex-shrink-0 pb-4 pt-3 px-4 overflow-x-auto">
            <div className="flex gap-2 justify-center min-w-max mx-auto">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-white opacity-100" : "border-transparent opacity-40 hover:opacity-70"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Videos view */}
      {tab === "videos" && (
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
          {ytVideos.map((id, i) => (
            <div key={i} className="rounded-xl overflow-hidden aspect-video max-w-4xl mx-auto">
              <iframe src={`https://www.youtube.com/embed/${id}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen title={`Video ${i + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Gallery ──────────────────────────────────── */
function Gallery({ imgs, featured, purpose, onOpen, ytCount = 0 }: { imgs: string[]; featured: boolean; purpose: string; onOpen: (i: number) => void; ytCount?: number }) {
  const shown = imgs.slice(0, 4);
  const right = shown.slice(1, 4);
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      <div className="flex gap-1 h-72 sm:h-[420px] bg-black overflow-hidden">
        <div className="flex-1 min-w-0 cursor-pointer relative overflow-hidden" onClick={() => onOpen(0)}>
          <img src={shown[0]} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
          {featured && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 z-10">
              <Star size={11} fill="currentColor" /> FEATURED
            </span>
          )}
          <span className={`absolute top-3 ${featured ? "left-28" : "left-3"} text-xs font-bold px-3 py-1 rounded-full z-10 ${purpose === "SALE" ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}>
            {purpose === "SALE" ? "FOR SALE" : "FOR RENT"}
          </span>
        </div>
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
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {ytCount > 0 && (
          <button onClick={() => onOpen(0)} className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            {ytCount}
          </button>
        )}
        <button onClick={() => onOpen(0)} className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm">
          <Camera size={13} /> {imgs.length}
        </button>
      </div>
    </div>
  );
}


/* ── Main ─────────────────────────────────────── */
export default function PropertyDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading]   = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [sending, setSending]   = useState(false);
  const [inquiry, setInquiry]   = useState({ name: user?.name || "", email: user?.email || "", phone: "", message: "" });

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetchPropertyBySlug(String(slug))
      .then(j => { if (!cancel) { if (j.success) setProperty(j.data); else setProperty(null); } })
      .catch(() => { if (!cancel) setProperty(null); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [slug]);

  useEffect(() => {
    if (user) setInquiry(f => ({ ...f, name: user.name, email: user.email }));
  }, [user]);

  const sendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.phone) return toast.error("Phone number is required");
    setSending(true);
    try {
      await postInquiry({ ...inquiry, propertyId: property?._id });
      toast.success("Inquiry sent!");
      setInquiry(f => ({ ...f, phone: "", message: "" }));
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
    setSending(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!property) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">🏠</div>
      <h2 className="text-xl font-bold text-gray-700">Property not found</h2>
      <Link href="/properties" className="text-green-600 hover:underline">← Back to listings</Link>
    </div>
  );

  const imgs = (property.images || []).map(img => typeof img === "string" ? img : img?.url).filter(Boolean) as string[];
  const gallery = imgs.length ? imgs : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"];
  const dealer = property.dealerId;

  // All youtube video ids
  const allVideoUrls = [...(property.videoUrls || []), ...(property.videoUrl ? [property.videoUrl] : [])];
  const ytVideos = allVideoUrls.map(u => extractYtId(u)).filter(Boolean) as string[];

  const specs = [
    property.area      && { icon: Maximize2, label: "Area",       value: `${property.area} ${property.areaUnit}` },
    property.bedrooms  && { icon: Bed,        label: "Bedrooms",   value: String(property.bedrooms) },
    property.bathrooms && { icon: Bath,       label: "Bathrooms",  value: String(property.bathrooms) },
    property.floors    && { icon: Layers,     label: "Floors",     value: String(property.floors) },
    property.furnishing && { icon: Building2, label: "Furnishing", value: property.furnishing.replace(/_/g, " ") },
    property.buildYear && { icon: Calendar,   label: "Build Year", value: String(property.buildYear) },
  ].filter(Boolean) as { icon: React.FC<{size?:number;className?:string}>; label: string; value: string }[];

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="min-h-screen bg-gray-50">
      {lightboxIdx !== null && <Lightbox imgs={gallery} ytVideos={ytVideos} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />}

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-gray-400 hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight size={13} className="text-gray-300" />
            <Link href="/properties" className="text-gray-400 hover:text-green-600 transition-colors">Properties</Link>
            <ChevronRight size={13} className="text-gray-300" />
            <span className="text-gray-700 font-semibold truncate max-w-[200px]">{property.title}</span>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex-shrink-0">
            <Share2 size={14} /><span className="hidden sm:block">Share</span>
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <Gallery imgs={gallery} featured={property.isFeatured} purpose={property.purpose} onOpen={i => setLightboxIdx(i)} ytCount={ytVideos.length} />
      </div>

      {/* Project header */}
      <div className="bg-white border-b border-gray-100 shadow-sm mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{property.title}</h1>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
              <MapPin size={13} className="text-green-500 flex-shrink-0" />
              {property.areaName}, {property.city}{property.address ? ` — ${property.address}` : ""}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-2xl font-extrabold text-gray-900">PKR {formatPriceDetail(property.price)}</div>
            {property.purpose === "RENT" && <div className="text-xs text-gray-400 mt-0.5">per month</div>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Specs */}
            {specs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specs.map(s => (
                    <div key={s.label} className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <s.icon size={15} className="text-green-600" />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</div>
                        <div className="text-sm font-semibold text-gray-700 capitalize">{s.value.toLowerCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {(property.amenities?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(property.amenities ?? []).map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />{a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Installment plan */}
            {property.installmentAvailable && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4">Installment Plan</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.advanceAmount && (
                    <div className="bg-green-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Advance Amount</div>
                      <div className="text-sm font-bold text-green-700">{formatPKR(property.advanceAmount)}</div>
                    </div>
                  )}
                  {property.noOfInstallments && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">No. of Installments</div>
                      <div className="text-sm font-bold text-gray-700">{property.noOfInstallments}</div>
                    </div>
                  )}
                  {property.monthlyInstallment && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Monthly Installment</div>
                      <div className="text-sm font-bold text-gray-700">{formatPKR(property.monthlyInstallment)}</div>
                    </div>
                  )}
                  {property.balloonPayment && property.balloonAmount && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Balloon Payment</div>
                      <div className="text-sm font-bold text-gray-700">{formatPKR(property.balloonAmount)}</div>
                    </div>
                  )}
                  {property.ballotingFee && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Balloting Fee</div>
                      <div className="text-sm font-bold text-gray-700">{formatPKR(property.ballotingFee)}</div>
                    </div>
                  )}
                  {property.possessionFee && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Possession Fee</div>
                      <div className="text-sm font-bold text-gray-700">{formatPKR(property.possessionFee)}</div>
                    </div>
                  )}
                  {property.developmentFee && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Development Fee</div>
                      <div className="text-sm font-bold text-gray-700">{formatPKR(property.developmentFee)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right sidebar */}
          <div className="w-full lg:w-80 xl:w-96 space-y-4 flex-shrink-0">

            {/* Dealer card */}
            {dealer && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                    {dealer.logo
                      ? <img src={dealer.logo} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">{dealer.agencyName?.[0]}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 flex items-center gap-1">
                      <span className="truncate">{dealer.agencyName}</span>
                      {dealer.isVerified && <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{dealer.city}</div>
                  </div>
                </div>
                {dealer.bio && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{dealer.bio}</p>}
                <div className="flex gap-2">
                  {dealer.whatsapp && (
                    <a href={`https://wa.me/${dealer.whatsapp}`} target="_blank" rel="noreferrer"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors">
                      <MessageCircle size={15} />WhatsApp
                    </a>
                  )}
                  <a href={`tel:${property.contactMobiles?.[0] || dealer.whatsapp}`}
                    className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
                    <Phone size={15} />Call
                  </a>
                </div>

                {/* Contact numbers */}
                {(property.contactMobiles?.length ?? 0) > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5">
                    {property.contactMobiles!.map((m, i) => (
                      <a key={i} href={`tel:${m}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                        <Phone size={13} className="text-green-500" />{m}
                      </a>
                    ))}
                    {property.contactLandline && (
                      <a href={`tel:${property.contactLandline}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                        <Phone size={13} className="text-gray-400" />{property.contactLandline} (Landline)
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Inquiry form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Send Inquiry</h3>
              <form onSubmit={sendInquiry} className="space-y-3">
                <input required type="text" placeholder="Your Name *" value={inquiry.name}
                  onChange={e => setInquiry(f => ({ ...f, name: e.target.value }))} className={inp} />
                <div className="flex gap-2">
                  <span className="flex items-center justify-center border border-gray-200 rounded-xl px-3 text-sm text-gray-500 bg-gray-50">🇵🇰 +92</span>
                  <input required type="tel" placeholder="Phone *" value={inquiry.phone}
                    onChange={e => setInquiry(f => ({ ...f, phone: e.target.value }))} className={`flex-1 ${inp}`} />
                </div>
                <input type="email" placeholder="Email (optional)" value={inquiry.email}
                  onChange={e => setInquiry(f => ({ ...f, email: e.target.value }))} className={inp} />
                <textarea rows={3} placeholder="I am interested in this property..." value={inquiry.message}
                  onChange={e => setInquiry(f => ({ ...f, message: e.target.value }))}
                  className={`${inp} resize-none`} />
                <button type="submit" disabled={sending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-60 transition-colors">
                  {sending ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Property Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium text-gray-700 capitalize">{property.type.replace(/_/g, " ").toLowerCase()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Purpose</span><span className="font-medium text-gray-700">{property.purpose === "SALE" ? "For Sale" : "For Rent"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">City</span><span className="font-medium text-gray-700">{property.city}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Area</span><span className="font-medium text-gray-700">{property.area} {property.areaUnit}</span></div>
                {property.bedrooms  && <div className="flex justify-between"><span className="text-gray-500">Bedrooms</span><span className="font-medium text-gray-700">{property.bedrooms}</span></div>}
                {property.buildYear && <div className="flex justify-between"><span className="text-gray-500">Build Year</span><span className="font-medium text-gray-700">{property.buildYear}</span></div>}
                {property.installmentAvailable && <div className="flex justify-between"><span className="text-gray-500">Installment</span><span className="font-semibold text-green-600">Available</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
