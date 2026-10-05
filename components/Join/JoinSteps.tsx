"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { JOIN_STEPS } from "@/lib/join";
import Reveal from "@/components/Reveal";

/** Trazos a mano (mismo estilo que HowWeWork: ink 1.5px, sin relleno,
 *  linecap round). Se estiran al tamaño de la lista; non-scaling-stroke
 *  mantiene el grosor. */
const H_PATH =
  "M0 6 C 90 2, 160 10, 250 6 S 410 1, 500 6 S 660 11, 750 6 S 910 2, 1000 6";
const V_PATH =
  "M12 0 C 4 90, 20 160, 12 250 S 4 410, 12 500 S 20 660, 12 750 S 4 910, 12 1000";

function Stroke({
  d,
  viewBox,
  className,
  progress,
  opacity,
}: {
  d: string;
  viewBox: string;
  className: string;
  progress?: MotionValue<number>;
  opacity?: MotionValue<number>;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute overflow-visible ${className}`}
    >
      <motion.path
        d={d}
        fill="none"
        stroke="#111111"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={progress ? { pathLength: progress, opacity } : undefined}
      />
    </svg>
  );
}

export default function JoinSteps() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  // Con largo 0 el linecap round pintaría un punto suelto: se oculta.
  const opacity = useTransform(progress, (v): number => (v > 0.002 ? 1 : 0));
  const drawn = reduce ? undefined : progress;

  return (
    <section className="bg-cream px-6 py-20 text-ink md:px-10 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <Reveal
          as="h2"
          className="font-fraunces text-[34px] font-light leading-[1.1] lg:text-[48px]"
        >
          Cómo empiezas
        </Reveal>

        <ol
          ref={listRef}
          className="relative mt-14 grid grid-cols-1 gap-12 pl-12 lg:mt-20 lg:grid-cols-4 lg:gap-10 lg:pl-0"
        >
          {/* Horizontal (desktop) a la altura del centro de los números. */}
          <Stroke
            d={H_PATH}
            viewBox="0 0 1000 12"
            className="left-0 right-0 top-[30px] hidden h-3 lg:block"
            progress={drawn}
            opacity={opacity}
          />
          {/* Vertical (móvil y tablet) a la izquierda de los pasos. */}
          <Stroke
            d={V_PATH}
            viewBox="0 0 24 1000"
            className="bottom-0 left-0 top-0 w-6 lg:hidden"
            progress={drawn}
            opacity={opacity}
          />

          {JOIN_STEPS.map((step, i) => (
            <Reveal as="li" key={step.number} delay={0.1 + i * 0.1} distance={16}>
              {/* Fondo cream para que el trazo "una" los números. */}
              <span
                aria-hidden="true"
                className="relative inline-block bg-cream pr-4 font-fraunces text-[56px] font-light leading-none text-accent-dark lg:text-[72px]"
              >
                {step.number}
              </span>
              <h3 className="mt-4 font-fraunces text-[24px] font-light leading-tight">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[280px] font-figtree text-[15px] leading-[1.6] text-ink/75">
                {step.text}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
