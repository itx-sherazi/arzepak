import type { NearbyItem, ProjectDetail } from "@/types/project";

export const DEFAULT_NEARBY_LABELS = ["Schools", "Hospitals", "Parks & mosques", "Shopping & markets"] as const;

export const FEATURE_LABELS: Record<string, string> = {
  mainFeatures: "Main Features",
  plotFeatures: "Plot Features",
  businessComm: "Business & Communication",
  nearbyFacilities: "Nearby Facilities",
  otherFacilities: "Other Facilities",
};

export function isTrustedMapsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.replace(/^www\./, "");
    return (
      host === "google.com" ||
      host === "maps.google.com" ||
      host.endsWith(".google.com") ||
      host === "goo.gl" ||
      host.endsWith(".goo.gl") ||
      host === "maps.app.goo.gl"
    );
  } catch {
    return false;
  }
}

export function googleMapsNearbyUrl(project: ProjectDetail, category: string) {
  const q = `${category} near ${project.address}, ${project.city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function nearbyItemHref(project: ProjectDetail, item: NearbyItem) {
  const u = item.mapsUrl?.trim();
  if (u && isTrustedMapsUrl(u)) return u;
  return googleMapsNearbyUrl(project, item.label);
}
