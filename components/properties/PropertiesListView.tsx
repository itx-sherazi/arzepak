"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, MapPin, Bed, Bath, Maximize2, Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchPropertiesList } from "@/services/properties";
import type { PropertyListItem } from "@/types/property";
import { formatPriceCompact, timeAgo } from "./propertyFormatting";

const CITIES = ["Lahore","Karachi","Islamabad","Rawalpindi","Peshawar","Quetta","Multan","Faisalabad","Hyderabad","Sialkot","Gujranwala","Abbottabad"];
const TYPES  = ["HOUSE","APARTMENT","PLOT","COMMERCIAL","FARMHOUSE","ROOM"];
const BEDS   = ["1","2","3","4","5"];

export default function PropertiesListView() {
  const sp = useSearchParams();

  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [purpose,  setPurpose]  = useState(sp.get("purpose")  || "SALE");
  const [city,     setCity]     = useState(sp.get("city")     || "");
  const [areaName, setAreaName] = useState(sp.get("areaName") || "");
  const [type,     setType]     = useState(sp.get("type")     || "");
  const [minPrice, setMinPrice] = useState(sp.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(sp.get("maxPrice") || "");
  const [minArea,  setMinArea]  = useState(sp.get("minArea")  || "");
  const [bedrooms,    setBedrooms]    = useState(sp.get("bedrooms")    || "");
  const [bathrooms,   setBathrooms]   = useState(sp.get("bathrooms")   || "");
  const [furnishing,  setFurnishing]  = useState(sp.get("furnishing")  || "");
  const [addedWithin, setAddedWithin] = useState(sp.get("addedWithin") || "");
  const [sort,     setSort]     = useState(sp.get("sort")     || "-createdAt");
  const [page,     setPage]     = useState(Number(sp.get("page") || 1));

  const buildQuery = useCallback(() => {
    const p = new URLSearchParams();
    p.set("limit", "20");
    p.set("page",  String(page));
    p.set("sort",  sort);
    if (purpose)  p.set("purpose",  purpose);
    if (city)     p.set("city",     city);
    if (areaName) p.set("areaName", areaName);
    if (type)     p.set("type",     type);
    if (minPrice)    p.set("minPrice",    minPrice);
    if (maxPrice)    p.set("maxPrice",    maxPrice);
    if (minArea)     p.set("minArea",     minArea);
    if (bedrooms)    p.set("bedrooms",    bedrooms);
    if (bathrooms)   p.set("bathrooms",   bathrooms);
    if (furnishing)  p.set("furnishing",  furnishing);
    if (addedWithin) p.set("addedWithin", addedWithin);
    return p.toString();
  }, [purpose, city, areaName, type, minPrice, maxPrice, minArea, bedrooms, bathrooms, furnishing, addedWithin, sort, page]);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const j = await fetchPropertiesList(buildQuery());
      setProperties(j.data || []);
      setTotal(j.total || 0);
      setPages(j.pages || 1);
    } catch { setProperties([]); }
    setLoading(false);
  }, [buildQuery]);

  useEffect(() => { void fetch_(); }, [fetch_]);

  const applyFilters = () => { setPage(1); setShowFilters(false); };

  const clearTag = (setter: (v: string) => void) => { setter(""); setPage(1); };

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  const activeTags = [
    purpose && { label: purpose === "SALE" ? "For Sale" : "For Rent", clear: () => setPurpose("") },
    city     && { label: city,     clear: () => clearTag(setCity) },
    areaName && { label: areaName, clear: () => clearTag(setAreaName) },
    type     && { label: type,     clear: () => clearTag(setType) },
    bedrooms    && { label: `${bedrooms} Beds`, clear: () => clearTag(setBedrooms) },
    bathrooms   && { label: `${bathrooms} Baths`, clear: () => clearTag(setBathrooms) },
    furnishing  && { label: furnishing.replace("_"," "), clear: () => clearTag(setFurnishing) },
    addedWithin && { label: addedWithin==="1"?"Last 24h":addedWithin==="7"?"Last Week":"Last Month", clear: () => clearTag(setAddedWithin) },
    minPrice    && { label: `Min ${formatPriceCompact(Number(minPrice))}`, clear: () => clearTag(setMinPrice) },
    maxPrice    && { label: `Max ${formatPriceCompact(Number(maxPrice))}`, clear: () => clearTag(setMaxPrice) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <span className="text-base font-bold text-gray-800 hidden sm:block">arzepak<span className="text-green-600">Properties</span></span>
          </Link>

          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {["SALE","RENT"].map(p => (
              <button key={p} onClick={() => { setPurpose(p); setPage(1); }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${purpose===p ? "bg-green-600 text-white shadow" : "text-gray-600 hover:text-gray-800"}`}>
                {p === "SALE" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <input value={areaName} onChange={e => setAreaName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applyFilters()}
              placeholder="Search area, city, project..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 min-w-0" />
            <button onClick={applyFilters}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0">
              Search
            </button>
          </div>

          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex-shrink-0">
            <SlidersHorizontal size={15}/><span className="hidden sm:block">Filters</span>
          </button>
        </div>

        {activeTags.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 pb-2 flex gap-2 flex-wrap">
            {activeTags.map(t => (
              <span key={t.label} className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-0.5 text-xs font-medium">
                {t.label}
                <button onClick={t.clear} type="button"><X size={11}/></button>
              </span>
            ))}
            <button type="button" onClick={() => { setPurpose("SALE"); setCity(""); setAreaName(""); setType(""); setMinPrice(""); setMaxPrice(""); setMinArea(""); setBedrooms(""); setBathrooms(""); setFurnishing(""); setAddedWithin(""); setPage(1); }}
              className="text-xs text-red-500 hover:underline">Clear all</button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <aside className={`flex-shrink-0 w-64 space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">Filters</h3>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">City</label>
              <select value={city} onChange={e => setCity(e.target.value)} className={inp}>
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Property Type</label>
              <div className="space-y-1.5">
                {TYPES.map(t => (
                  <label key={t} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="type" checked={type===t} onChange={() => setType(t)}
                      className="accent-green-600"/>
                    {t.charAt(0)+t.slice(1).toLowerCase()}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                  <input type="radio" name="type" checked={type===""} onChange={() => setType("")} className="accent-green-600"/>
                  Any
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Price (PKR)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className={`${inp} w-1/2`}/>
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={`${inp} w-1/2`}/>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Bedrooms</label>
              <div className="flex gap-1.5 flex-wrap">
                {["Any",...BEDS].map(b => (
                  <button key={b} type="button" onClick={() => setBedrooms(b==="Any" ? "" : b)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${bedrooms===(b==="Any"?"":b) ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-400"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Min Area (Marla)</label>
              <input type="number" placeholder="e.g. 5" value={minArea} onChange={e => setMinArea(e.target.value)} className={inp}/>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Bathrooms</label>
              <div className="flex gap-1.5 flex-wrap">
                {["Any","1","2","3","4","5"].map(b => (
                  <button key={b} type="button" onClick={() => setBathrooms(b==="Any" ? "" : b)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${bathrooms===(b==="Any"?"":b) ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-400"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Furnishing</label>
              <select value={furnishing} onChange={e => setFurnishing(e.target.value)} className={inp}>
                <option value="">Any</option>
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi-Furnished</option>
                <option value="FURNISHED">Furnished</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Date Added</label>
              <div className="space-y-1.5">
                {[{label:"Any",value:""},{label:"Last 24 Hours",value:"1"},{label:"Last Week",value:"7"},{label:"Last Month",value:"30"}].map(o => (
                  <label key={o.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="addedWithin" checked={addedWithin===o.value} onChange={() => setAddedWithin(o.value)} className="accent-green-600"/>
                    {o.label}
                  </label>
                ))}
              </div>
            </div>

            <button type="button" onClick={applyFilters}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold">
              Apply Filters
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {loading ? "Loading..." : <><strong className="text-gray-800">{total.toLocaleString()}</strong> properties found</>}
            </div>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
              <option value="-views">Most Popular</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-lg font-bold text-gray-700">No properties found</h3>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search in a different city.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map(p => (
                <Link key={p._id} href={`/properties/${p.slug}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-green-200 transition-all">
                  <div className="relative sm:w-64 h-52 sm:h-auto flex-shrink-0">
                    <img
                      src={
                        (typeof p.images?.[0] === "string" ? p.images?.[0] : p.images?.[0]?.url) ||
                        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400"
                      }
                      alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    {p.isFeatured && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ FEATURED</span>
                    )}
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.purpose==="SALE"?"bg-green-600 text-white":"bg-blue-600 text-white"}`}>
                      {p.purpose==="SALE"?"FOR SALE":"FOR RENT"}
                    </span>
                    {p.images?.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                        📷 {p.images.length}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-base leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                          {p.title}
                        </h3>
                        <button type="button" className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5" onClick={e => e.preventDefault()}>
                          <Heart size={18}/>
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin size={13} className="text-green-500 flex-shrink-0"/>
                        <span className="truncate">{p.areaName}, {p.city}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex gap-4 flex-wrap my-3">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Maximize2 size={12} className="text-gray-400"/>
                          {p.area} {p.areaUnit}
                        </span>
                        {p.bedrooms && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Bed size={12} className="text-gray-400"/>{p.bedrooms} Beds
                          </span>
                        )}
                        {p.bathrooms && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Bath size={12} className="text-gray-400"/>{p.bathrooms} Baths
                          </span>
                        )}
                        <span className="text-xs text-gray-400 capitalize">
                          {p.type.charAt(0)+p.type.slice(1).toLowerCase()}
                        </span>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-xl font-bold text-green-700">
                            PKR {formatPriceCompact(p.price)}
                            {p.purpose==="RENT" && <span className="text-sm font-normal text-gray-400">/mo</span>}
                          </div>
                          {p.dealerId?.agencyName && (
                            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              {p.dealerId.agencyName}
                              {p.dealerId.isVerified && <span className="text-green-600">✓</span>}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-400">{timeAgo(p.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button type="button" disabled={page===1} onClick={() => setPage(p => p-1)}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft size={15}/> Prev
              </button>
              <div className="flex gap-1">
                {Array.from({length: Math.min(pages, 7)}, (_, i) => {
                  const pg = pages <= 7 ? i+1 : page <= 4 ? i+1 : page >= pages-3 ? pages-6+i : page-3+i;
                  return (
                    <button type="button" key={pg} onClick={() => setPage(pg)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${pg===page ? "bg-green-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {pg}
                    </button>
                  );
                })}
              </div>
              <button type="button" disabled={page===pages} onClick={() => setPage(p => p+1)}
                className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40 hover:bg-gray-50">
                Next <ChevronRight size={15}/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
