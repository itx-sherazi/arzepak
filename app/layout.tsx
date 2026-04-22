import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "arzepak – Pakistan's #1 Real Estate Portal",
  description: "Search, buy, sell and rent properties across Pakistan. Houses, apartments, plots, commercial — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-800 antialiased">
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
