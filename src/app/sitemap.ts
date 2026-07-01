import type { MetadataRoute } from "next";
import { destinyTypes } from "@/data/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mingge-personality.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/test", "/types", "/about", "/privacy"];
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...destinyTypes.map((type) => ({
      url: `${siteUrl}/result?type=${type.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
