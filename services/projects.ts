import api from "@/lib/api";
import type { ProjectCardPreview, ProjectDetail, ProjectListItem } from "@/types/project";

export type ProjectsListResponse = {
  success: boolean;
  data: ProjectListItem[] | ProjectCardPreview[];
  total: number;
  pages: number;
};

export type ProjectDetailResponse = {
  success: boolean;
  data: ProjectDetail;
};

const qs = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

/** Public project catalog (paged). */
export function getProjectsList(params: { page?: number; limit?: number }) {
  return api.get<ProjectsListResponse>(`/projects${qs({ page: params.page, limit: params.limit })}`);
}

/**
 * Featured strip on home (same public endpoint; backend sorts by -createdAt).
 * `sort` is accepted for future API use; current backend ignores it.
 */
export function getProjectsPreview(params: { limit?: number; sort?: string }) {
  return api.get<ProjectsListResponse>(`/projects${qs({ limit: params.limit, sort: params.sort })}`);
}

export function getProjectBySlug(slug: string) {
  return api.get<ProjectDetailResponse>(`/projects/${encodeURIComponent(slug)}`);
}
