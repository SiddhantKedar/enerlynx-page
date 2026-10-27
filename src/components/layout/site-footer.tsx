import { ArrowUp, ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { navItems, site } from "@/lib/site";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-sm font-semibold text-white">{children}</h2>;
}

const linkClass =
  "text-[0.9375rem] text-white/60 transition-colors hover:text-white focus-visible:text-white";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/60">
      <Container className="pt-16 pb-8 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* brand block */}
          <div className="lg:col-span-5">
            <Logo tone="dark" />
            <p className="mt-5 max-w-[38ch] text-[0.9375rem] leading-relaxed">
              Solar plant monitoring at 1-minute resolution, on European-make edge hardware,
              designed and commissioned in {site.city.split(",")[0]}.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[.04] px-3 py-2 text-sm text-white/80">
              <ShieldCheck className="size-4 text-[#8fbf3f]" aria-hidden />
              TGREDCO-approved PM-KUSUM SLDC integration
            </p>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <FooterHeading>On this page</FooterHeading>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a href={item.href} className={linkClass}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <FooterHeading>Contact</FooterHeading>
              <ul className="space-y-3">
                <li>
                  <a href={`mailto:${site.email.sales}`} className={linkClass}>
                    {site.email.sales}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email.support}`} className={linkClass}>
                    {site.email.support}
                  </a>
                </li>
                <li className="flex items-start gap-2 text-[0.9375rem]">
                  <MapPin className="mt-1 size-4 shrink-0 text-white/40" aria-hidden />
                  {site.city}
                </li>
              </ul>
            </div>

            <div>
              <FooterHeading>Customers</FooterHeading>
              <ul className="space-y-3">
                <li>
                  <a
                    href={site.portalUrl}
                    target="_blank"
                    rel="noopener"
                    className={`${linkClass} inline-flex items-center gap-1`}
                  >
                    Portal login <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </li>
                <li>
                  <a href="#contact" className={linkClass}>
                    Book a demo
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center">
          <p className="text-white/40">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <a href="#top" className={`${linkClass} inline-flex items-center gap-1.5 text-sm`}>
            <ArrowUp className="size-3.5" aria-hidden />
            Back to top
          </a>
        </div>
      </Container>
    </footer>
  );
}
