import { Container } from "@/components/layout/container";
import { Hardware } from "@/components/sections/hardware";
import { Hero } from "@/components/sections/hero";
import { Resolution } from "@/components/sections/resolution";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PmKusum } from "@/components/sections/pm-kusum";
import { Portal } from "@/components/sections/portal";
import { Contact } from "@/components/sections/contact";


export default function Home() {
  return (
    <>
      <Hero />
      <Resolution />
      <Hardware />
      <HowItWorks />
      <PmKusum />
      <Portal />
      <Contact />
    </>
  );
}
