"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Check, Eye, EyeOff, Building2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { formatCnicForStorage, isValidCnic13, normalizeCnicDigits } from "@/lib/cnic";
import { dealerDashboardUrl } from "@/lib/env";

const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Peshawar","Quetta","Multan","Faisalabad","Hyderabad","Sialkot","Gujranwala","Abbottabad","Murree"];

type Step = 1 | 2 | 3;

export default function DealerRegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [account, setAccount] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [dealer, setDealer] = useState({ agencyName: "", whatsapp: "", city: "Lahore", experience: "0", bio: "" });
  const [areas, setAreas] = useState({ areasServed: "", cnic: "" });

  const setA = (k: string, v: string) => setAccount(f => ({ ...f, [k]: v }));
  const setD = (k: string, v: string) => setDealer(f => ({ ...f, [k]: v }));

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (account.password !== account.confirm) return toast.error("Passwords don't match");
      if (account.password.length < 6) return toast.error("Min 6 characters");
    }
    setStep((s) => (s < 3 ? (s + 1) as Step : s));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = normalizeCnicDigits(areas.cnic);
    if (!isValidCnic13(digits)) {
      toast.error("Enter a valid 13-digit CNIC number");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: account.name,
        email: account.email,
        phone: account.phone,
        password: account.password,
      });
      await api.post("/auth/login", { email: account.email, password: account.password });
      await api.post("/dealers/register", {
        agencyName: dealer.agencyName,
        whatsapp: dealer.whatsapp,
        city: dealer.city,
        experience: Number(dealer.experience),
        bio: dealer.bio,
        areasServed: areas.areasServed.split(",").map(a => a.trim()).filter(Boolean),
        cnic: formatCnicForStorage(digits),
      });
      setDone(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
    setLoading(false);
  };

  const inp =
    "w-full border border-slate-200/90 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 bg-white";
  const lbl = "block text-sm font-medium text-slate-700 mb-1.5";

  const steps = [
    { n: 1 as Step, title: "Account", desc: "Your login" },
    { n: 2 as Step, title: "Agency", desc: "Business profile" },
    { n: 3 as Step, title: "Verify", desc: "Areas & CNIC" },
  ];

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/95 backdrop-blur shadow-2xl p-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-500/10">
            <Check size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Application submitted</h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            Your dealer profile is under review. We usually respond within 24 hours. You&apos;ll get an email when approved.
          </p>
          <div className="mt-8 space-y-3">
            <a
              href={`${dealerDashboardUrl}/login`}
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-emerald-600/20"
            >
              Open dealer login
            </a>
            <Link
              href="/"
              className="block w-full border border-slate-200 text-slate-700 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      <aside className="relative lg:w-[42%] min-h-[200px] lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-900 to-slate-950" />
        <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center h-full px-8 py-12 lg:px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white">
              arze<span className="text-emerald-300">Pak</span>
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200/90 mb-2">Dealer onboarding</p>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight max-w-sm">
            List properties. Reach serious buyers.
          </h1>
          <p className="mt-4 text-emerald-100/90 text-sm leading-relaxed max-w-sm">
            Create your dealer account in a few steps. After approval, use your dashboard to publish listings and manage leads.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3">
              <Sparkles className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <span><strong className="text-white">Visibility</strong> — your listings on our marketplace</span>
            </li>
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <span><strong className="text-white">Local focus</strong> — highlight cities and areas you serve</span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <span><strong className="text-white">Verification</strong> — CNIC for admin review only</span>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-slate-50">
        <header className="px-6 py-4 border-b border-slate-200/80 bg-white/90 backdrop-blur flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
            ← Home
          </Link>
          <Link href="/login" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Already registered? Sign in
          </Link>
        </header>

        <div className="flex-1 flex justify-center px-4 py-8 lg:py-12 lg:px-8">
          <div className="w-full max-w-lg">
            <div className="flex flex-wrap items-center justify-center gap-y-2 mb-10">
              {steps.map((s, i) => (
                <div key={s.n} className="flex items-center">
                  <div className="flex flex-col items-center max-w-[100px] sm:max-w-none">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                        step > s.n
                          ? "bg-emerald-600 border-emerald-600 text-white shadow"
                          : step === s.n
                            ? "border-emerald-600 text-emerald-700 bg-white shadow-sm ring-4 ring-emerald-500/15"
                            : "border-slate-200 text-slate-400 bg-white"
                      }`}
                    >
                      {step > s.n ? <Check size={18} /> : s.n}
                    </div>
                    <span className={`text-xs mt-2 font-semibold text-center ${step === s.n ? "text-emerald-700" : "text-slate-400"}`}>{s.title}</span>
                    <span className="text-[10px] text-slate-400 text-center hidden sm:block">{s.desc}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-10 sm:w-16 h-0.5 mx-1 mb-6 sm:mb-8 rounded-full shrink-0 ${step > s.n ? "bg-emerald-500" : "bg-slate-200"}`}
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5">
              {step === 1 && (
                <form onSubmit={next} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Account</h2>
                    <p className="text-sm text-slate-500 mt-0.5">This will be your dealer login.</p>
                  </div>
                  <div>
                    <label className={lbl}>Full name</label>
                    <input required type="text" value={account.name} onChange={e => setA("name", e.target.value)} className={inp} placeholder="Ali Hassan" />
                  </div>
                  <div>
                    <label className={lbl}>Email</label>
                    <input required type="email" value={account.email} onChange={e => setA("email", e.target.value)} className={inp} placeholder="you@agency.com" />
                  </div>
                  <div>
                    <label className={lbl}>Phone</label>
                    <input required type="tel" value={account.phone} onChange={e => setA("phone", e.target.value)} className={inp} placeholder="03XX-XXXXXXX" />
                  </div>
                  <div>
                    <label className={lbl}>Password</label>
                    <div className="relative">
                      <input
                        required
                        type={showPw ? "text" : "password"}
                        value={account.password}
                        onChange={e => setA("password", e.target.value)}
                        className={`${inp} pr-11`}
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Confirm password</label>
                    <input required type="password" value={account.confirm} onChange={e => setA("confirm", e.target.value)} className={inp} placeholder="••••••••" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm mt-2 shadow-lg shadow-emerald-600/20 transition-colors">
                    Continue
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={next} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Agency</h2>
                    <p className="text-sm text-slate-500 mt-0.5">How clients will see your business.</p>
                  </div>
                  <div>
                    <label className={lbl}>Agency / business name</label>
                    <input required type="text" value={dealer.agencyName} onChange={e => setD("agencyName", e.target.value)} className={inp} placeholder="City Properties" />
                  </div>
                  <div>
                    <label className={lbl}>WhatsApp</label>
                    <input required type="tel" value={dealer.whatsapp} onChange={e => setD("whatsapp", e.target.value)} className={inp} placeholder="923XX-XXXXXXX" />
                  </div>
                  <div>
                    <label className={lbl}>City</label>
                    <select value={dealer.city} onChange={e => setD("city", e.target.value)} className={inp}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Years of experience</label>
                    <input type="number" min={0} max={50} value={dealer.experience} onChange={e => setD("experience", e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Bio <span className="text-slate-400 font-normal">(optional)</span></label>
                    <textarea rows={3} value={dealer.bio} onChange={e => setD("bio", e.target.value)} className={`${inp} resize-none`} placeholder="Brief description of your services…" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                      Back
                    </button>
                    <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-colors">
                      Continue
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Service areas &amp; verification</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Last step before we review your application.</p>
                  </div>
                  <div>
                    <label className={lbl}>Areas served <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                    <input
                      type="text"
                      value={areas.areasServed}
                      onChange={e => setAreas(a => ({ ...a, areasServed: e.target.value }))}
                      className={inp}
                      placeholder="DHA, Bahria Town, Gulberg"
                    />
                  </div>
                  <div>
                    <label className={lbl}>CNIC number (13 digits)</label>
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      value={areas.cnic}
                      onChange={e => setAreas(a => ({ ...a, cnic: e.target.value }))}
                      className={inp}
                      placeholder="XXXXX-XXXXXXX-X"
                    />
                    <p className="text-xs text-slate-500 mt-1.5">Used for verification only; not shown on your public profile.</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-emerald-900">
                    <strong>Review</strong> — our team typically responds within 24 hours. You can sign in once the account is approved.
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                      Back
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-60 shadow-lg shadow-emerald-600/20 transition-colors">
                      {loading ? "Submitting…" : "Submit application"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have a dealer account?{" "}
              <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
