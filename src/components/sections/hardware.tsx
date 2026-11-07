"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import { Antenna, Cable, CloudDownload, DatabaseBackup, GlobeLock, ThermometerSun, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

type Feature = { icon: LucideIcon; title: string; body: string };

/** Left of the device, then right. Order on phones: left list, then right list. */
const left: Feature[] = [
  { icon: Antenna, title: "Dual-SIM 4G", body: "Switches network the moment one drops." },
  { icon: ThermometerSun, title: "−40 to +75 °C", body: "Keeps running in sealed panels and extreme heat." },
  { icon: GlobeLock, title: "Access from anywhere", body: "An encrypted VPN tunnel to every site." },
];
const right: Feature[] = [
  { icon: DatabaseBackup, title: "Zero data loss", body: "Stores readings offline, backfills on reconnect." },
  { icon: CloudDownload, title: "Remote updates", body: "New firmware without a site visit." },
  { icon: Cable, title: "Any device", body: "Isolated RS-485, Modbus TCP and digital I/O." },
];

/* ───────────────────────── the device drawing ───────────────────────── */

const LEDS = [
  { label: "PWR", color: "var(--brand-olive)", blink: false },
  { label: "4G", color: "var(--brand-orange)", blink: true },
  { label: "SIM1", color: "var(--brand-olive)", blink: false },
  { label: "SIM2", color: "var(--border-strong)", blink: false },
  { label: "VPN", color: "var(--brand-olive)", blink: false },
];

function Device() {
  return (
    <svg viewBox="0 -24 260 364" className="h-auto w-full" role="img" aria-label="Enerlynx edge data logger">
      {/* antennas with signal arcs */}
      {[78, 182].map((x, i) => (
        <g key={x}>
          <rect x={x - 5} y={22} width={10} height={44} rx={5} fill="var(--brand-ink)" />
          <rect x={x - 8} y={62} width={16} height={10} rx={2} fill="#3a3832" />
          {[14, 24].map((r, j) => (
            <motion.path
              key={r}
              d={`M ${x - r} ${26 - r * 0.3} A ${r} ${r} 0 0 1 ${x + r} ${26 - r * 0.3}`}
              fill="none"
              stroke="var(--brand-orange)"
              strokeWidth={2}
              strokeLinecap="round"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5 + j * 0.25, ease: "easeInOut" }}
            />
          ))}
        </g>
      ))}

      {/* body */}
      <rect x={30} y={70} width={200} height={240} rx={18} fill="var(--card)" stroke="var(--border-strong)" strokeWidth={1.5} />
      <rect x={30} y={70} width={200} height={40} rx={18} fill="var(--secondary)" />
      <rect x={30} y={92} width={200} height={18} fill="var(--secondary)" />
      <line x1={30} x2={230} y1={110} y2={110} stroke="var(--border-strong)" />

      {/* brand strip */}
      <rect x={48} y={84} width={4} height={14} rx={2} fill="var(--brand-orange)" />
      <text x={58} y={95} className="fill-foreground text-[11px] font-semibold">EDGE SCADA</text>

      {/* LEDs */}
      {LEDS.map((led, i) => {
        const x = 58 + i * 36;
        return (
          <g key={led.label}>
            {led.blink ? (
              <motion.circle
                cx={x}
                cy={138}
                r={5}
                fill={led.color}
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : (
              <circle cx={x} cy={138} r={5} fill={led.color} />
            )}
            <text x={x} y={157} textAnchor="middle" className="fill-muted-foreground font-mono text-[8px]">
              {led.label}
            </text>
          </g>
        );
      })}

      {/* display: a tiny live trace */}
      <rect x={48} y={172} width={164} height={58} rx={8} fill="var(--brand-ink)" />
      <motion.path
        d="M56 214 L72 210 L88 206 L104 207 L120 203 L136 204 L152 222 L160 222 L168 205 L184 202 L200 204"
        fill="none"
        stroke="var(--brand-orange)"
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
      />
      <text x={56} y={188} className="fill-white/60 font-mono text-[8px]">kW · 1 min</text>

      {/* ethernet ports */}
      {[56, 92].map((x) => (
        <g key={x}>
          <rect x={x} y={246} width={28} height={20} rx={3} fill="var(--secondary)" stroke="var(--border-strong)" />
          <rect x={x + 7} y={252} width={14} height={9} rx={1} fill="var(--border-strong)" />
        </g>
      ))}
      <motion.circle
        cx={88}
        cy={250}
        r={2}
        fill="var(--brand-olive)"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />

      {/* RS-485 terminal block */}
      <rect x={134} y={244} width={78} height={24} rx={3} fill="var(--brand-olive-wash)" stroke="var(--brand-olive)" strokeOpacity={0.4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={144 + i * 14.5} cy={256} r={3.5} fill="var(--card)" stroke="var(--brand-olive)" strokeOpacity={0.6} />
      ))}
      <text x={173} y={284} textAnchor="middle" className="fill-muted-foreground font-mono text-[8px]">RS-485 · DI/DO</text>

      {/* DIN rail clip */}
      <rect x={70} y={310} width={120} height={10} rx={2} fill="var(--border-strong)" />
    </svg>
  );
}

