"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleSignInBridge } from "@/components/auth/GoogleSignInBridge";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AuthProvider>
        <GoogleSignInBridge />
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
