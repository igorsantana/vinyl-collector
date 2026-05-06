import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Toaster } from "sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vinyl Catalog — AI Record Recognition",
  description: "Scan and catalog your vinyl record collection with AI-powered recognition. Identify albums instantly from photos.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vinyl Catalog",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col" style={{ background: "var(--background)" }}>
        <Header />
        <main className="flex-1 pb-24 scroll-container">{children}</main>
        <BottomNav />
        <Toaster position="top-center" theme="dark" richColors toastOptions={{ style: { background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--foreground)" } }} />
      </body>
    </html>
  );
}