/* ───────────────────────── callouts ───────────────────────── */

function Callout({ f, side, index }: { f: Feature; side: "left" | "right"; index: number }) {
  const Icon = f.icon;
  const isLeft = side === "left";
  return (
    <motion.li variants={rise} className={cn("relative", isLeft ? "lg:text-right" : "lg:text-left")}>
      <div className={cn("flex items-center gap-2.5", isLeft && "lg:flex-row-reverse")}>
        <Icon className="size-5 shrink-0 text-orange" strokeWidth={1.8} aria-hidden />
        <h3 className="text-lg font-semibold tracking-[-0.01em]">{f.title}</h3>
      </div>
      <p className={cn("mt-1.5 text-[0.9375rem] text-muted-foreground lg:max-w-[26ch]", isLeft && "lg:ml-auto")}>
        {f.body}
      </p>

      {/* leader line to the device (desktop only) */}
      <motion.span
        aria-hidden
        variants={{
          hidden: { scaleX: 0 },
          show: { scaleX: 1, transition: { duration: 0.6, ease, delay: 0.3 + index * 0.08 } },
        }}
        className={cn(
          "absolute top-3 hidden h-px w-16 bg-border-strong lg:block xl:w-28",
          isLeft ? "left-full ml-5 origin-left" : "right-full mr-5 origin-right",
        )}
      >
        <span className={cn("absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-orange", isLeft ? "-right-0.5" : "-left-0.5")} />
      </motion.span>
    </motion.li>
  );
}

export function Hardware() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="hardware" aria-labelledby="hardware-title" className="relative isolate overflow-hidden py-16 sm:py-24">

        
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
              European-make hardware, built for reliability.
            </motion.h2>
            <motion.p variants={rise} className="mx-auto mt-5 max-w-[44ch] text-lg leading-relaxed">
              An industrial data logger running the Enerlynx edge SCADA engine.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="mt-12 grid items-center gap-12 sm:mt-16 lg:grid-cols-[1fr_minmax(15rem,20rem)_1fr] lg:gap-20 xl:gap-28"
          >
            {/* device: first on phones, centre on desktop */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } },
              }}
              className="relative mx-auto w-full max-w-[17rem] lg:order-2 lg:max-w-none"
            >
              {/* rings and glow behind the device */}
              <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(225,113,0,.14),transparent)]"
              />
              {[120, 165].map((s, i) => (
                <motion.span
                  key={s}
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border-strong"
                  style={{ width: `${s}%`, aspectRatio: "1" }}
                  animate={{ rotate: i ? -360 : 360 }}
                  transition={{ duration: 80 + i * 20, repeat: Infinity, ease: "linear" }}
                />
              ))}
              <Device />
            </motion.div>

            <ul className="space-y-10 lg:order-1 lg:space-y-14">
              {left.map((f, i) => (
                <Callout key={f.title} f={f} side="left" index={i} />
              ))}
            </ul>
            <ul className="space-y-10 lg:order-3 lg:space-y-14">
              {right.map((f, i) => (
                <Callout key={f.title} f={f} side="right" index={i + 3} />
              ))}
            </ul>
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}