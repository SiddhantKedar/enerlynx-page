"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import { Headset, MonitorPlay, Wrench, type LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const demoMail = `mailto:${site.email.sales}?subject=${encodeURIComponent("Live demo request")}`;
const supportMail = `mailto:${site.email.support}?subject=${encodeURIComponent("Support request")}`;

const offers: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: MonitorPlay, title: "Live demo session", body: "We walk you through the portal on a running plant." },
  { icon: Headset, title: "Live customer support", body: "Talk to our engineers whenever you need help." },
  { icon: Wrench, title: "End-to-end setup", body: "Hardware, commissioning and portal, all by our team." },
];

export function Contact() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-32">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="relative overflow-hidden rounded-2xl border bg-card px-6 py-16 text-center sm:px-12 sm:py-20"
          >
            {/* soft brand glow from the top */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(225,113,0,.12),transparent)]"
            />

            <div className="relative">
              <motion.h2
                id="contact-title"
                variants={rise}
                className="text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.04] font-bold tracking-[-0.035em]"
              >
                See it on a live plant.
              </motion.h2>
              <motion.p variants={rise} className="mx-auto mt-5 max-w-[40ch] text-lg leading-relaxed">
                Book a live demo session and we will show you everything, minute by minute.
              </motion.p>

              <motion.div variants={rise} className="mt-9 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <a href={demoMail}>Book a live demo</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={supportMail}>Contact support</a>
                </Button>
              </motion.div>

              <motion.ul
                variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
                className="mx-auto mt-16 grid max-w-4xl gap-8 border-t pt-12 text-left sm:grid-cols-3 sm:gap-6"
              >
                {offers.map(({ icon: Icon, title, body }) => (
                  <motion.li key={title} variants={rise} className="flex gap-4 sm:flex-col sm:gap-0">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-orange-wash text-orange-deep">
                      <Icon className="size-5" strokeWidth={1.8} aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.01em] sm:mt-5">{title}</h3>
                      <p className="mt-1 text-[0.9375rem] text-muted-foreground">{body}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.p variants={rise} className="mt-12 text-[0.9375rem] text-muted-foreground">
                Or write to{" "}
                <a href={`mailto:${site.email.sales}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                  {site.email.sales}
                </a>{" "}
                ·{" "}
                <a href={`mailto:${site.email.support}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                  {site.email.support}
                </a>
              </motion.p>
            </div>
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}
