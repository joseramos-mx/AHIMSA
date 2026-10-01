"use client";

import { useRef } from "react";
import { useScroll, useSpring } from "motion/react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Niches from "@/components/Niches";
import DayInParisResponsive from "@/components/DayInParis/DayInParisResponsive";

export default function Page() {
  const heroRef = useRef<HTMLElement | null>(null);

  // Scroll progress 0..1 across the Hero's 200vh outer section.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  // Soft spring so hitches in the raw scroll don't jerk the logo.
  // Tune: higher stiffness = snappier, higher damping = less overshoot.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 1,
  });

  return (
    <main>
      <Header progress={smoothProgress} rawProgress={scrollYProgress} />
      <Hero sectionRef={heroRef} progress={smoothProgress} />

      <Intro />
      <Niches />
      <DayInParisResponsive />

      {/* Placeholder para seguir probando el scroll después de la grilla */}
      <section
        className="min-h-screen bg-cream text-ink flex items-center justify-center px-6"
        aria-label="Siguiente sección"
      >
        <p className="font-figtree text-base opacity-60">
          Placeholder de 100vh — aquí va la siguiente sección.
        </p>
      </section>
    </main>
  );
}
