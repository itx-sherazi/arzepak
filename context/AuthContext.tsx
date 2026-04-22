"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "DEALER" | "ADMIN";
}

export interface DealerProfile {
  _id: string;
  cnic?: string;
  status?: string;
  agencyName?: string;
}

interface AuthCtx {
  user: User | null;
  dealer: DealerProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ role: string; token?: string; dealer: DealerProfile | null }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dealer, setDealer] = useState<DealerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const r = await api.get<{ success: boolean; user?: User; dealer?: DealerProfile | null }>("/auth/me");
      if (r.success) {
        setUser(r.user ?? null);
        setDealer(r.dealer ?? null);
      } else {
        setUser(null);
        setDealer(null);
      }
    } catch {
      setUser(null);
      setDealer(null);
    }
  };

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api.post<{ success: boolean; user: User; token?: string }>("/auth/login", { email, password });
    let nextDealer: DealerProfile | null = null;
    try {
      const me = await api.get<{ success: boolean; user?: User; dealer?: DealerProfile | null }>("/auth/me");
      if (me.success) {
        setUser(me.user ?? null);
        nextDealer = me.dealer ?? null;
        setDealer(nextDealer);
      } else {
        setUser(r.user);
        setDealer(null);
      }
    } catch {
      setUser(r.user);
      setDealer(null);
    }
    return { role: r.user.role, token: r.token as string | undefined, dealer: nextDealer };
  };

  const logout = async () => {
    await api.post("/auth/logout", {});
    setUser(null);
    setDealer(null);
  };

  const refreshUser = () => fetchMe();

  return (
    <Ctx.Provider value={{ user, dealer, loading, login, logout, refreshUser }}>{children}</Ctx.Provider>
  );
}
