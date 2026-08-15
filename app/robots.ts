import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * /robots.txt — що можна обходити пошуковим роботам.
 *
 * Блог відкритий увесь, тому правило одне: можна все. Головне тут інше —
 * рядок sitemap. Саме за ним робот знаходить карту сайту, не вгадуючи
 * її адресу.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
