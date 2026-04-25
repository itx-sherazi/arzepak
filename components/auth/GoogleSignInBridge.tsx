"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

/** After Google → NextAuth, syncs API JWT to sessionStorage. */
export function GoogleSignInBridge() {
  const { status, data: session } = useSession();
  const { refreshUser } = useAuth();
  const processedPairRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      processedPairRef.current = null;
      return;
    }
    if (!session) return;

    if (session.apiError) {
      toast.error(session.apiError);
      void signOut({ redirect: false });
      processedPairRef.current = null;
      return;
    }

    const token = session.apiAccessToken;
    if (!token) return;

    const key = token.slice(0, 20);
    if (processedPairRef.current === key) return;
    if (sessionStorage.getItem("apiToken") === token) {
      processedPairRef.current = key;
      return;
    }

    sessionStorage.setItem("apiToken", token);
    processedPairRef.current = key;

    void refreshUser();
  }, [status, session, refreshUser]);

  return null;
}
