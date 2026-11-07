"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import { ArrowLeft, ArrowRight, ImageIcon, Lock } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/**
 * Portal screens, in order. Each one loads /public/portal/<id>.webp; until that file
 * exists a placeholder shows the expected name. No code change needed to add one.
 * Screenshots: 1880 × 904 WebP (about 2.08 : 1), cropped from the top-left of a full-width capture.
 */
const screens: { id: string; title: string; caption: string; path: string }[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    caption: "Every site and every customer, in one login.",
    path: "/portfolio",
  },
  {
    id: "plant",
    title: "Plant overview",
    caption: "Live status, power against capacity, energy and irradiation.",
    path: "/plant",
  },
  {
    id: "inverters",
    title: "Inverters",
    caption: "Every inverter live, with efficiency and PR side by side.",
    path: "/inverters",
  },
  {
    id: "trends",
    title: "1-minute trends",
    caption: "Every cloud, ramp and grid event, as it happens.",
    path: "/trends",
  },
];

const portalHost = site.portalUrl.replace(/^https?:\/\//, "");

function Screen({ screen }: { screen: (typeof screens)[number] }) {
  const [missing, setMissing] = useState(false);
  if (!missing) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
      <img
        src={`/portal/${screen.id}.webp`}
        onError={() => setMissing(true)}
        alt={`Enerlynx portal, ${screen.title.toLowerCase()} screen`}
        className="block size-full object-contain object-top"
        loading="lazy"
        draggable={false}
      />
    );
  }
  return (
    <div className="grid size-full place-items-center bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgba(27,26,22,.025)_14px_15px)]">
      <div className="text-center">
        <ImageIcon className="mx-auto size-8 text-border-strong" strokeWidth={1.5} aria-hidden />
        <p className="mt-3 font-mono text-xs text-muted-foreground">public/portal/{screen.id}.webp</p>
      </div>
    </div>
  );
}

export function Portal() {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    // starts at 0, so only follow changes
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const current = screens[index];

  return (
    <MotionConfig reducedMotion="user">
      <section id="portal" aria-labelledby="portal-title" className="relative isolate overflow-hidden border-b bg-card py-16 sm:py-24">
        {/* backdrop: fine dots fading up from the bottom edge, and a warm glow behind the window */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_top,#000,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(225,113,0,.10),transparent)]"
        />
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.h2
              id="portal-title"
              variants={rise}
              className="text-[clamp(2rem,4vw,3.1rem)] leading-[1.05] font-bold tracking-[-0.03em]"
            >
              Your whole fleet, one login.
            </motion.h2>
            <motion.p variants={rise} className="mx-auto mt-5 max-w-[40ch] text-lg leading-relaxed">
              Runs in any browser or phone. Nothing to install.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease }}
            className="mx-auto mt-10 w-full max-w-[min(60rem,calc((100svh-16rem)*2))]"
          >
            {/* screen picker */}
            <div role="tablist" aria-label="Portal screens" className="mx-auto mb-5 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-muted p-1">
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={index === i}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    index === i ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {index === i && (
                    <motion.span
                      layoutId="portal-tab"
                      className="absolute inset-0 rounded-full bg-card shadow-[0_1px_2px_rgba(27,26,22,.08),0_2px_8px_-2px_rgba(27,26,22,.12)]"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative">{s.title}</span>
                </button>
              ))}
            </div>

            {/* browser window */}
            <div className="overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgba(27,26,22,.05),0_40px_80px_-32px_rgba(27,26,22,.35)]">
              <div className="relative flex h-10 items-center border-b bg-secondary/70 px-4 sm:h-11">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-3 rounded-full bg-[#ff5f57]" />
                  <span className="size-3 rounded-full bg-[#febc2e]" />
                  <span className="size-3 rounded-full bg-[#28c840]" />
                </span>
                <div className="ml-3 flex h-7 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-card px-3 text-xs text-muted-foreground sm:absolute sm:left-1/2 sm:ml-0 sm:w-[min(60%,22rem)] sm:flex-none sm:-translate-x-1/2">
                  <Lock className="size-3" aria-hidden />
                  <span className="truncate">
                    {portalHost}
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={current.path}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {current.path}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>
              </div>

              <Carousel setApi={setApi} opts={{ loop: false }} aria-label="Portal screenshots">
                <CarouselContent className="ml-0">
                  {screens.map((s) => (
                    <CarouselItem key={s.id} className="pl-0" aria-label={s.title}>
                      <div className="aspect-[1880/904] bg-background">
                        <Screen screen={s} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* caption and arrows */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={current.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-[0.9375rem]"
                  aria-live="polite"
                >
                  <span className="font-semibold text-foreground">{current.title}.</span> {current.caption}
                </motion.p>
              </AnimatePresence>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  onClick={() => api?.scrollPrev()}
                  disabled={index === 0}
                  aria-label="Previous screen"
                >
                  <ArrowLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  onClick={() => api?.scrollNext()}
                  disabled={index === screens.length - 1}
                  aria-label="Next screen"
                >
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}