"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  SLIDES,
  type DayImage,
  type DayMoment,
} from "@/lib/day-in-paris";

/**
 * Trazo vertical a mano (placeholder generado — reemplazar por un SVG
 * exportado de Figma cuando lo tengas). Es un path simple con curvas
 * Bézier que serpentea de arriba a abajo. Para sustituirlo copia el
 * `d` del SVG exportado y pégalo en VERTICAL_PATH_D (asegúrate de que
 * el viewBox coincida con VERTICAL_VIEWBOX).
 */
const VERTICAL_VIEWBOX = "0 0 100 1000";
const VERTICAL_PATH_D =
  "M50 0 C 85 90, 15 180, 50 270 C 85 360, 15 450, 50 540 C 85 630, 15 720, 50 810 C 70 870, 40 930, 50 1000";

function DrawnPathMobile({ progress }: { progress: MotionValue<number> }) {
  // Pequeño lead para que la punta siempre esté visible dentro del scroll.
  const drawTo = useTransform(progress, (p) =>
    Math.min(1, Math.max(0, p * 1.08))
  );

  return (
    <svg
      viewBox={VERTICAL_VIEWBOX}
      preserveAspectRatio="xMidYMin slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <motion.path
        d={VERTICAL_PATH_D}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: drawTo }}
      />
    </svg>
  );
}

type RevealImageMobileProps = {
  image: DayImage;
  aspect: string;
  sizes?: string;
  className?: string;
  reduce: boolean;
};

function RevealImageMobile({
  image,
  aspect,
  sizes = "80vw",
  className = "",
  reduce,
}: RevealImageMobileProps) {
  const [failed, setFailed] = useState(false);
  const filename = image.src.split("/").pop() ?? image.src;

  const inner = failed ? (
    <div className="absolute inset-0 flex items-center justify-center bg-ink/15 p-4 text-center">
      <span className="font-figtree text-[11px] text-ink/60 break-all">
        {filename}
      </span>
    </div>
  ) : (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );

  if (reduce) {
    return (
      <div
        className={`relative overflow-hidden bg-ink/10 rounded-[2px] ${aspect} ${className}`}
      >
        {inner}
      </div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden bg-ink/10 rounded-[2px] ${aspect} ${className}`}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {inner}
      </motion.div>
    </motion.div>
  );
}

function MomentBlockMobile({
  moment,
  reduce,
}: {
  moment: DayMoment;
  reduce: boolean;
}) {
  const textProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-15%" },
        transition: { duration: 0.5, delay: 0.1 },
      };
  return (
    <article className="relative flex flex-col gap-5">
      <RevealImageMobile
        image={moment.image}
        aspect="aspect-[4/5]"
        reduce={reduce}
      />
      <motion.div {...textProps} className="flex flex-col gap-2">
        <span className="font-figtree text-[12px] font-medium uppercase tracking-[0.2em] text-accent-dark">
          {moment.time}
        </span>
        <h3 className="font-fraunces font-light text-[22px] leading-tight text-ink">
          {moment.title}
        </h3>
        <p className="font-figtree text-[15px] leading-[1.5] text-ink/85 max-w-[260px]">
          {moment.text}
        </p>
      </motion.div>
    </article>
  );
}

export default function DayInParisMobile() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0001,
    mass: 0.6,
  });

  // Flatten the slides into intro + moments[] + closing
  const intro = SLIDES.find((s) => s.type === "intro");
  const moments = SLIDES.flatMap((s) =>
    s.type === "momentos" ? s.moments : []
  );
  const closing = SLIDES.flatMap((s) =>
    s.type === "momentos" && s.closing ? [s.closing] : []
  )[0];

  if (!intro || intro.type !== "intro") return null;

  const introTextProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10%" },
        transition: { duration: 0.5, delay: 0.1 },
      };

  return (
    <section
      ref={sectionRef}
      id="un-dia"
      className="relative bg-cream text-ink overflow-hidden"
      aria-label="Un día en París con Ahimsa"
    >
      {/* Trazo vertical al fondo */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-y-0 left-2 w-24 text-ink/70">
          <DrawnPathMobile progress={progress} />
        </div>
      )}
      {reduce && (
        <div className="pointer-events-none absolute inset-y-0 left-2 w-24 text-ink/70">
          <svg
            viewBox={VERTICAL_VIEWBOX}
            preserveAspectRatio="xMidYMin slice"
            className="h-full w-full"
            aria-hidden="true"
          >
            <path
              d={VERTICAL_PATH_D}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      )}

      <div className="relative mx-auto max-w-md px-8 py-20 flex flex-col gap-16">
        {/* Intro */}
        <article className="relative flex flex-col gap-6">
          <motion.h2
            {...introTextProps}
            className="font-fraunces font-light text-[48px] leading-[0.95] text-ink"
          >
            {intro.intro.titleTop}
            <br />
            <span className="pl-10">{intro.intro.titleBottom}</span>
          </motion.h2>
          <RevealImageMobile
            image={intro.intro.image}
            aspect="aspect-[2/3]"
            reduce={reduce ?? false}
          />
          <motion.p
            {...introTextProps}
            className="font-figtree text-[16px] leading-[1.5] text-ink/85 max-w-[320px]"
          >
            {intro.intro.subtitle}
          </motion.p>
        </article>

        {/* Momentos */}
        {moments.map((m, i) => (
          <MomentBlockMobile
            key={`${m.time}-${i}`}
            moment={m}
            reduce={reduce ?? false}
          />
        ))}

        {/* Cierre */}
        {closing && (
          <motion.article
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-10%" },
                  transition: { duration: 0.5 },
                })}
            className="relative flex flex-col gap-5"
          >
            <h2 className="font-fraunces font-light text-[32px] leading-[1.1] text-ink">
              {closing.title}
            </h2>
            <Link
              href={closing.cta.href}
              className="
                inline-flex items-center self-start
                font-figtree font-medium text-base
                bg-ink text-white px-6 py-3 rounded-[2px]
                transition-colors duration-200 hover:bg-accent
              "
            >
              {closing.cta.label}
            </Link>
          </motion.article>
        )}
      </div>
    </section>
  );
}
