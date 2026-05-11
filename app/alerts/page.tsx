"use client";
import { useEffect, useState } from "react";
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL!;

interface Alert {
  _id: string; city?: string; type?: string; purpose?: string;
  minPrice?: number; maxPrice?: number; isActive: boolean; createdAt: string;
}

const CITIES = ["Lahore","Karachi","Islamabad","Rawalpindi","Peshawar","Quetta","Multan","Faisalabad"];
const TYPES  = ["HOUSE","APARTMENT","PLOT","COMMERCIAL","FARMHOUSE","ROOM"];

async function apiFetch(path: string, opts?: RequestInit) {
  const r = await fetch(`${API}${path}`, { credentials: "include", ...opts });
  return r.json();
}

export default function AlertsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts]   = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState({ city: "", type: "", purpose: "SALE", minPrice: "", maxPrice: "" });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const j = await apiFetch("/alerts");
      setAlerts(j.data || []);
    } catch { toast.error("Failed to load alerts"); }
    setLoading(false);
  };

  useEffect(() => { if (user) fetchAlerts(); }, [user]);

  const createAlert = async () => {
    setSaving(true);
    try {
      await apiFetch("/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: form.city || undefined, type: form.type || undefined,
          purpose: form.purpose,
          minPrice: form.minPrice ? Number(form.minPrice) : undefined,
          maxPrice: form.maxPrice ? Number(form.maxPrice) : undefined,
        }),
      });
      toast.success("Alert created!");
      setShowForm(false);
      setForm({ city: "", type: "", purpose: "SALE", minPrice: "", maxPrice: "" });
      fetchAlerts();
    } catch { toast.error("Failed to create alert"); }
    setSaving(false);
  };

  const toggle = async (id: string) => {
    try {
      await apiFetch(`/alerts/${id}/toggle`, { method: "PATCH" });
      setAlerts(a => a.map(x => x._id === id ? { ...x, isActive: !x.isActive } : x));
    } catch { toast.error("Failed"); }
  };

  const remove = async (id: string) => {
    try {
      await apiFetch(`/alerts/${id}`, { method: "DELETE" });
      setAlerts(a => a.filter(x => x._id !== id));
      toast.success("Alert deleted");
    } catch { toast.error("Failed"); }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-600 h-8 w-8" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Bell size={22} className="text-green-600" /> Property Alerts</h1>
            <p className="text-sm text-gray-500 mt-0.5">Get notified when matching properties are listed.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={16} /> New Alert
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Create New Alert</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Purpose</label>
                <select className={inp} value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">City (optional)</label>
                <select className={inp} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                  <option value="">Any city</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Property Type</label>
                <select className={inp} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="">Any type</option>
                  {TYPES.map(t => <option key={t} value={t}>{t.charAt(0)+t.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div />
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Min Price (PKR)</label>
                <input type="number" className={inp} placeholder="e.g. 5000000" value={form.minPrice} onChange={e => setForm(f => ({ ...f, minPrice: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Max Price (PKR)</label>
                <input type="number" className={inp} placeholder="e.g. 20000000" value={form.maxPrice} onChange={e => setForm(f => ({ ...f, maxPrice: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={createAlert} disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Create Alert"}
              </button>
            </div>
          </div>
        )}

        {/* Alerts list */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-green-600 h-8 w-8" /></div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600 mb-1">No alerts yet</h3>
            <p className="text-sm text-gray-400">Create an alert to be notified when matching properties are listed.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a._id} className={`bg-white rounded-2xl border p-5 flex items-start justify-between gap-4 transition-colors ${a.isActive ? "border-green-100" : "border-gray-100 opacity-60"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.purpose === "SALE" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                      For {a.purpose === "SALE" ? "Sale" : "Rent"}
                    </span>
                    {a.city && <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{a.city}</span>}
                    {a.type && <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{a.type.toLowerCase()}</span>}
                  </div>
                  {(a.minPrice || a.maxPrice) && (
                    <p className="text-xs text-gray-500">
                      Price: {a.minPrice ? `PKR ${(a.minPrice/100000).toFixed(0)}L` : "Any"} — {a.maxPrice ? `PKR ${(a.maxPrice/100000).toFixed(0)}L` : "Any"}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">{a.isActive ? "Active" : "Paused"}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggle(a._id)} className="text-gray-400 hover:text-green-600 transition-colors">
                    {a.isActive ? <ToggleRight size={22} className="text-green-600" /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => remove(a._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
