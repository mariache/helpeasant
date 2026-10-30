import type { MetadataRoute } from "next";
import { BRAND, CAMPAIGN_TAGLINE, CAMPAIGN_TITLE } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${CAMPAIGN_TITLE} · ${BRAND}`,
    short_name: BRAND,
    description: CAMPAIGN_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f766e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
