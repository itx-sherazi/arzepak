"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2, Phone, MessageCircle, Heart, Share2, ChevronLeft, ChevronRight, CheckCircle2, Building2, Calendar, Layers } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { fetchPropertyBySlug } from "@/services/properties";
import { postInquiry } from "@/services/inquiries";
import type { PropertyDetail } from "@/types/property";
import { formatPriceDetail } from "./propertyFormatting";

export default function PropertyDetailView() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading]   = useState(true);
  const [imgIdx, setImgIdx]     = useState(0);
  const [sending, setSending]   = useState(false);

  const [inquiry, setInquiry] = useState({ name: user?.name||"", email: user?.email||"", phone: "", message: "" });

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetchPropertyBySlug(String(slug))
      .then((j) => {
        if (cancel) return;
        if (j.success) setProperty(j.data);
        else setProperty(null);
      })
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
      toast.success("Inquiry sent! The agent will contact you soon.");
      setInquiry((f) => ({ ...f, phone: "", message: "" }));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
    }
    setSending(false);
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );
  if (!property) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">🏠</div>
      <h2 className="text-xl font-bold text-gray-700">Property not found</h2>
      <Link href="/properties" className="text-green-600 hover:underline">← Back to listings</Link>
    </div>
  );

  const imgs = (property.images || [])
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean) as string[];
  const gallery = imgs.length ? imgs : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"];
  const dealer = property.dealerId;

  const specs = [
    property.area      && { icon: Maximize2,  label: "Area",       value: `${property.area} ${property.areaUnit}` },
    property.bedrooms  && { icon: Bed,         label: "Bedrooms",   value: String(property.bedrooms) },
    property.bathrooms && { icon: Bath,        label: "Bathrooms",  value: String(property.bathrooms) },
    property.floors    && { icon: Layers,      label: "Floors",     value: String(property.floors) },
    property.furnishing && { icon: Building2,   label: "Furnishing", value: property.furnishing.replace("_"," ") },
    property.buildYear && { icon: Calendar,    label: "Build Year", value: String(property.buildYear) },
  ].filter(Boolean) as { icon: React.FC<{size?:number; className?:string}>; label: string; value: string }[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
            <ChevronLeft size={16}/> Back
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <span className="font-bold text-gray-800 hidden sm:block">arze<span className="text-green-600">Pak</span></span>
          </Link>
          <div className="flex-1"/>
          <div className="flex items-center gap-2">
            <button onClick={share} className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Share2 size={14}/><span className="hidden sm:block">Share</span>
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Heart size={14}/><span className="hidden sm:block">Save</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-72 sm:h-96">
                <img src={gallery[imgIdx]} alt={property.title} className="w-full h-full object-cover"/>
                {gallery.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => (i-1+gallery.length)%gallery.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
                      <ChevronLeft size={18}/>
                    </button>
                    <button onClick={() => setImgIdx(i => (i+1)%gallery.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
                      <ChevronRight size={18}/>
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                      {imgIdx+1} / {gallery.length}
                    </div>
                  </>
                )}
                {property.isFeatured && (
                  <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">⭐ FEATURED</span>
                )}
                <span className={`absolute top-3 ${property.isFeatured?"left-24":"left-3"} text-xs font-bold px-2.5 py-1 rounded-full ${property.purpose==="SALE"?"bg-green-600 text-white":"bg-blue-600 text-white"}`}>
                  {property.purpose==="SALE"?"FOR SALE":"FOR RENT"}
                </span>
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {gallery.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i===imgIdx?"border-green-500":"border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & price */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug">{property.title}</h1>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1.5">
                    <MapPin size={14} className="text-green-500 flex-shrink-0"/>
                    {property.areaName}, {property.city}
                    {property.address && ` — ${property.address}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-700">
                    PKR {formatPriceDetail(property.price)}
                  </div>
                  {property.purpose==="RENT" && <div className="text-xs text-gray-400">per month</div>}
                </div>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-50">
                {specs.map(s => (
                  <div key={s.label} className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <s.icon size={15} className="text-green-600"/>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</div>
                      <div className="text-sm font-semibold text-gray-700 capitalize">{s.value.toLowerCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                  {(property.amenities ?? []).map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={15} className="text-green-500 flex-shrink-0"/>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="w-full lg:w-80 xl:w-96 space-y-4 flex-shrink-0">
            {/* Dealer card */}
            {dealer && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                    {dealer.logo
                      ? <img src={dealer.logo} alt="" className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">{dealer.agencyName?.[0]}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 flex items-center gap-1">
                      <span className="truncate">{dealer.agencyName}</span>
                      {dealer.isVerified && <CheckCircle2 size={14} className="text-green-500 flex-shrink-0"/>}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{dealer.city}</div>
                  </div>
                </div>
                {dealer.experience > 0 && (
                  <div className="text-xs text-gray-500 mb-3">{dealer.experience} years experience · {dealer.areasServed?.slice(0,3).join(", ")}</div>
                )}
                <div className="flex gap-2">
                  {dealer.whatsapp && (
                    <a href={`https://wa.me/${dealer.whatsapp}`} target="_blank" rel="noreferrer"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors">
                      <MessageCircle size={15}/>WhatsApp
                    </a>
                  )}
                  <a href={`tel:${dealer.whatsapp}`}
                    className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
                    <Phone size={15}/>Call
                  </a>
                </div>
              </div>
            )}

            {/* Inquiry form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Send Inquiry</h3>
              <form onSubmit={sendInquiry} className="space-y-3">
                <input required type="text" placeholder="Your Name" value={inquiry.name}
                  onChange={e => setInquiry(f => ({...f, name: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input required type="email" placeholder="Email Address" value={inquiry.email}
                  onChange={e => setInquiry(f => ({...f, email: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <input required type="tel" placeholder="Phone Number" value={inquiry.phone}
                  onChange={e => setInquiry(f => ({...f, phone: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <textarea rows={4} placeholder="I am interested in this property..." value={inquiry.message}
                  onChange={e => setInquiry(f => ({...f, message: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/>
                <button type="submit" disabled={sending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-60 transition-colors">
                  {sending ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            </div>

            {/* Property summary card */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">Property Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium text-gray-700 capitalize">{property.type.toLowerCase()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Purpose</span><span className="font-medium text-gray-700">{property.purpose==="SALE"?"For Sale":"For Rent"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">City</span><span className="font-medium text-gray-700">{property.city}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Area</span><span className="font-medium text-gray-700">{property.area} {property.areaUnit}</span></div>
                {property.bedrooms && <div className="flex justify-between"><span className="text-gray-500">Bedrooms</span><span className="font-medium text-gray-700">{property.bedrooms}</span></div>}
                {property.buildYear && <div className="flex justify-between"><span className="text-gray-500">Build Year</span><span className="font-medium text-gray-700">{property.buildYear}</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
