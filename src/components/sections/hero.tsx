"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import { Check } from "lucide-react";

import { Container } from "@/components/layout/container";
import { LiveConsole } from "@/components/sections/live-console";
import { Button } from "@/components/ui/button";

const ease = [0.22, 0.61, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const assurances = ["Any inverter brand", "No vendor lock-in", "Installed by our team"];

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="hero" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        {/* backdrop: dotted grid that fades out, and a warm glow behind the console */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_20%,transparent_75%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-24 right-[-10%] -z-10 size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(225,113,0,.14),transparent)]"
        />

        <Container>
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.09 } } }}
              className="lg:col-span-6"
            >

              <motion.h1
                id="hero-title"
                variants={rise}
                className="text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1] font-bold tracking-[-0.04em]"
              >
                Every minute of your solar plant, on record.
              </motion.h1>

              <motion.p variants={rise} className="mt-6 max-w-[48ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed">
                Monitoring and SLDC reporting for Indian solar plants, with a reading from every device, every minute.
              </motion.p>

              <motion.div variants={rise} className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#contact">Book a live demo</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </motion.div>

              <motion.ul variants={rise} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
                {assurances.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-body">
                    <Check className="size-4 text-olive" strokeWidth={2.5} aria-hidden />
                    {a}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease }}
              className="mx-auto w-full max-w-md lg:col-span-6 lg:mr-0 lg:max-w-[30rem]"
            >
              <LiveConsole />
            </motion.div>
          </div>
        </Container>
      </section>
    </MotionConfig>
  );
}