"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Menu } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Tracks which section is under the header so its nav link can be marked. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        // the section that owns the most of the band wins
        let best: string | null = null;
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        });
        setActive(best);
      },
      // a band across the upper-middle of the viewport
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

const sectionIds = navItems.map((n) => n.id);

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = useActiveSection(sectionIds);

  // Hide while scrolling down past the hero, show again on any scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 120) setHidden(false);
      else if (Math.abs(y - lastY) > 6) setHidden(y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      // keep it visible while anything inside has keyboard focus
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "fixed inset-x-0 top-0 z-40 pt-3 transition-transform duration-300 ease-out-soft sm:pt-4",
        hidden && "-translate-y-[calc(100%+0.5rem)]",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex h-14 items-center justify-between gap-4 rounded-xl border pr-2 pl-4 transition-[background-color,box-shadow,border-color] duration-300 ease-out-soft sm:h-16 sm:pl-5",
            scrolled
              ? "border-border bg-card/95 shadow-[0_1px_2px_rgba(27,26,22,.04),0_12px_32px_-16px_rgba(27,26,22,.22)] backdrop-blur-md backdrop-saturate-150"
              : "border-border/70 bg-card/60 backdrop-blur-sm",
          )}
        >
          <a href="#top" aria-label="Enerlynx, back to top" className="shrink-0 rounded-sm">
            <Logo />
          </a>

          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative block rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors",
                        isActive ? "text-foreground" : "text-body hover:text-foreground",
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-orange"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <a href={site.portalUrl} target="_blank" rel="noopener">
                Portal login
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </a>
            </Button>
            <Button asChild className="hidden sm:inline-flex">
              <a href="#contact">Book a demo</a>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="px-6 pt-6 pb-8">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Jump to a section of the page</SheetDescription>
                <Logo className="mb-6" />
                <nav aria-label="Sections">
                  <ul className="flex flex-col">
                    {navItems.map((item) => (
                      <li key={item.id}>
                        <SheetClose asChild>
                          <a
                            href={item.href}
                            className="flex items-center justify-between border-b py-4 text-lg font-semibold text-foreground"
                          >
                            {item.label}
                            {active === item.id && (
                              <span className="size-2 rounded-full bg-orange" aria-hidden />
                            )}
                          </a>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-auto flex flex-col gap-2.5">
                  <SheetClose asChild>
                    <Button asChild size="lg">
                      <a href="#contact">Book a demo</a>
                    </Button>
                  </SheetClose>
                  <Button asChild size="lg" variant="outline">
                    <a href={site.portalUrl} target="_blank" rel="noopener">
                      Portal login
                      <ArrowUpRight className="size-4 text-muted-foreground" />
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
