"use client";

import { useRef } from "react";
import { MotionConfig, motion, useInView, type Variants } from "motion/react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/* One inverter, minute by minute, 11:30 to 11:45. It trips at 11:42 and is back at 11:45. */
const MINUTES = 15;
const TRIP_FROM = 12; // 11:42
const TRIP_TO = 15; // back at 11:45 (exclusive)
const clock = (i: number) => `11:${String(30 + i).padStart(2, "0")}`;

/** Timing of the story, in seconds after the strip scrolls into view. */
const T = { bars: 0.15, trip: 1.2, labels: 1.7, verdict: 2.3 };

function TripStory() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <div ref={ref} className="rounded-xl border bg-background p-6 sm:p-10">
      <p className="text-sm text-muted-foreground">Inverter 4, one minute at a time</p>

      {/* the strip */}
      <div className="relative mt-12" role="img" aria-label="Inverter 4 runs normally from 11:30, trips at 11:42 and is back online at 11:45.">
        {/* event labels */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={seen ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: T.labels, duration: 0.5, ease }}
          className="absolute -top-9 -translate-x-1/2 text-sm font-semibold whitespace-nowrap text-foreground"
          style={{ left: `${((TRIP_FROM + 0.5) / MINUTES) * 100}%` }}
        >
          <span className="font-mono font-normal text-muted-foreground">11:42</span> Trip
        </motion.div>

        <div className="flex h-24 items-end gap-1 sm:gap-1.5">
          {Array.from({ length: MINUTES }, (_, i) => {
            const tripped = i >= TRIP_FROM && i < TRIP_TO;
            return (
              <div key={i} className="relative h-full flex-1">
                <motion.span
                  initial={{ scaleY: 0 }}
                  animate={
                    seen
                      ? { scaleY: tripped ? [0, 1, 0.04] : 1 }
                      : {}
                  }
                  transition={
                    tripped
                      ? { delay: T.bars + i * 0.05, duration: T.trip, times: [0, 0.4, 1], ease }
                      : { delay: T.bars + i * 0.05, duration: 0.5, ease }
                  }
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-full origin-bottom rounded-[3px]",
                    tripped ? "bg-ink" : "bg-orange",
                  )}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-baseline justify-between text-xs">
          <span className="font-mono text-muted-foreground">{clock(0)}</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={seen ? { opacity: 1 } : {}}
            transition={{ delay: T.labels + 0.3, duration: 0.5 }}
            className="text-sm font-semibold text-foreground"
          >
            <span className="font-mono font-normal text-muted-foreground">{clock(MINUTES)}</span> Back online
          </motion.span>
        </div>
      </div>

      {/* two readings of the same quarter hour */}
      <motion.dl
        initial="hidden"
        animate={seen ? "show" : "hidden"}
        variants={{ show: { transition: { staggerChildren: 0.2, delayChildren: T.verdict } } }}
        className="mt-10 grid border-t sm:grid-cols-2"
      >
        <motion.div variants={rise} className="border-b pt-6 pb-6 sm:border-r sm:border-b-0 sm:pr-8">
          <dt className="text-sm text-muted-foreground">Enerlynx sees</dt>
          <dd className="mt-1 text-xl font-semibold tracking-[-0.015em] text-foreground">
            Offline for 3 minutes, 11:42 to 11:45.
          </dd>
        </motion.div>
        <motion.div variants={rise} className="pt-6 sm:pl-8">
          <dt className="text-sm text-muted-foreground">A 15-minute average sees</dt>
          <dd className="mt-1 text-xl font-semibold tracking-[-0.015em] text-muted-foreground">
            80% output. Could be a cloud.
          </dd>
        </motion.div>
      </motion.dl>
    </div>
  );
}

export function Resolution() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="resolution" aria-labelledby="resolution-title" className="border-y bg-card py-24 sm:py-32">
        <Container className="max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="text-center"
          >
            <motion.h2
              id="resolution-title"
              variants={rise}
              className="text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.04] font-bold tracking-[-0.035em]"
            >
              A lot can happen in fifteen minutes.
            </motion.h2>
            <motion.p variants={rise} className="mx-auto mt-5 max-w-[42ch] text-lg leading-relaxed">
              Most monitoring keeps one average per quarter hour. Enerlynx keeps every minute.
            </motion.p>
          </motion.div>

          <div className="mt-14 sm:mt-16">
            <TripStory />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease }}
            className="mx-auto mt-14 max-w-[30ch] text-center text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug font-semibold tracking-[-0.02em] text-foreground"
          >
            Trips you can see. Dips you can explain. KPIs you can trust.
          </motion.p>
        </Container>
      </section>
    </MotionConfig>
  );
}