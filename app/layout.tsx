import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterSW } from "@/components/RegisterSW";
import { BRAND, CAMPAIGN_EMOJI, CAMPAIGN_TAGLINE, CAMPAIGN_TITLE } from "@/lib/config";

const title = `${CAMPAIGN_TITLE} ${CAMPAIGN_EMOJI} · ${BRAND}`;

export const metadata: Metadata = {
  title,
  description: CAMPAIGN_TAGLINE,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: { title, description: CAMPAIGN_TAGLINE, siteName: BRAND },
  twitter: { card: "summary", title, description: CAMPAIGN_TAGLINE },
  appleWebApp: { capable: true, title: BRAND, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
