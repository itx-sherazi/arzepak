"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { adminDashboardUrl, dealerDashboardUrl } from "@/lib/env";

const navLinks = [
  { label: "BUY", href: "/properties?purpose=SALE" },
  { label: "HOMES", href: "/properties?purpose=SALE&type=HOUSE" },
  { label: "PLOTS", href: "/properties?purpose=SALE&type=PLOT" },
  { label: "COMMERCIAL", href: "/properties?purpose=SALE&type=COMMERCIAL" },
  { label: "RENT", href: "/properties?purpose=RENT" },
  { label: "AGENTS", href: "/agents" },
  { label: "NEW PROJECTS", href: "/new-projects" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
    setUserMenuOpen(false);
  };

  const getDashboardUrl = () => {
    if (user?.role === "ADMIN")  return `${adminDashboardUrl}/dashboard`;
    if (user?.role === "DEALER") return `${dealerDashboardUrl}/dashboard`;
    return null;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Arze<span className="text-green-600">Pak</span>
            </span>
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
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-xl transition-colors">
                  <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <div className="text-sm font-semibold text-gray-800 truncate">{user.name}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded mt-1 inline-block ${user.role === "DEALER" ? "bg-blue-100 text-blue-700" : user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>{user.role}</span>
                    </div>
                    {getDashboardUrl() && (
                      <a href={getDashboardUrl()!}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard size={15} className="text-gray-400" />Dashboard
                      </a>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={15} />Logout
                    </button>
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
                  <div className="flex items-center gap-2 px-1 py-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.role}</div>
                    </div>
                  </div>
                  {getDashboardUrl() && (
                    <a href={getDashboardUrl()!} className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700">
                      <LayoutDashboard size={15} />Dashboard
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
