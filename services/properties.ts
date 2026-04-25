import api from "@/lib/api";
import type { PropertyDetail, PropertyListItem } from "@/types/property";

export type PropertiesListResponse = {
  data: PropertyListItem[];
  total: number;
  pages: number;
};

export type PropertyDetailResponse = {
  success: boolean;
  data: PropertyDetail;
};

/** `queryString` e.g. `limit=20&page=1&sort=-createdAt&purpose=SALE` (no leading `?`). */
export function fetchPropertiesList(queryString: string) {
  const qs = queryString.replace(/^\?/, "");
  return api.get<PropertiesListResponse>(`/properties${qs ? `?${qs}` : ""}`);
}

export function fetchPropertyBySlug(slug: string) {
  return api.get<PropertyDetailResponse>(`/properties/${encodeURIComponent(slug)}`);
}
