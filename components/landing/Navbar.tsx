"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut, ChevronDown, LayoutDashboard, ExternalLink } from "lucide-react";
import { adminDashboardUrl, dealerDashboardUrl } from "@/lib/env";

const navLinks = [
  { label: "BUY", href: "/properties?purpose=SALE" },
  { label: "HOMES", href: "/properties?purpose=SALE&type=HOUSE" },
  { label: "PLOTS", href: "/properties?purpose=SALE&type=PLOT" },
  { label: "COMMERCIAL", href: "/properties?purpose=SALE&type=COMMERCIAL" },
  { label: "RENT", href: "/properties?purpose=RENT" },
  // { label: "AGENTS", href: "/agents" },
  { label: "NEW PROJECTS", href: "/new-projects" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
    setUserMenuOpen(false);
  };

  const getDashboardUrl = () => {
    if (user?.role === "ADMIN") return `${adminDashboardUrl}/dashboard`;
    if (user?.role === "DEALER") return `${dealerDashboardUrl}/dashboard`;
    return null;
  };

  function isExternalOrigin(absoluteUrl: string): boolean {
    try {
      return new URL(absoluteUrl).origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  const dashboardUrl = getDashboardUrl();
  const dashboardExternal = dashboardUrl
    ? isExternalOrigin(dashboardUrl)
    : false;

  const displayName = (user?.name || "User").trim();
  const firstName = displayName.split(/\s+/)[0] || displayName;

  const roleBadge = (() => {
    if (!user?.role) return null;
    const cls =
      user.role === "DEALER"
        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
        : user.role === "ADMIN"
          ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200"
          : "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200";
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}
      >
        {user.role}
      </span>
    );
  })();

  useEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const el = userMenuRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setUserMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="ArzePak Logo" 
              className="h-full w-35 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="px-3 py-2 text-sm font-semibold tracking-wide text-gray-600 hover:text-green-600 transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Area */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className="group flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition hover:bg-gray-50"
                >
                  <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-emerald-600 to-green-500 text-white">
                    <span className="text-xs font-bold">
                      {user.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                  <span className="hidden max-w-[140px] truncate text-left text-sm font-semibold text-gray-800 sm:inline">
                    {firstName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`ml-0.5 shrink-0 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
                  >
                    <div className="border-b border-gray-200 px-3 py-2">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {displayName}
                      </div>
                      <div className="mt-1">{roleBadge}</div>
                    </div>

                    <div className="py-1">
                      {dashboardUrl && (
                        <a
                          href={dashboardUrl}
                          target={dashboardExternal ? "_blank" : undefined}
                          rel={dashboardExternal ? "noreferrer" : undefined}
                          onClick={(e) => {
                            setUserMenuOpen(false);
                            if (!dashboardExternal) return;
                            const token = sessionStorage.getItem("apiToken");
                            if (!token) return;
                            if (user?.role !== "DEALER") return;
                            e.preventDefault();
                            window.location.href = `${dealerDashboardUrl}/auth/sync#${encodeURIComponent(token)}`;
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
                        >
                          <LayoutDashboard size={16} className="text-gray-500" />
                          <span className="flex-1">Dashboard</span>
                          {dashboardExternal && (
                            <ExternalLink size={14} className="text-gray-400" />
                          )}
                        </a>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                  Dealer login
                </Link>
                <Link
                  href="/dealer/register"
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Join as dealer
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 mt-2">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="block px-3 py-3 text-sm font-semibold text-gray-600">
                {link.label}
              </a>
            ))}
            <div className="px-3 pt-3 border-t border-gray-100 mt-2 space-y-2">
              {user ? (
                <>
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {user.name}
                          </div>
                        </div>
                      </div>
                      {roleBadge}
                    </div>
                  {getDashboardUrl() && (
                    <a
                      href={getDashboardUrl()!}
                      target={dashboardExternal ? "_blank" : undefined}
                      rel={dashboardExternal ? "noreferrer" : undefined}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      <LayoutDashboard size={16} className="text-gray-500" />
                      Dashboard
                      {dashboardExternal && (
                        <ExternalLink size={14} className="text-gray-400" />
                      )}
                    </a>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-red-600">
                    <LogOut size={15}/>Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="text-center border border-green-600 text-green-600 py-2.5 rounded-lg text-sm font-semibold">
                    Dealer login
                  </Link>
                  <Link href="/dealer/register" className="text-center bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold">
                    Join as dealer
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
