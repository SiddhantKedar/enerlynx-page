import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

// required for the static export (output: "export")
export const dynamic = "force-static";

/** Written to /sitemap.xml at build time. Add an entry here for every new page. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
