import type { MetadataRoute } from "next";
import { LEGAL_LINKS, LEGAL_UPDATED_ISO } from "@/lib/legal";

const BASE = "https://www.epsos.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalUpdated = new Date(LEGAL_UPDATED_ISO);

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/control`, changeFrequency: "monthly", priority: 0.8 },
    ...LEGAL_LINKS.map((l) => ({
      url: `${BASE}${l.href}`,
      lastModified: legalUpdated,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
