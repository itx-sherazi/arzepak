/** Public site & API URLs. Override in `.env.local` for local dev (e.g. http://localhost:5000/api). */
function stripTrailingSlash(u: string) {
  return u.replace(/\/$/, "");
}

export const siteUrl = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "https://arzepak.com",
);
export const apiUrl = stripTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || "https://api.arzepak.com/api",
);
export const dealerDashboardUrl = stripTrailingSlash(
  process.env.NEXT_PUBLIC_DEALER_DASHBOARD_URL || "https://portal.arzepak.com",
);
export const adminDashboardUrl = stripTrailingSlash(
  process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL ||
    "https://dashboard.arzepak.com",
);
