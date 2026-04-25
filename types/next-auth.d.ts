import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    apiAccessToken?: string;
    apiError?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiAccessToken?: string;
    apiError?: string;
  }
}
