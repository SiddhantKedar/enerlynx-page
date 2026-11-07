"use client";

import { useEffect, useRef, useState } from "react";
import {
  MotionConfig,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-15% 0px" } } as const;

/* ───────────────────────── the replay ───────────────────────── */

/** Inverter 4, one reading per minute from 11:30 to 11:45. It trips at 11:42 and is back at 11:45. */
const READINGS = [0.86, 0.88, 0.87, 0.89, 0.9, 0.88, 0.89, 0.91, 0.9, 0.89, 0.9, 0.88, 0, 0, 0, 0.87];
const MINUTES = 15;
const TRIP_FROM = 12;
const TRIP_TO = 15;
const clock = (i: number) => `11:${String(30 + i).padStart(2, "0")}`;

const W = 1000;
const H = 220;
const px = (i: number) => (i / MINUTES) * W;
const py = (v: number) => H - 18 - v * (H - 56);
const LINE = READINGS.map((v, i) => `${i ? "L" : "M"}${px(i)},${py(v)}`).join("");
const AREA = `${LINE}L${W},${H}L0,${H}Z`;

/** One loop: 7 s to play the quarter hour, 3.5 s to hold on the verdict. */
const PLAY = 7;
const CYCLE = 10.5;

function Replay() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const progress = useMotionValue(reduce ? 1 : 0);
  const [minute, setMinute] = useState(reduce ? MINUTES : 0);
  const done = minute >= MINUTES;

  const start = useRef<number | null>(null);
  useAnimationFrame((t) => {
    if (!visible || reduce) return;
    if (start.current === null) start.current = t;
    const cycle = ((t - start.current) / 1000) % CYCLE;
    progress.set(Math.min(cycle / PLAY, 1));
  });
  useMotionValueEvent(progress, "change", (v) => {
    const m = Math.floor(v * MINUTES + 1e-6);
    if (m !== minute) setMinute(m);
  });

  const clipW = useTransform(progress, (v) => v * W);
  const headX = useTransform(progress, (v) => v * W);

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border bg-card shadow-[0_1px_2px_rgba(27,26,22,.04),0_30px_70px_-40px_rgba(27,26,22,.35)]">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-3.5 sm:px-6">
        <p className="text-sm">
          <span className="font-semibold text-foreground">Inverter 4</span>
          <span className="text-muted-foreground"> · active power, one reading per minute</span>
        </p>
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground tabular-nums">
          {clock(Math.min(minute, MINUTES))}
        </span>
      </div>

      {/* chart */}
      <div className="relative px-2 pt-6 sm:px-4">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-44 w-full sm:h-56" aria-hidden>
          <defs>
            <clipPath id="replay-clip">
              <motion.rect x={0} y={0} height={H} width={clipW} />
            </clipPath>
            <linearGradient id="replay-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* trip window shading */}
          <rect x={px(TRIP_FROM)} y={0} width={px(TRIP_TO) - px(TRIP_FROM)} height={H} fill="var(--brand-ink)" opacity={0.04} />

          {[0.25, 0.5, 0.75, 1].map((v) => (
            <line key={v} x1={0} x2={W} y1={py(v)} y2={py(v)} stroke="var(--border)" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
          ))}

          <g clipPath="url(#replay-clip)">
            <path d={AREA} fill="url(#replay-fill)" />
            <path d={LINE} fill="none" stroke="var(--brand-orange)" strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </g>

          <motion.line style={{ x: headX }} x1={0} x2={0} y1={0} y2={H} stroke="var(--brand-ink)" strokeOpacity={0.5} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* trip label, appears once the playhead reaches it */}
        <motion.div
          animate={{ opacity: minute > TRIP_FROM ? 1 : 0, y: minute > TRIP_FROM ? 0 : 6 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute bottom-6 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-xs font-semibold whitespace-nowrap text-white"
          style={{ left: `${((TRIP_FROM + 1.5) / MINUTES) * 100}%` }}
        >
          Trip, 3 min
        </motion.div>
      </div>

      {/* one dot per reading */}
      <div className="flex gap-1 px-4 pt-3 pb-5 sm:gap-1.5 sm:px-6" aria-hidden>
        {Array.from({ length: MINUTES }, (_, i) => {
          const taken = i < minute;
          const tripped = i >= TRIP_FROM && i < TRIP_TO;
          return (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-200",
                !taken && "bg-border",
                taken && !tripped && "bg-orange",
                taken && tripped && "bg-ink",
              )}
            />
          );
        })}
      </div>

      {/* verdict */}
      <dl className="grid border-t sm:grid-cols-2">
        <div className="border-b px-5 py-5 sm:border-r sm:border-b-0 sm:px-6">
          <dt className="flex items-center justify-between text-sm text-muted-foreground">
            Enerlynx
            <span className="font-mono text-xs">{Math.min(minute, MINUTES)} of 15 readings</span>
          </dt>
          <dd className="mt-1 h-7 text-lg font-semibold tracking-[-0.01em] text-foreground">
            <motion.span animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.4 }}>
              Offline 11:42 to 11:45. Trip logged.
            </motion.span>
          </dd>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <dt className="flex items-center justify-between text-sm text-muted-foreground">
            A 15-minute average
            <span className="font-mono text-xs">{done ? 1 : 0} of 1 reading</span>
          </dt>
          <dd className="mt-1 h-7 text-lg font-semibold tracking-[-0.01em] text-muted-foreground">
            <motion.span animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.4, delay: done ? 0.35 : 0 }}>
              80% output. Looks like a cloud.
            </motion.span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

