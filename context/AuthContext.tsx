"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import {
  getAuthMe,
  postAuthLogin,
  postAuthLogout,
  type AuthDealerProfile,
  type AuthUser,
} from "@/services/auth";

type User = AuthUser;

export type DealerProfile = AuthDealerProfile;

interface AuthCtx {
  user: User | null;
  dealer: DealerProfile | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ role: string; token?: string; dealer: DealerProfile | null }>;
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
      const r = await getAuthMe();
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
    const r = await postAuthLogin({ email, password });
    let nextDealer: DealerProfile | null = null;
    try {
      const me = await getAuthMe();
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
    if (typeof window !== "undefined" && r.token) {
      sessionStorage.setItem("apiToken", r.token);
    }
    return {
      role: r.user.role,
      token: r.token as string | undefined,
      dealer: nextDealer,
    };
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem("apiToken");
    } catch {
      /* ignore */
    }
    await postAuthLogout();
    await nextAuthSignOut({ redirect: false });
    setUser(null);
    setDealer(null);
  };

  const refreshUser = () => fetchMe();

  return (
    <Ctx.Provider value={{ user, dealer, loading, login, logout, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
}
