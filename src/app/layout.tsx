import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/seo";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a2e",
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Life in Aichi — Benefits & Support Guide for Foreign Residents",
    template: "%s — Life in Aichi",
  },
  description:
    "Find government benefits, grants, and support programs available to foreign residents in Aichi, Japan. Multilingual guide in English, Vietnamese, Filipino, and Japanese.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Life in Aichi",
    description: "Benefits & Support Guide for Foreign Residents in Aichi, Japan",
    url: "/",
    siteName: "Life in Aichi",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
