"use client";

import { Fragment } from "react";
import { MotionConfig, motion, type Variants } from "motion/react";
import {
  Landmark,
  LayoutDashboard,
  Router,
  SolarPanel,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/layout/container";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

type Step = { icons: LucideIcon[]; title: string; body: string };

const steps: Step[] = [
  {
    icons: [SolarPanel],
    title: "Your plant",
    body: "Inverters, meters, weather station and breakers.",
  },
  {
    icons: [Router],
    title: "ELX-GW100",
    body: "Reads every device once a minute.",
  },
  {
    icons: [LayoutDashboard, Landmark],
    title: "Portal and SLDC",
    body: "Both get the data at the same time.",
  },
];

/** What travels along each link. */
const links = ["Modbus", "Encrypted MQTT"];

/** A dashed link between two steps, with a reading travelling along it. */
function Link({ label, index }: { label: string; index: number }) {
  const delay = 0.5 + index * 0.25;
  return (
    <div
      className="relative flex items-center justify-center py-2 md:pt-8 md:pb-0"
      aria-hidden
    >
      {/* horizontal on desktop */}
      <div className="relative hidden h-px w-full md:block">
        <motion.span
          variants={{
            hidden: { scaleX: 0 },
            show: { scaleX: 1, transition: { delay, duration: 0.7, ease } },
          }}
          className="absolute inset-0 origin-left bg-[repeating-linear-gradient(90deg,var(--border-strong)_0_6px,transparent_6px_11px)]"
        />
        <motion.span
          className="absolute -top-[3px] size-[7px] rounded-full bg-orange"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{
            delay: delay + 0.8,
            duration: 1.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1.4,
          }}
        />
      </div>
      {/* vertical on phones */}
      <motion.span
        variants={{
          hidden: { scaleY: 0 },
          show: { scaleY: 1, transition: { delay, duration: 0.5, ease } },
        }}
        className="h-10 w-px origin-top bg-[repeating-linear-gradient(180deg,var(--border-strong)_0_5px,transparent_5px_9px)] md:hidden"
      />
      <motion.span
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { delay: delay + 0.3, duration: 0.4 },
          },
        }}
        className="absolute left-1/2 ml-4 font-mono text-xs whitespace-nowrap text-muted-foreground md:top-0 md:ml-0 md:-translate-x-1/2"
      >
        {label}
      </motion.span>
    </div>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <motion.div
      variants={rise}
      className="flex flex-col items-center text-center"
    >
      <div className="flex -space-x-2">
        {step.icons.map((Icon, i) => (
          <span
            key={i}
            className="grid size-16 place-items-center rounded-full border bg-card text-orange-deep shadow-[0_1px_2px_rgba(27,26,22,.04),0_8px_20px_-12px_rgba(27,26,22,.25)]"
          >
            <Icon className="size-6" strokeWidth={1.6} aria-hidden />
          </span>
        ))}
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-[-0.015em]">
        {step.title}
      </h3>
      <p className="mt-1.5 max-w-[24ch] text-muted-foreground">{step.body}</p>
    </motion.div>
  );
}

/** Faint horizontal data lines across the whole section, with readings drifting along them. */
const STREAMS = [
  { top: "10%", dur: 11, delay: 0 },
  { top: "22%", dur: 14, delay: 3 },
  { top: "34%", dur: 9, delay: 6 },
  { top: "62%", dur: 12, delay: 1.5 },
  { top: "74%", dur: 10, delay: 4.5 },
  { top: "86%", dur: 15, delay: 2 },
];

function DataStreams() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* lines show at the sides and fade out behind the text in the middle; hidden on phones */}
      <div className="absolute inset-0 hidden [mask-image:radial-gradient(ellipse_42%_70%_at_50%_50%,transparent_55%,#000_100%)] md:block">
        {STREAMS.map((s) => (
          <div
            key={s.top}
            className="absolute inset-x-0 h-px"
            style={{ top: s.top }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,var(--border-strong)_20%,var(--border-strong)_80%,transparent)] opacity-60" />
            <motion.span
              className="absolute -top-px h-[3px] w-10 rounded-full bg-[linear-gradient(to_right,transparent,var(--brand-orange))]"
              initial={{ left: "-5%", opacity: 0 }}
              animate={{ left: ["-5%", "105%"], opacity: [0, 0.9, 0.9, 0] }}
              transition={{
                duration: s.dur,
                delay: s.delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.1, 0.9, 1],
              }}
            />
          </div>
        ))}
      </div>
      {/* soft glow behind the gateway, the middle step */}
      <div className="absolute top-[58%] left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(225,113,0,.10),transparent)]" />
    </div>
  );
}

export function HowItWorks() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="how-it-works"
        aria-labelledby="how-title"
        className="relative isolate overflow-hidden border-y bg-card py-16 sm:py-24"
      >
        <DataStreams />
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.h2
              id="how-title"
              variants={rise}
              className="text-[clamp(2rem,4vw,3.1rem)] leading-[1.05] font-bold tracking-[-0.03em]"
            >
              From your plant to the grid operator, every minute.
            </motion.h2>
            <motion.p
              variants={rise}
              className="mx-auto mt-5 max-w-[40ch] text-lg leading-relaxed"
            >
              One gateway on site. Your data in two places at once.
            </motion.p>
          </motion.div>

          <motion.ol
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{
              show: {
                transition: { staggerChildren: 0.25, delayChildren: 0.1 },
              },
            }}
            className="mx-auto mt-12 grid max-w-5xl items-start sm:mt-14 gap-2 md:grid-cols-[1fr_minmax(5rem,1fr)_1fr_minmax(5rem,1fr)_1fr] md:gap-4"
          >
            {steps.map((step, i) => (
              <Fragment key={step.title}>
                <li>
                  <StepCard step={step} />
                </li>
                {i < links.length && (
                  <li role="presentation">
                    <Link label={links[i]} index={i} />
                  </li>
                )}
              </Fragment>
            ))}
          </motion.ol>
        </Container>
      </section>
    </MotionConfig>
  );
}