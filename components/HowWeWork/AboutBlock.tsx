"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  ABOUT_FACTS,
  ABOUT_TEXT,
  FOUNDER_NAME,
  FOUNDER_PHOTO,
} from "@/lib/how-we-work";
import RevealImage from "@/components/RevealImage";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";

export default function AboutBlock() {
  const reduce = useReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);

  // Parallax muy sutil de la foto dentro de su marco.
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
      {/* aspect-[4/5] reserva el alto antes de que cargue la foto (sin CLS). */}
      <div ref={photoRef} className="lg:col-span-5">
        <RevealImage
          src={FOUNDER_PHOTO}
          alt={`${FOUNDER_NAME}, fundadora de Ahimsa Travel`}
          className="aspect-[4/5] w-full rounded-[2px]"
          sizes="(min-width: 1024px) 42vw, 100vw"
          parallaxY={reduce ? undefined : photoY}
        />
      </div>

      <div className="flex flex-col lg:col-span-6 lg:col-start-7">
        <Reveal
          as="p"
          distance={0}
          className="font-figtree text-[13px] font-medium uppercase tracking-[0.2em] text-accent-dark"
        >
          Cómo trabajamos
        </Reveal>

        <SplitHeading
          delay={0.1}
          text={`Hola, soy ${FOUNDER_NAME}`}
          className="mt-5 font-playfair text-[38px] font-normal leading-[1.05] text-ink lg:text-[56px]"
        />

        <Reveal
          as="p"
          delay={0.25}
          distance={16}
          className="mt-6 max-w-[520px] font-figtree text-[17px] leading-[1.6] text-ink/85"
        >
          {ABOUT_TEXT}
        </Reveal>

        <ul className="mt-10 flex flex-col divide-y divide-ink/20 md:flex-row md:divide-x md:divide-y-0">
          {ABOUT_FACTS.map((fact, i) => (
            <Reveal
              as="li"
              key={fact}
              delay={0.4 + i * 0.1}
              distance={16}
              className="py-3 font-playfair text-[18px] leading-snug text-ink md:px-6 md:py-0 md:first:pl-0 md:last:pr-0"
            >
              {fact}
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
}