/* ───────────────────────── what you catch: three small loops ───────────────────────── */

function TripMini() {
  return (
    <div className="flex h-16 items-end gap-1.5" aria-hidden>
      {Array.from({ length: 7 }, (_, i) => (
        <motion.span
          key={i}
          className={cn("h-full flex-1 origin-bottom rounded-[3px]", i === 4 ? "bg-ink" : "bg-orange")}
          animate={i === 4 ? { scaleY: [1, 1, 0.06, 0.06, 1] } : { scaleY: [0.92, 1, 0.94] }}
          transition={
            i === 4
              ? { duration: 4, times: [0, 0.35, 0.45, 0.8, 0.9], repeat: Infinity, ease: "easeInOut" }
              : { duration: 3 + i * 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}

const CLOUD_PATH = "M0,56 C30,52 50,14 90,12 C110,11 118,46 128,46 C138,46 146,14 170,13 C210,12 230,52 260,56";

function CloudMini() {
  return (
    <svg viewBox="0 0 260 64" className="h-16 w-full overflow-visible" aria-hidden>
      <path d={CLOUD_PATH} fill="none" stroke="var(--border-strong)" strokeWidth={2} strokeLinecap="round" />
      <motion.path
        d={CLOUD_PATH}
        fill="none"
        stroke="var(--brand-orange)"
        strokeWidth={2.5}
        strokeLinecap="round"
        animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 4, times: [0, 0.75, 1], repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x={108} y={0} width={40} height={64} rx={6} fill="var(--brand-orange)" opacity={0.08} />
    </svg>
  );
}

/** Three phase voltages scrolling past, with a short sag in each period. */
function PhaseMini() {
  const period = 130;
  const wave = (phase: number, amp: number) => {
    let d = "";
    for (let x = 0; x <= period * 3; x += 4) {
      // smooth sag in the middle of each period
      const a = amp * (1 - 0.45 * Math.exp(-((((x % period) - 82) / 9) ** 2)));
      const y = 32 + a * Math.sin((x / 22) + phase);
      d += `${x ? "L" : "M"}${x},${y.toFixed(1)}`;
    }
    return d;
  };
  const phases = [
    { d: wave(0, 22), stroke: "var(--brand-orange)" },
    { d: wave((2 * Math.PI) / 3, 22), stroke: "var(--brand-ink)" },
    { d: wave((4 * Math.PI) / 3, 22), stroke: "var(--brand-olive)" },
  ];
  return (
    <svg viewBox="0 0 260 64" className="h-16 w-full" aria-hidden>
      <motion.g animate={{ x: [0, -period] }} transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}>
        {phases.map((p, i) => (
          <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth={1.6} opacity={0.85} />
        ))}
      </motion.g>
    </svg>
  );
}

const catches = [
  { title: "Inverter trips", body: "A 3-minute outage shows up as exactly 3 minutes.", visual: <TripMini /> },
  { title: "Cloud passes", body: "The start, depth and length of every dip.", visual: <CloudMini /> },
  { title: "Grid events", body: "Voltage on all three phases, minute by minute.", visual: <PhaseMini /> },
];

/* ───────────────────────── numbers ───────────────────────── */

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-10% 0px" });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => Math.round(v).toLocaleString("en-IN"));
  useEffect(() => {
    if (!seen) return;
    const controls = animate(value, to, { duration: 1.4, ease });
    return () => controls.stop();
  }, [seen, to, value]);
  return <motion.span ref={ref}>{text}</motion.span>;
}

const numbers = [
  { value: 1440, label: "readings per device, every day", strong: true },
  { value: 96, label: "with 15-minute averages", strong: false },
  { value: 15, suffix: "×", label: "more detail on every inverter", strong: true },
];

/* ───────────────────────── section ───────────────────────── */

export function Resolution() {
  return (
    <MotionConfig reducedMotion="user">
            <section
        id="resolution"
        aria-labelledby="resolution-title"
        className="relative isolate overflow-hidden border-y bg-card py-24 sm:py-24"
      >
        {/* backdrop: one column per minute, dots fading in from top and bottom, two brand glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] [background-size:calc(100%/15)_100%] [mask-image:linear-gradient(to_bottom,transparent,#000_15%,#000_85%,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,#000,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_top,#000,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(225,113,0,.12),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-40 -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(73,125,0,.10),transparent)]"
        />
        <Container className="max-w-5xl">
          <motion.div {...inView} variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="text-center">
            <motion.h2
              id="resolution-title"
              variants={rise}
              className="text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.04] font-bold tracking-[-0.035em]"
            >
              A lot can happen in fifteen minutes.
            </motion.h2>
            <motion.p variants={rise} className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed">
              Most monitoring keeps one average per quarter hour. Enerlynx keeps every minute, so nothing gets averaged
              away.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease }}
            className="mt-14"
          >
            <Replay />
          </motion.div>

          {/* what you catch */}
          <motion.ul
            {...inView}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="mt-6 grid gap-4 sm:grid-cols-3"
          >
            {catches.map((c) => (
              <motion.li key={c.title} variants={rise} className="rounded-2xl border bg-background p-6">
                {c.visual}
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em]">{c.title}</h3>
                <p className="mt-1 text-[0.9375rem] text-muted-foreground">{c.body}</p>
              </motion.li>
            ))}
          </motion.ul>

          {/* the numbers */}
          <motion.dl
            {...inView}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="mt-16 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3"
          >
            {numbers.map((n) => (
              <motion.div key={n.label} variants={rise} className="flex flex-col-reverse bg-card px-6 py-8 text-center">
                <dt className="mt-3 text-[0.9375rem] text-muted-foreground">{n.label}</dt>
                <dd
                  className={cn(
                    "text-[clamp(2.4rem,4.4vw,3.4rem)] leading-none font-bold tracking-[-0.04em]",
                    n.strong ? "text-orange" : "text-muted-foreground",
                  )}
                >
                  <CountUp to={n.value} />
                  {n.suffix}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </Container>
      </section>
    </MotionConfig>
  );
}