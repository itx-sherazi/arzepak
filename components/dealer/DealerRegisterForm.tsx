"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { dealerDashboardUrl } from "@/lib/env";
import {
  completeDealerRegistration,
  toPakistanE164FromLocalInput,
} from "@/services/dealerRegister";

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Hyderabad",
  "Sialkot",
  "Gujranwala",
  "Abbottabad",
  "Murree",
];

const LOGO_MAX_BYTES = 5 * 1024 * 1024;

function isExternalOrigin(absoluteUrl: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    return new URL(absoluteUrl).origin !== window.location.origin;
  } catch {
    return true;
  }
}

function redirectToDealerDashboard(
  token: string | undefined,
  dealerBase: string,
  router: ReturnType<typeof useRouter>,
) {
  if (token && isExternalOrigin(dealerBase)) {
    window.location.href = `${dealerBase}/auth/sync#${encodeURIComponent(token)}`;
    return;
  }
  if (isExternalOrigin(dealerBase)) {
    window.location.href = `${dealerBase}/dashboard`;
    return;
  }
  router.replace("/");
}

function isValidPkMobileLocal(s: string): boolean {
  const n = s.replace(/\D/g, "");
  const x = n.startsWith("0") ? n.slice(1) : n;
  return x.length === 10 && x[0] === "3";
}

