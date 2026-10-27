import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

// required for the static export (output: "export")
export const dynamic = "force-static";

/** Written to /robots.txt at build time. Lets every search engine crawl the site. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
