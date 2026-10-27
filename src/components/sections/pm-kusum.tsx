"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import { Landmark, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const ends = [
  { title: "Solar plant end", lines: ["ELX-GW100 control panel", "Inverters, MFM, weather station, breakers"] },
  { title: "Substation end", lines: ["Industrial 4G metering node", "Import and export meter"] },
];

/**
 * Lines joining both ends to the SLDC, drawn in order: a stem down from the SLDC,
 * a bar across, then a drop into each card. Desktop only.
 */
function Uplinks() {
  const line = "absolute bg-white/25";
  const grow = (axis: "x" | "y", delay: number): Variants => ({
    hidden: axis === "x" ? { scaleX: 0 } : { scaleY: 0 },
    show: {
      ...(axis === "x" ? { scaleX: 1 } : { scaleY: 1 }),
      transition: { delay, duration: 0.45, ease },
    },
  });
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-16 md:block" aria-hidden>
      {/* stem from the SLDC */}
      <motion.span variants={grow("y", 0.5)} className={`${line} top-0 left-1/2 h-1/2 w-px origin-top`} />
      {/* bar across, from the centre out (split in two halves) */}
      <motion.span variants={grow("x", 0.9)} className={`${line} top-1/2 right-1/2 left-1/4 h-px origin-right`} />
      <motion.span variants={grow("x", 0.9)} className={`${line} top-1/2 right-1/4 left-1/2 h-px origin-left`} />
      {/* drops into each card */}
      <motion.span variants={grow("y", 1.3)} className={`${line} top-1/2 left-1/4 h-1/2 w-px origin-top`} />
      <motion.span variants={grow("y", 1.3)} className={`${line} top-1/2 right-1/4 h-1/2 w-px origin-top`} />
    </div>
  );
}

export function PmKusum() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="pm-kusum" aria-labelledby="kusum-title" className="relative overflow-hidden bg-ink py-24 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(55%_100%_at_50%_100%,rgba(225,113,0,.14),transparent)]"
        />

        <Container className="relative">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.p
              variants={rise}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.04] px-3 py-1 text-sm font-medium text-white/80"
            >
              <ShieldCheck className="size-4 text-[#a9d35a]" aria-hidden />
              TGREDCO approved
            </motion.p>
            <motion.h2
              id="kusum-title"
              variants={rise}
              className="mt-6 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.04] font-bold tracking-[-0.035em] text-white"
            >
              Ready for PM-KUSUM.
            </motion.h2>
            <motion.p variants={rise} className="mx-auto mt-5 max-w-[44ch] text-lg leading-relaxed text-white/65">
              Metering at both ends of the line, reporting live to the Telangana SLDC.
            </motion.p>
          </motion.div>

          {/* SLDC on top, the two ends below, joined by uplinks */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.15 } } }}
            className="mx-auto mt-16 max-w-3xl"
          >
            <motion.div variants={rise} className="mx-auto w-fit text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full border border-orange/40 bg-orange/10 text-orange">
                <Landmark className="size-6" strokeWidth={1.6} aria-hidden />
              </span>
              <p className="mt-4 text-lg font-semibold text-white">Telangana SLDC</p>
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-white/55">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#8fbf3f] opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[#8fbf3f]" />
                </span>
                Annexure-2 telemetry, live in production
              </p>
            </motion.div>

            <div className="relative mt-4 pt-16 md:mt-6">
              <Uplinks />
              {/* phone-only connector */}
              <motion.span
                variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { delay: 0.4, duration: 0.5, ease } } }}
                className="absolute top-0 left-1/2 h-12 w-px origin-top bg-[repeating-linear-gradient(180deg,rgba(255,255,255,.28)_0_4px,transparent_4px_8px)] md:hidden"
                aria-hidden
              />

              <div className="grid gap-4 md:grid-cols-2 md:gap-8">
                {ends.map((end) => (
                  <motion.div
                    key={end.title}
                    variants={rise}
                    className="rounded-xl border border-white/10 bg-white/[.04] p-6 text-center sm:p-7"
                  >
                    <h3 className="text-lg font-semibold text-white">{end.title}</h3>
                    <ul className="mt-2 space-y-1 text-[0.9375rem] text-white/60">
                      {end.lines.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}
