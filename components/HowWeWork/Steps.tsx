"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useScroll } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  STEPS,
  STEPS_CTA,
  STEPS_INTRO,
  STEPS_TITLE,
} from "@/lib/how-we-work";
import Reveal from "@/components/Reveal";
import StepLine from "./StepLine";

export default function Steps() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  // Progreso de la lista: 0 cuando su inicio cruza el centro de la
  // ventana, 1 cuando lo cruza su final.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });

  // Paso activo = el que cruza la línea central de la ventana. Los <li> son
  // contiguos (padding, no gap), así que siempre hay uno en el centro
  // mientras la lista lo atraviesa; fuera de ella se conserva el último.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    list.querySelectorAll("li").forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-20 grid grid-cols-1 gap-12 lg:mt-32 lg:grid-cols-12 lg:gap-10">
      {/* Columna fija (solo desktop). top-[120px] la deja bajo el header. */}
      <div className="flex flex-col items-start lg:sticky lg:top-[120px] lg:col-span-5 lg:self-start">
        <Reveal
          as="h2"
          className="font-playfair text-[38px] font-normal leading-[1.1] text-ink lg:text-[48px]"
        >
          {STEPS_TITLE}
        </Reveal>
        <Reveal
          as="p"
          delay={0.1}
          distance={16}
          className="mt-5 max-w-[440px] font-figtree text-[17px] leading-[1.6] text-ink/85"
        >
          {STEPS_INTRO}
        </Reveal>
        <Reveal delay={0.2} distance={16} className="mt-8">
          <Link
            href={STEPS_CTA.href}
            className="
              inline-flex items-center font-figtree font-medium
              text-sm md:text-base
              bg-ink text-white px-6 py-3 rounded-[2px]
              transition-colors duration-200
              hover:bg-accent
            "
          >
            {STEPS_CTA.label}
          </Link>
        </Reveal>

        <div
          aria-hidden="true"
          className="mt-12 hidden gap-5 font-figtree text-[13px] lg:flex"
        >
          {STEPS.map((step, i) => (
            // Ancho fijo: el cambio de peso no mueve a los vecinos.
            <span
              key={step.number}
              className={`w-6 transition-colors duration-300 ${
                i === active ? "font-medium text-ink" : "text-ink/35"
              }`}
            >
              {step.number}
            </span>
          ))}
        </div>
      </div>

      <ol
        ref={listRef}
        className="relative pl-12 lg:col-span-6 lg:col-start-7 lg:pl-16"
      >
        <StepLine containerRef={listRef} progress={scrollYProgress} />
        {STEPS.map((step, i) => {
          const isActive = reduce || i === active;
          return (
            <li
              key={step.number}
              data-index={i}
              className={`flex flex-col justify-center py-8 transition-opacity duration-500 lg:min-h-[60vh] lg:py-0 ${
                isActive ? "opacity-100" : "opacity-35"
              }`}
            >
              <Reveal>
                <span
                  data-step-anchor
                  aria-hidden="true"
                  className={`block font-playfair text-[64px] leading-none transition-colors duration-500 lg:text-[96px] ${
                    isActive ? "text-accent" : "text-accent/40"
                  }`}
                >
                  {step.number}
                </span>
                <h3 className="mt-4 font-playfair text-[28px] font-normal leading-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[420px] font-figtree text-[17px] leading-[1.6] text-ink/85">
                  {step.text}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
