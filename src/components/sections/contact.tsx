"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import { ArrowUpRight, Check, Copy, Headset, Mail, MapPin, MonitorPlay, Wrench, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const mailto = (email: string, subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`;
const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.full)}`;

const offers: { icon: LucideIcon; title: string }[] = [
  { icon: MonitorPlay, title: "Live demo on a running plant" },
  { icon: Headset, title: "Live customer support" },
  { icon: Wrench, title: "Hardware, commissioning and portal by our team" },
];

const channels: { icon: LucideIcon; label: string; note: string; email: string; subject: string }[] = [
  { icon: Mail, label: "Sales", note: "Live demos, pricing and new sites", email: site.email.sales, subject: "Live demo request" },
  { icon: Headset, label: "Support", note: "Existing plants and portal help", email: site.email.support, subject: "Support request" },
];

/* ───────────────────────── small parts ───────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the mail link still works */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${text}`}
      className="relative z-10 grid size-9 shrink-0 place-items-center rounded-lg border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
            <Check className="size-4 text-olive" strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
            <Copy className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

function Row({
  icon: Icon,
  label,
  children,
  action,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.li variants={rise} className="group relative flex items-start gap-4 py-5 first:pt-0 last:pb-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-orange-wash text-orange-deep transition-transform duration-300 group-hover:-rotate-6">
        <Icon className="size-5" strokeWidth={1.8} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {children}
      </div>
      {action}
    </motion.li>
  );
}

/* ───────────────────────── section ───────────────────────── */

export function Contact() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="contact" aria-labelledby="contact-title" className="py-16 sm:py-24">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="grid overflow-hidden rounded-3xl border bg-card shadow-[0_1px_2px_rgba(27,26,22,.05),0_40px_80px_-48px_rgba(27,26,22,.45)] lg:grid-cols-[1.15fr_1fr]"
          >
            {/* left: the invitation, on dark */}
            <div className="relative isolate overflow-hidden bg-ink p-7 text-white/70 sm:p-10 lg:p-14">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,#000,transparent_75%)]"
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-48 -left-32 -z-10 size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(225,113,0,.28),transparent)]"
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.p
                variants={rise}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.05] py-1 pr-3 pl-2 text-sm font-medium text-white/85"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#8fbf3f] opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#8fbf3f]" />
                </span>
                Engineers available for live demos
              </motion.p>

              <motion.h2
                id="contact-title"
                variants={rise}
                className="mt-6 text-[clamp(2.1rem,4.4vw,3.4rem)] leading-[1.02] font-bold tracking-[-0.035em] text-white"
              >
                See it on a live plant.
              </motion.h2>
              <motion.p variants={rise} className="mt-5 max-w-[40ch] text-lg leading-relaxed">
                Book a session and we&apos;ll walk you through a running plant, minute by minute. No slides.
              </motion.p>

              <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href={mailto(site.email.sales, "Live demo request")}>Book a live demo</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/[.06] text-white hover:border-white/50 hover:bg-white/[.12]"
                >
                  <a href={mailto(site.email.support, "Support request")}>Contact support</a>
                </Button>
              </motion.div>

              <motion.ul
                variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
                className="mt-10 space-y-3 border-t border-white/10 pt-8"
              >
                {offers.map(({ icon: Icon, title }) => (
                  <motion.li key={title} variants={rise} className="flex items-center gap-3 text-[0.9375rem]">
                    <Icon className="size-4 shrink-0 text-orange" strokeWidth={2} aria-hidden />
                    {title}
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* right: how to reach us */}
            <div className="p-7 sm:p-10 lg:p-14">
              <motion.h3 variants={rise} className="text-xl font-semibold tracking-[-0.015em]">
                Get in touch
              </motion.h3>
              <motion.p variants={rise} className="mt-1.5 text-[0.9375rem] text-muted-foreground">
                Write to us, or visit our office in Hyderabad.
              </motion.p>

              <motion.ul
                variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
                className="mt-8 divide-y"
              >
                {channels.map((c) => (
                  <Row key={c.email} icon={c.icon} label={c.label} action={<CopyButton text={c.email} />}>
                    <a
                      href={mailto(c.email, c.subject)}
                      className="mt-0.5 inline-flex items-center gap-1.5 text-[1.0625rem] font-semibold text-foreground underline-offset-4 hover:underline"
                    >
                      <span className="truncate">{c.email}</span>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-orange" aria-hidden />
                    </a>
                    <p className="mt-0.5 text-sm text-muted-foreground">{c.note}</p>
                  </Row>
                ))}

                <Row icon={MapPin} label="Office">
                  <address className="mt-0.5 text-[0.9375rem] leading-relaxed text-foreground not-italic">
                    {site.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={directions}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-orange-deep underline-offset-4 hover:underline"
                  >
                    Get directions
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </Row>
              </motion.ul>
            </div>
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}