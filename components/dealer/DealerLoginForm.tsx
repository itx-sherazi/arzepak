"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function DealerLoginForm() {
  const { login, logout, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    router.replace("/");
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { role } = await login(email, password);

      if (role === "ADMIN") {
        toast.error(
          "Admin accounts sign in through the admin dashboard, not this page.",
        );
        await logout();
        setLoading(false);
        return;
      }
      if (role === "USER") {
        toast.error(
          "This portal is for property dealers only. Create a dealer account to list properties.",
        );
        await logout();
        setLoading(false);
        return;
      }

      toast.success("Signed in");
      router.replace("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
    setLoading(false);
  };

  const inp =
    "w-full border-0 border-b border-slate-200 bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#00A651] focus:ring-0 outline-none";
  const lbl = "mb-0 block text-xs font-medium text-slate-800 sm:text-sm";

  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-white text-slate-500 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-white">
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-1/2 w-2/5 max-w-sm bg-emerald-500/10"
        aria-hidden
      />
      <div className="absolute left-0 top-0 z-10 w-full border-b border-slate-200 bg-white px-3 py-2 sm:px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 sm:text-sm hover:text-emerald-700"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Back to site
        </Link>
      </div>

      <div className="relative z-1 mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-3 pb-8 pt-12 sm:px-4 sm:pt-14">
        <div className="border border-slate-200 bg-white p-4 sm:p-5 w-full">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Sign in
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Dealer account — email and password.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-2.5 sm:space-y-3"
          >
            <div>
              <label className={lbl} htmlFor="li-email">
                Email
              </label>
              <input
                id="li-email"
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
              <label className={lbl} htmlFor="li-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="li-password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inp} pr-9`}
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-[#00A651] py-2.5 text-sm font-bold text-white transition hover:bg-[#008f45] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>

          <div className="my-3 flex items-center gap-2 sm:my-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              or
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => void signIn("google", { callbackUrl: "/login" })}
            className="flex w-full cursor-pointer items-center justify-center gap-2 border border-[#00A651] bg-white py-2 text-sm font-semibold text-slate-800 transition hover:bg-emerald-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-3 text-center text-xs text-slate-600 sm:text-sm">
            New to arzepak?{" "}
            <Link
              href="/dealer/register"
              className="font-semibold text-[#00A651] hover:underline"
            >
              Register as dealer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
