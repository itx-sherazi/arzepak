import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token && apiBase) {
        try {
          const res = await fetch(`${apiBase}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });
          const data = (await res.json()) as { success?: boolean; token?: string; message?: string };
          if (res.ok && data.token) {
            token.apiAccessToken = data.token;
            token.apiError = undefined;
          } else {
            token.apiError = data.message || "Could not sign in with Google on the server";
            token.apiAccessToken = undefined;
          }
        } catch {
          token.apiError = "API unreachable — check NEXT_PUBLIC_API_URL and that the server is running";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.apiAccessToken) {
        (session as { apiAccessToken?: string }).apiAccessToken = token.apiAccessToken as string;
      }
      if (token.apiError) {
        (session as { apiError?: string }).apiError = token.apiError as string;
      }
      return session;
    },
  },
};
