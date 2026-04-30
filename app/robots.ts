import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/**
 * robots.txt — let crawlers index everything; point them at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
