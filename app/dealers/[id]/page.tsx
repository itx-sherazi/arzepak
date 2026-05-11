"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, CheckCircle2, Building2, Star, Briefcase } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Dealer {
  _id: string; agencyName: string; bio?: string; city: string;
  whatsapp?: string; logo?: string; isVerified: boolean;
  experience: number; areasServed: string[]; avgRating: number;
  totalListings: number; totalLeads: number; createdAt: string;
}
interface Property {
  _id: string; title: string; slug: string; city: string; areaName: string;
  price: number; purpose: string; type: string; area: number; areaUnit: string;
  images: Array<string | { url: string }>;
}

function formatPKR(n: number) {
  if (n >= 10000000) return `PKR ${(n/10000000).toFixed(1)} Cr`;
  if (n >= 100000)   return `PKR ${(n/100000).toFixed(0)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

export default function DealerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [dealer, setDealer]       = useState<Dealer | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch(`${API}/dealers/${id}`)
      .then(r => r.json())
      .then(j => { if (j.success) { setDealer(j.data.dealer); setProperties(j.data.properties || []); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!dealer) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-3">🏢</div><p className="text-gray-500">Dealer not found</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm">
              {dealer.logo
                ? <img src={dealer.logo} alt={dealer.agencyName} className="w-full h-full object-contain p-1" />
                : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-green-600 bg-green-50">{dealer.agencyName?.[0]}</div>
              }
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{dealer.agencyName}</h1>
                {dealer.isVerified && (
                  <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1.5">
                <MapPin size={13} className="text-green-500" />{dealer.city}
              </div>
              {dealer.bio && <p className="text-gray-600 text-sm mt-3 max-w-2xl leading-relaxed">{dealer.bio}</p>}

              {/* Stats */}
              <div className="flex gap-6 mt-4 flex-wrap">
                {dealer.experience > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Briefcase size={14} className="text-green-500" />{dealer.experience} yrs experience
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Building2 size={14} className="text-green-500" />{dealer.totalListings} listings
                </div>
                {dealer.avgRating > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />{dealer.avgRating.toFixed(1)} rating
                  </div>
                )}
              </div>

              {dealer.areasServed?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {dealer.areasServed.slice(0, 8).map(a => (
                    <span key={a} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">{a}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="flex gap-2 flex-shrink-0">
              {dealer.whatsapp && (
                <a href={`https://wa.me/${dealer.whatsapp}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                  <MessageCircle size={15} /> WhatsApp
                </a>
              )}
              {dealer.whatsapp && (
                <a href={`tel:${dealer.whatsapp}`}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <Phone size={15} /> Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Active Listings ({properties.length})</h2>
        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No active listings yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map(p => {
              const img = (typeof p.images?.[0] === "string" ? p.images[0] : (p.images?.[0] as {url:string})?.url) || "";
              return (
                <Link key={p._id} href={`/properties/${p.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-green-200 transition-all">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {img
                      ? <img src={img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center"><Building2 size={28} className="text-gray-300" /></div>
                    }
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.purpose === "SALE" ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}>
                      {p.purpose === "SALE" ? "FOR SALE" : "FOR RENT"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-green-700 mb-1">{p.title}</h3>
                    <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <MapPin size={10} className="text-green-500" />{p.areaName}, {p.city}
                    </div>
                    <div className="text-base font-bold text-green-700">{formatPKR(p.price)}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
