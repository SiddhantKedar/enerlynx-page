"use client";

import { MotionConfig, motion, type Variants } from "motion/react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** What the gateway reads from, and where the data goes. */
const readsFrom = ["Inverters", "Energy meters", "Weather station", "Circuit breakers", "Annunciator"];
const reportsTo = ["Enerlynx portal", "TGREDCO / MNRE SLDC"];

/** Key facts from the company deck. */
const facts = [
  { value: "1 minute", label: "Data resolution, for every device on site" },
  { value: "−40 to +75 °C", label: "Operating range of the European-make logger" },
  { value: "Dual-SIM 4G", label: "Failover uplink with local buffering" },
  { value: "Any brand", label: "Inverters and meters over Modbus RTU / TCP" },
];

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease } },
};

function DeviceList({ title, items, tone }: { title: string; items: string[]; tone: "olive" | "orange" }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <motion.ul variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="mt-3 space-y-2.5">
        {items.map((item) => (
          <motion.li key={item} variants={fade} className="flex items-center gap-3 font-medium text-foreground">
            <span
              aria-hidden
              className={tone === "olive" ? "size-1.5 rounded-full bg-olive" : "size-1.5 rounded-full bg-orange"}
            />
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="hero" aria-labelledby="hero-title" className="relative pt-32 pb-20 sm:pt-44 sm:pb-28">
        <Container>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.09 } } }}
            className="grid gap-14 lg:grid-cols-12 lg:gap-12"
          >
            {/* message */}
            <div className="lg:col-span-8">
              <motion.p
                variants={rise}
                className="inline-flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1.5 text-sm font-medium text-foreground"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-wash px-2 py-0.5 text-xs font-semibold text-olive-deep">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-olive opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-olive" />
                  </span>
                  Live
                </span>
                TGREDCO-approved PM-KUSUM SLDC integration
              </motion.p>

              <motion.h1
                id="hero-title"
                variants={rise}
                className="mt-7 text-[clamp(2.5rem,6vw,4.6rem)] leading-[1.02] font-bold tracking-[-0.035em]"
              >
                Every minute of your solar plant, on record.
              </motion.h1>

              <motion.p variants={rise} className="mt-6 max-w-[56ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed">
                Enerlynx reads every inverter, meter and sensor at your plant once a minute, keeps the data safe on site
                when the network drops, and delivers it to your portal and the SLDC at the same time.
              </motion.p>

              <motion.div variants={rise} className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#contact">Book a demo</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#how-it-works">How it works</a>
                </Button>
              </motion.div>
            </div>

            {/* what connects to what */}
            <motion.aside
              variants={rise}
              aria-label="What Enerlynx connects"
              className="self-end rounded-xl border bg-card p-6 lg:col-span-4"
            >
              <motion.div
                variants={{ show: { transition: { staggerChildren: 0.25, delayChildren: 0.3 } } }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1"
              >
                <DeviceList title="Reads from" items={readsFrom} tone="olive" />
                <div className="hidden h-px bg-border lg:block" aria-hidden />
                <DeviceList title="Reports to" items={reportsTo} tone="orange" />
              </motion.div>
            </motion.aside>
          </motion.div>

          {/* key facts */}
          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
            className="mt-16 grid grid-cols-2 border-t lg:mt-20 lg:grid-cols-4"
          >
            {facts.map((f, i) => (
              <motion.div
                key={f.value}
                variants={rise}
                className={cn(
                  "py-6 pr-4 lg:py-8",
                  // two columns on phones/tablets: bottom rule under the first row, divider between columns
                  i < 2 && "border-b lg:border-b-0",
                  i % 2 === 1 && "border-l pl-4 sm:pl-6",
                  // one row of four on desktop
                  i > 0 && "lg:border-l lg:pl-6",
                )}
              >
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block text-[clamp(1.25rem,2.2vw,1.6rem)] font-bold tracking-[-0.02em] text-foreground">
                    {f.value}
                  </span>
                  <span className="mt-1.5 block text-[0.9375rem] leading-snug text-muted-foreground">{f.label}</span>
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </Container>
      </section>
    </MotionConfig>
  );
}
