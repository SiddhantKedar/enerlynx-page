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
  title: "Enerlynx | 1-Minute Solar Plant Monitoring & PM-KUSUM SLDC",
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
    // TODO(confirm): deck uses sales@, old site used info@
    sales: "sales@enerlynx.in",
    support: "support@enerlynx.in",
  },
} as const;

/** One-page site: every nav item is an in-page section anchor. */
export const navItems = [
  { label: "1-minute data", href: "#resolution", id: "resolution" },
  { label: "Hardware", href: "#hardware", id: "hardware" },
  { label: "How it works", href: "#how-it-works", id: "how-it-works" },
  { label: "PM-KUSUM", href: "#pm-kusum", id: "pm-kusum" },
  { label: "Portal", href: "#portal", id: "portal" },
] as const;
