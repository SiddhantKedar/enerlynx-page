/**
 * Single source of truth for site-wide content: navigation, contact details
 * and URLs. Change copy here instead of hunting through components.
 */

export const site = {
  name: "Enerlynx",
  legalName: "Enerlynx Private Limited",
  url: "https://www.enerlynx.in",
  portalUrl: "https://app.enerlynx.in",
  city: "Hyderabad, Telangana",
  /** Browser tab and Google result title. Keep under ~60 characters. */
  title: "Enerlynx | Solar Scada | Power Plant Control | Forecasting",

  /** Google result snippet. Keep between ~120 and 160 characters. */
  description:
    "1-minute solar plant monitoring on European-make edge hardware, with TGREDCO-approved PM-KUSUM SLDC integration. Built in Hyderabad for Indian solar plants.",
  keywords: [
    "solar plant monitoring",
    "solar SCADA",
    "PM-KUSUM SLDC integration",
    "TGREDCO",
    "solar data logger",
    "inverter monitoring",
    "solar monitoring India",
    "Hyderabad",
  ],
  email: {
    // The only two public addresses on the site.
    sales: "sales@enerlynx.in",
    support: "support@enerlynx.in",
  },
  address: {
    lines: ["6th Floor, Trendz Techpark, Plot No 543", "Kakatiya Hills, Madhapur", "Hyderabad, Telangana 500081"],
    full: "6th Floor, Trendz Techpark, Plot No 543, Kakatiya Hills, Madhapur, Hyderabad, Telangana 500081",
    street: "6th Floor, Trendz Techpark, Plot No 543, Kakatiya Hills, Madhapur",
    locality: "Hyderabad",
    region: "Telangana",
    postalCode: "500081",
  },
} as const;

/** One-page site: every nav item is an in-page section anchor. */
export const navItems = [
  { label: "Resolution", href: "#resolution", id: "resolution" },
  { label: "Hardware", href: "#hardware", id: "hardware" },
  { label: "How it works", href: "#how-it-works", id: "how-it-works" },
  { label: "PM-KUSUM", href: "#pm-kusum", id: "pm-kusum" },
  { label: "Portal", href: "#portal", id: "portal" },
] as const;
