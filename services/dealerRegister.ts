import api from "@/lib/api";

export interface AuthRegisterBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface DealerRegisterBody {
  agencyName: string;
  city: string;
  companyEmail: string;
  address: string;
  logo?: string;
  whatsapp: string;
  bio: string;
  experience: number;
  areasServed: string[];
  cnic: string;
}

export interface AuthRegisterResponse {
  success: boolean;
  token?: string;
  user?: { _id: string; name: string; email: string; role: string };
}

export function registerUser(body: AuthRegisterBody) {
  return api.post<AuthRegisterResponse>("/auth/register", {
    name: body.name,
    email: body.email,
    password: body.password,
    phone: body.phone ?? "",
  });
}

export function loginUser(email: string, password: string) {
  return api.post<AuthRegisterResponse>("/auth/login", { email, password });
}

export function registerDealerProfile(body: DealerRegisterBody) {
  return api.post<{ success: boolean }>("/dealers/register", body);
}

/** One image, base64 data URL (as returned from FileReader). Requires auth cookie. */
export async function uploadDealerAsset(dataUrl: string): Promise<string> {
  const r = await api.post<{
    success: boolean;
    urls?: string[];
    images?: { url: string }[];
  }>("/upload", {
    images: [dataUrl],
    folder: "arzepak/dealers",
  });
  const url = r.urls?.[0] || r.images?.[0]?.url;
  if (!url) throw new Error("Upload did not return a URL");
  return url;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("Could not read file"));
    fr.readAsDataURL(file);
  });
}

/** Assumes local mobile already validated (10 digits, 3…). */
export function toPakistanE164FromLocalInput(local: string): string {
  let n = local.replace(/\D/g, "");
  if (n.startsWith("0")) n = n.slice(1);
  if (n.length === 10 && n[0] === "3") return `92${n}`;
  if (n.startsWith("92")) return n;
  return n ? `92${n}` : "";
}

/** Create user (session) + optional logo upload + dealer profile. */
export async function completeDealerRegistration(
  account: AuthRegisterBody,
  dealer: Pick<
    DealerRegisterBody,
    "agencyName" | "city" | "companyEmail" | "address"
  >,
  logoFile: File | null,
): Promise<{ token?: string }> {
  const reg = await registerUser(account);
  let logoUrl: string | undefined;
  if (logoFile && logoFile.size > 0) {
    const dataUrl = await fileToDataUrl(logoFile);
    try {
      logoUrl = await uploadDealerAsset(dataUrl);
    } catch {
      /* optional: register without logo */
    }
  }
  await registerDealerProfile({
    agencyName: dealer.agencyName,
    city: dealer.city,
    companyEmail: dealer.companyEmail,
    address: dealer.address,
    ...(logoUrl ? { logo: logoUrl } : {}),
    whatsapp: account.phone?.replace(/\D/g, "") || "",
    experience: 0,
    bio: "",
    areasServed: [],
    cnic: "",
  });
  return { token: reg.token };
}
