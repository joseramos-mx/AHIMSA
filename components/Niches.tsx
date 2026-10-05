"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { NICHES } from "@/lib/niches";
import NicheCard from "./NicheCard";
import Reveal from "./Reveal";

const makeCardVariants = (stagger: number): Variants => ({
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * stagger,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
});

export default function Niches() {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const variants = makeCardVariants(isMobile ? 0.06 : 0.1);

  const containerMotion = reduce
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-10%" },
      };

  const itemMotion = reduce ? {} : { variants };

  return (
    <section
      id="viajes"
      className="bg-cream text-ink pb-20 md:pb-32"
      aria-labelledby="niches-title"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Reveal
          as="h2"
          className="font-fraunces font-light text-[34px] md:text-[48px] leading-[1.1] text-center max-w-[22ch] mx-auto mb-10 md:mb-14"
        >
          <span id="niches-title">
            Un viaje distinto para cada momento de tu vida
          </span>
        </Reveal>
      </div>

      {/* Móvil: carrusel horizontal con snap, full-width */}
      <motion.ul
        {...containerMotion}
        className="
          sm:hidden flex gap-4
          overflow-x-auto overflow-y-hidden
          snap-x snap-mandatory
          px-6 pb-4 scroll-pl-6
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {NICHES.map((n, i) => (
          <motion.li
            key={n.slug}
            custom={i}
            {...itemMotion}
            className="snap-start shrink-0 w-[80%]"
          >
            <NicheCard {...n} />
          </motion.li>
        ))}
      </motion.ul>

      {/* Tablet / desktop: grid 2 → 4 cols */}
      <motion.ul
        {...containerMotion}
        className="
          hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4
          mx-auto max-w-[1200px] px-6 md:px-10
        "
      >
        {NICHES.map((n, i) => (
          <motion.li key={n.slug} custom={i} {...itemMotion} className="flex">
            <NicheCard {...n} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