export default function DealerRegisterForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const dealerBase = dealerDashboardUrl;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneLocal, setPhoneLocal] = useState("");

  const [iAmAgent, setIAmAgent] = useState(false);
  const [marketingOk, setMarketingOk] = useState(false);
  const [termsStep1, setTermsStep1] = useState(false);

  const [city, setCity] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [address, setAddress] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("");
  const [termsStep2, setTermsStep2] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user?.role === "DEALER") {
      router.replace("/");
    }
  }, [authLoading, user, router, dealerBase]);

  const inpStep1 =
    "w-full border-0 border-b border-slate-200 bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-0 outline-none";
  const lbl = "mb-0 block text-xs font-medium text-slate-800 sm:text-sm";
  const inpStep2 = inpStep1;
  const chk =
    "mt-0.5 h-3.5 w-3.5 shrink-0 border-slate-300 text-emerald-600 focus:ring-emerald-500";

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iAmAgent) {
      toast.error(
        "Please check 'I am an Agent!' to register as a dealer and continue.",
      );
      return;
    }
    if (!termsStep1) {
      toast.error("Please accept the terms and conditions.");
      return;
    }
    if (password.length < 6) {
      toast.error("Use at least 6 characters for your password");
      return;
    }
    if (!isValidPkMobileLocal(phoneLocal)) {
      toast.error(
        "Enter a valid Pakistan mobile (10 digits starting with 3, e.g. 300 1234567).",
      );
      return;
    }
    setStep(2);
  };

  const pickLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setLogoFile(null);
      setLogoName("");
      return;
    }
    if (f.size > LOGO_MAX_BYTES) {
      toast.error("Image must be 5 MB or less.");
      e.target.value = "";
      return;
    }
    if (!/^image\//.test(f.type)) {
      toast.error("Please choose an image file.");
      e.target.value = "";
      return;
    }
    setLogoFile(f);
    setLogoName(f.name);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsStep2) {
      toast.error("Please confirm to complete registration.");
      return;
    }
    if (!city) {
      toast.error("Select a city");
      return;
    }
    setLoading(true);
    try {
      const phoneE164 = toPakistanE164FromLocalInput(phoneLocal);
      const { token } = await completeDealerRegistration(
        { name, email, password, phone: phoneE164 },
        { agencyName, city, companyEmail, address: address.trim() },
        logoFile,
      );
      toast.success("Welcome! Opening your dashboard…");
      redirectToDealerDashboard(token, dealerBase, router);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-500 text-sm">
        Loading…
      </div>
    );
  }

  if (user?.role === "DEALER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-500 text-sm">
        Redirecting…
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

      <div className="relative z-1 mx-auto flex min-h-dvh max-w-md flex-col px-3 pb-4 pt-12 sm:px-4 sm:pt-14">
        {step === 1 && (
          <div className="border border-slate-200 bg-white p-4 sm:p-5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Sign Up
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Account first, then agency details.
            </p>

            <form onSubmit={goNext} className="mt-4 space-y-2.5 sm:space-y-3">
              <div>
                <label className={lbl} htmlFor="su-name">
                  Name
                </label>
                <input
                  id="su-name"
                  className={inpStep1}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div>
                <label className={lbl} htmlFor="su-email">
                  Email address
                </label>
                <input
                  id="su-email"
                  type="email"
                  className={inpStep1}
                  placeholder="abc@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={lbl} htmlFor="su-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="su-password"
                    type={showPw ? "text" : "password"}
                    className={`${inpStep1} pr-9`}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPw(!showPw)}
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
              <div>
                <label className={lbl} htmlFor="su-phone">
                  Mobile number
                </label>
                <div className="flex items-stretch gap-2 border-b border-slate-200 pb-0.5 focus-within:border-emerald-600">
                  <span
                    className="flex shrink-0 items-center gap-1 border-0 pr-0.5 text-xs text-slate-700 sm:text-sm"
                    aria-hidden
                  >
                    <span className="text-base leading-none" title="Pakistan">
                      🇵🇰
                    </span>
                    <span className="font-medium">+92</span>
                  </span>
                  <input
                    id="su-phone"
                    type="tel"
                    className="min-w-0 flex-1 border-0 bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 outline-none"
                    placeholder="300 1234567"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phoneLocal}
                    onChange={(e) => setPhoneLocal(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-0.5">
                <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-700 sm:text-sm">
                  <input
                    type="checkbox"
                    className={chk}
                    checked={iAmAgent}
                    onChange={(e) => setIAmAgent(e.target.checked)}
                  />
                  <span>
                    I am an <strong className="text-slate-900">Agent</strong>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-600 sm:text-sm">
                  <input
                    type="checkbox"
                    className={chk}
                    checked={marketingOk}
                    onChange={(e) => setMarketingOk(e.target.checked)}
                  />
                  <span>Marketing from arzepak (optional)</span>
                </label>
                <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-700 sm:text-sm">
                  <input
                    type="checkbox"
                    className={chk}
                    checked={termsStep1}
                    onChange={(e) => setTermsStep1(e.target.checked)}
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      Terms
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="mt-1 w-full bg-[#00A651] py-2.5 text-sm font-bold text-white transition hover:bg-[#008f45]"
              >
                Continue
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
              onClick={() =>
                void signIn("google", { callbackUrl: "/dealer/register" })
              }
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
              Have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#00A651] hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Agency Info
              </h1>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="shrink-0 text-xs font-semibold text-[#00A651] hover:underline sm:text-sm"
              >
                Go Back
              </button>
            </div>

            <form
              onSubmit={handleFinalSubmit}
              className="space-y-2.5 sm:space-y-3"
            >
              <div>
                <label className={lbl} htmlFor="ag-city">
                  Select city
                </label>
                <select
                  id="ag-city"
                  className={inpStep2}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl} htmlFor="ag-name">
                  Agency name
                </label>
                <input
                  id="ag-name"
                  className={inpStep2}
                  placeholder="Enter your agency name"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={lbl} htmlFor="ag-cemail">
                  Company email
                </label>
                <input
                  id="ag-cemail"
                  type="email"
                  className={inpStep2}
                  placeholder="Enter your company email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={lbl} htmlFor="ag-addr">
                  Agency address
                </label>
                <input
                  id="ag-addr"
                  className={inpStep2}
                  placeholder="Enter your company address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <p className={lbl}>Upload image</p>
                <p className="text-[10px] text-slate-500 sm:text-xs">
                  *Max 5 MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={pickLogo}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 border border-[#00A651] bg-white px-3 py-1.5 text-xs font-semibold text-[#00A651] sm:text-sm"
                >
                  {logoName ? `Change: ${logoName}` : "Upload company logo"}
                </button>
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-700 sm:text-sm">
                <input
                  type="checkbox"
                  className={chk}
                  checked={termsStep2}
                  onChange={(e) => setTermsStep2(e.target.checked)}
                />
                <span>
                  I confirm the details and the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    Terms
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00A651] py-2.5 text-sm font-bold text-white transition hover:bg-[#008f45] disabled:opacity-60"
              >
                {loading ? "Please wait…" : "Register as agent"}
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-slate-600 sm:text-sm">
              Don&apos;t need an agent account?{" "}
              <Link
                href="/"
                className="font-semibold text-[#00A651] hover:underline"
              >
                Back to arzepak home
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
