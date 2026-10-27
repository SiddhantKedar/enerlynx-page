import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/lib/site";

/*
 * Icons and the social preview image come from files in this folder:
 *   favicon.ico          browser tab fallback + Google search results
 *   icon.svg             browser tab (switches colours in dark mode)
 *   apple-icon.png       iPhone / iPad home screen
 *   opengraph-image.png  preview card on WhatsApp, LinkedIn, X, Slack
 * Next.js adds the <link> and <meta> tags for them automatically.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f3",
};

/** Tells Google who the company is (name, logo, contacts). Shown in knowledge panels. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/apple-icon.png`,
  description: site.description,
  email: site.email.sales,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  contactPoint: [
    { "@type": "ContactPoint", contactType: "sales", email: site.email.sales, areaServed: "IN" },
    { "@type": "ContactPoint", contactType: "customer support", email: site.email.support, areaServed: "IN" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        <SiteHeader />
        <main id="top" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
