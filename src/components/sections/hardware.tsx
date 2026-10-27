"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import { Antenna, Cable, CloudDownload, DatabaseBackup, GlobeLock, ThermometerSun, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const features: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Antenna, title: "Dual-SIM 4G", body: "Switches network the moment one drops." },
  { icon: ThermometerSun, title: "−40 to +75 °C", body: "Built for sealed panels in Indian summers." },
  { icon: GlobeLock, title: "Access from anywhere", body: "An encrypted VPN tunnel to every site." },
  { icon: DatabaseBackup, title: "Zero data loss", body: "Stores readings offline, backfills on reconnect." },
  { icon: CloudDownload, title: "Remote updates", body: "New firmware without a site visit." },
  { icon: Cable, title: "Any device", body: "Isolated RS-485, Modbus TCP and digital I/O." },
];

export function Hardware() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="hardware" aria-labelledby="hardware-title" className="py-24 sm:py-32">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.h2
              id="hardware-title"
              variants={rise}
              className="text-[clamp(2rem,4vw,3.1rem)] leading-[1.05] font-bold tracking-[-0.03em]"
            >
              European-make hardware, built for Indian sites.
            </motion.h2>
            <motion.p variants={rise} className="mx-auto mt-5 max-w-[44ch] text-lg leading-relaxed">
              An industrial data logger running the Enerlynx edge SCADA engine.
            </motion.p>
          </motion.div>

          {/* one panel divided by hairlines, not six floating cards */}
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
            className="mt-16 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map(({ icon: Icon, title, body }) => (
              <motion.li key={title} variants={rise} className="group bg-card p-7 sm:p-10">
                <span className="grid size-11 place-items-center rounded-lg bg-orange-wash text-orange-deep transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]">
                  <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-[-0.015em]">{title}</h3>
                <p className="mt-1.5 text-muted-foreground">{body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </Container>
      </section>
    </MotionConfig>
  );
}