"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, RotateCcw, Search, MapPin } from "lucide-react";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Peshawar", "Quetta", "Multan", "Faisalabad", "Hyderabad", "Sialkot", "Gujranwala", "Abbottabad"];
const TYPES = ["Any", "HOUSE", "APARTMENT", "PLOT", "COMMERCIAL", "FARMHOUSE", "ROOM"];
const BEDS = ["Any", "1", "2", "3", "4", "5", "6+"];
const PRICES_SALE = [
  { label: "Any", value: "" },
  { label: "25 Lac", value: "2500000" },
  { label: "50 Lac", value: "5000000" },
  { label: "1 Crore", value: "10000000" },
  { label: "2 Crore", value: "20000000" },
  { label: "5 Crore", value: "50000000" },
  { label: "10 Crore", value: "100000000" },
];
const PRICES_RENT = [
  { label: "Any", value: "" },
  { label: "10,000", value: "10000" },
  { label: "25,000", value: "25000" },
  { label: "50,000", value: "50000" },
  { label: "1 Lac", value: "100000" },
  { label: "2 Lac", value: "200000" },
];
const AREAS = [
  { label: "Any", value: "" },
  { label: "3 Marla", value: "3" },
  { label: "5 Marla", value: "5" },
  { label: "10 Marla", value: "10" },
  { label: "1 Kanal", value: "20" },
  { label: "2 Kanal", value: "40" },
];

export default function Hero() {
  const router = useRouter();
  const [tab, setTab] = useState<"BUY" | "RENT">("BUY");
  const [city, setCity] = useState("Lahore");
  const [location, setLocation] = useState("");

  const search = () => {
    const p = new URLSearchParams();
    p.set("purpose", tab === "BUY" ? "SALE" : "RENT");
    p.set("city", city);
    if (location) p.set("areaName", location);
    router.push(`/properties?${p.toString()}`);
  };

  const getTitle = () => {
    if (tab === "BUY") return "Find your dream home for Sale";
    if (tab === "RENT") return "Find your dream home for Rent";
    return "Your dream home search has just begun.";
  };

  return (
    <section className="relative min-h-[450px] flex items-center overflow-hidden font-sans">
      {/* Background Image - Representative of Pakistani modern housing */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600')" }} 
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 lg:px-24">
        {/* Left Aligned Content */}
        <div className="max-w-2xl text-left">
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
            {getTitle()}
          </h1>

          <div className="flex flex-col items-start w-full">
            {/* Tabs row */}
            <div className="flex gap-0 mb-0">
              {(["BUY", "RENT", "PROJECTS"] as const).map(t => (
                <button 
                  key={t}
                  onClick={() => {
                    if (t === "PROJECTS") {
                      router.push("/new-projects");
                    } else {
                      setTab(t);
                    }
                  }}
                  className={`px-6 sm:px-8 py-2.5 text-xs sm:text-sm font-bold transition-all uppercase tracking-wider ${
                    (t === "PROJECTS" ? false : tab === t)
                      ? "bg-white text-gray-900" 
                      : "bg-white/70 hover:bg-white/80 text-gray-800 backdrop-blur-sm border-r border-gray-300/30"
                  } first:rounded-tl-md last:rounded-tr-md last:border-r-0`}
                >
                  {t === "BUY" ? "Buy" : t === "RENT" ? "Rent" : "Projects"}
                </button>
              ))}
            </div>

            {/* Search Box Container - Clean White Style */}
            <div className="w-full bg-white p-2 shadow-2xl rounded-tr-md rounded-b-md flex flex-col sm:flex-row gap-2 items-stretch">
              {/* City Selection */}
              <div className="flex-1 sm:max-w-[180px] bg-gray-50 border border-gray-100 rounded flex flex-col px-4 py-2 focus-within:ring-2 focus-within:ring-green-500/20 transition-shadow">
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">City</label>
                <select 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  className="bg-transparent text-gray-800 font-semibold text-sm focus:outline-none w-full cursor-pointer h-7"
                >
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Location Input */}
              <div className="flex-[2] bg-gray-50 border border-gray-100 rounded flex flex-col px-4 py-2 focus-within:ring-2 focus-within:ring-green-500/20 transition-shadow">
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Location</label>
                <div className="flex items-center gap-2">
                   <MapPin size={14} className="text-gray-400 shrink-0" />
                   <input 
                    value={location} 
                    onChange={e => setLocation(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && search()}
                    placeholder="Address, School, Agent, ZIP..." 
                    className="bg-transparent text-gray-800 placeholder-gray-400 font-semibold text-sm focus:outline-none w-full h-7" 
                  />
                </div>
              </div>

              {/* Search Button - Green as requested */}
              <button 
                onClick={search}
                className="bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white p-4 sm:px-6 rounded flex items-center justify-center transition-all shadow-lg group shrink-0"
              >
                <Search size={22} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
