"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { dealerDashboardUrl } from "@/lib/env";

function isExternalOrigin(absoluteUrl: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    return new URL(absoluteUrl).origin !== window.location.origin;
  } catch {
    return false;
  }
}

export default function LoginPage() {
  const { login, logout, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const dealerBase = dealerDashboardUrl;

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role === "DEALER") {
      if (isExternalOrigin(dealerBase)) window.location.href = `${dealerBase}/dashboard`;
      else router.replace("/");
      return;
    }
    router.replace("/");
  }, [authLoading, user, router, dealerBase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { role, token } = await login(email, password);

      if (role === "ADMIN") {
        toast.error("Admin accounts sign in through the admin dashboard, not this page.");
        await logout();
        setLoading(false);
        return;
      }
      if (role === "USER") {
        toast.error("This portal is for property dealers only. Create a dealer account to list properties.");
        await logout();
        setLoading(false);
        return;
      }

      if (role === "DEALER" && token && isExternalOrigin(dealerBase)) {
        window.location.href = `${dealerBase}/auth/sync#${encodeURIComponent(token)}`;
        return;
      }
      if (role === "DEALER" && isExternalOrigin(dealerBase)) {
        window.location.href = `${dealerBase}/dashboard`;
        return;
      }
      router.replace("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
    setLoading(false);
  };

  const inp =
    "w-full border border-slate-200/80 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/90";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950">
      <div className="relative lg:w-[46%] min-h-[220px] lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-center h-full px-8 py-12 lg:px-14 lg:py-16 text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200/90">Dealer portal</p>
              <p className="text-xl font-bold tracking-tight">arze<span className="text-emerald-300">Pak</span></p>
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight max-w-md">
            Sign in to manage listings &amp; leads
          </h1>
          <p className="mt-4 text-emerald-100/90 text-sm lg:text-base max-w-md leading-relaxed">
            One login for verified dealers: publish properties, track inquiries, and grow your agency on Pakistan&apos;s property marketplace.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-emerald-50/95">
            {["Listings synced with your dashboard", "Lead notifications & inquiry tools", "Trusted by agencies nationwide"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700 text-sm font-semibold transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to site
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dealer sign in</h2>
                <p className="text-slate-500 text-sm mt-1.5">Use the email and password for your dealer account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inp}
                    placeholder="you@agency.com"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inp} pr-11`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-60 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  {loading ? "Signing in…" : "Sign in to dashboard"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                New to arzepak?{" "}
                <Link href="/dealer/register" className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">
                  Apply as a dealer
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
