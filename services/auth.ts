import api from "@/lib/api";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "DEALER" | "ADMIN";
}

export interface AuthDealerProfile {
  _id: string;
  cnic?: string;
  status?: string;
  agencyName?: string;
  companyEmail?: string;
  address?: string;
}

export interface LoginResponse {
  success: boolean;
  user: AuthUser;
  token?: string;
}

export interface MeResponse {
  success: boolean;
  user?: AuthUser;
  dealer?: AuthDealerProfile | null;
}

export function postAuthLogin(body: { email: string; password: string }) {
  return api.post<LoginResponse>("/auth/login", body);
}

export function getAuthMe() {
  return api.get<MeResponse>("/auth/me");
}

export function postAuthLogout() {
  return api.post<{ success: boolean }>("/auth/logout", {});
}
