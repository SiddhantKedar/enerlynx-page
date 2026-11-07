"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Landmark, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A stylised plant console for the hero. Values are illustrative, but the clock is real:
 * every time the minute rolls over, a new reading "lands" and the SLDC push updates.
 */

const CAPACITY_KW = 2000;
const INVERTERS = 7;

// one smooth day of generation, sampled at 60 points
const CURVE = Array.from({ length: 60 }, (_, i) => {
  const t = i / 59;
  const base = Math.pow(Math.sin(Math.PI * t), 1.25);
  const cloud = 1 - 0.28 * Math.exp(-(((t - 0.62) / 0.025) ** 2)); // one afternoon cloud
  return base * cloud;
});
const NOW_INDEX = 41; // where "now" sits on the curve

/** Small, repeatable wobble so each minute's reading differs a little. */
function powerFor(minute: number) {
  const wobble = Math.sin(minute * 12.9898) * 0.5 + 0.5; // 0..1
  return Math.round(1580 + wobble * 90);
}

const pad = (n: number) => String(n).padStart(2, "0");
const hhmm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return now;
}

function Sparkline() {
  const W = 320;
  const H = 88;
  const pts = CURVE.map((v, i) => [(i / (CURVE.length - 1)) * W, H - 6 - v * (H - 14)] as const);
  const toNow = pts.slice(0, NOW_INDEX + 1);
  const line = toNow.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const area = `${line}L${toNow[toNow.length - 1][0].toFixed(1)},${H}L0,${H}Z`;
  const rest = pts
    .slice(NOW_INDEX)
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join("");
  const [nx, ny] = pts[NOW_INDEX];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="hero-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={rest} fill="none" stroke="var(--border-strong)" strokeWidth={1.5} strokeDasharray="3 4" />
      <motion.path
        d={area}
        fill="url(#hero-spark)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--brand-orange)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
      />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <circle cx={nx} cy={ny} r={9} fill="var(--brand-orange)" opacity={0.18}>
          <animate attributeName="r" values="5;11;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={nx} cy={ny} r={4} fill="var(--brand-orange)" stroke="var(--card)" strokeWidth={2} />
      </motion.g>
    </svg>
  );
}

/** Ring that empties over the minute; the next reading lands when it closes. */
function MinuteRing({ seconds }: { seconds: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const progress = seconds / 60;
  return (
    <svg viewBox="0 0 36 36" className="size-9 -rotate-90" aria-hidden>
      <circle cx="18" cy="18" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="var(--brand-orange)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        className="transition-[stroke-dashoffset] duration-1000 ease-linear"
      />
    </svg>
  );
}

export function LiveConsole() {
  const now = useClock();
  const seconds = now?.getSeconds() ?? 0;
  const minuteKey = now ? Math.floor(now.getTime() / 60000) : 0;
  const kw = powerFor(minuteKey);
  const pct = Math.round((kw / CAPACITY_KW) * 100);
  const lastReading = now ? hhmm(new Date(minuteKey * 60000)) : "--:--";
  const toNext = 60 - seconds;

  return (
    <div className="relative">
      {/* main console */}
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-[0_1px_2px_rgba(27,26,22,.05),0_40px_80px_-36px_rgba(27,26,22,.35)]">
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-olive opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-olive" />
            </span>
            <span className="text-sm font-semibold text-foreground">Sample plant</span>
            <span className="text-sm text-muted-foreground">2 MW AC</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {now ? `${hhmm(now)}:${pad(seconds)}` : "--:--:--"}
          </span>
        </div>

        <div className="px-5 pt-5">
          <p className="text-sm text-muted-foreground">Active power</p>
          <div className="mt-1 flex items-baseline gap-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={kw}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="text-4xl font-bold tracking-[-0.03em] text-foreground"
              >
                {(kw / 1000).toFixed(2)}
              </motion.span>
            </AnimatePresence>
            <span className="text-lg font-semibold text-foreground">MW</span>
            <span className="ml-1 text-sm text-muted-foreground">{pct}% of capacity</span>
          </div>
        </div>

        <div className="mt-3 px-3">
          <Sparkline />
        </div>
        <div className="flex justify-between px-5 pb-1 font-mono text-[11px] text-muted-foreground">
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
        </div>

        <div className="mt-3 flex items-center gap-3 border-t bg-background/60 px-5 py-3.5">
          <MinuteRing seconds={seconds} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Next reading in {now ? `0:${pad(toNext % 60)}` : "--"}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={lastReading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground"
              >
                Last reading saved at {lastReading}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* floating status cards */}
      <motion.div
        initial={{ opacity: 0, x: 16, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute -right-3 -bottom-7 hidden items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-[0_12px_32px_-14px_rgba(27,26,22,.3)] sm:flex lg:-right-8"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-orange-wash text-orange-deep">
          <Landmark className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">SLDC telemetry</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={lastReading}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1 text-xs text-olive-deep"
            >
              <Check className="size-3" strokeWidth={3} aria-hidden />
              Sent at {lastReading}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -16, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="absolute top-[46%] -left-3 hidden items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-[0_12px_32px_-14px_rgba(27,26,22,.3)] sm:flex lg:-left-12"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-olive-wash text-olive-deep">
          <Zap className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Inverters</p>
          <div className="mt-1 flex gap-1" aria-label={`${INVERTERS} of ${INVERTERS} generating`}>
            {Array.from({ length: INVERTERS }, (_, i) => (
              <span key={i} className={cn("h-2.5 w-3 rounded-[2px] bg-olive")} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
