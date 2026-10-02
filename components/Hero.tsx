"use client";

import Image from "next/image";
import Link from "next/link";
import { type RefObject, useEffect, useState } from "react";
import {
  motion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { CTA } from "@/lib/nav";

type HeroProps = {
  sectionRef: RefObject<HTMLElement | null>;
  progress: MotionValue<number>;
};

// Toggle this to `false` if you don't have the video assets yet.
// With `true` the <video> tag is rendered; the poster image is used as
// LCP, so the UI still works even if the video 404s.
const USE_VIDEO_BG = true;

function HeroBackground({ scale }: { scale: MotionValue<number> }) {
  return (
    <motion.div
      className="absolute inset-0 will-change-transform origin-center"
      style={{ scale }}
    >
      {USE_VIDEO_BG ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          // poster="/media/hero.jpg"  // añade un hero.jpg y reactívalo para mejorar LCP
          aria-hidden="true"
        >
          {/* <source src="/media/hero.webm" type="video/webm" /> */}
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          src="/media/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
    </motion.div>
  );
}

export default function Hero({ sectionRef, progress }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Content appears a bit earlier on mobile so the CTA is reachable fast.
  const contentStart = isMobile ? 0.3 : 0.4;
  const contentEnd = isMobile ? 0.55 : 0.65;

  const contentOpacity = useTransform(
    progress,
    [contentStart, contentEnd],
    [0, 1]
  );
  const contentY = useTransform(progress, [contentStart, contentEnd], [24, 0]);
  const scrollHintOpacity = useTransform(progress, [0, 0.08], [1, 0]);
  const bgScale = useTransform(progress, [0.65, 1], [1, 1.08]);

  if (reduceMotion) {
    return (
      <section
        ref={sectionRef}
        className="relative h-[100svh] w-full overflow-hidden"
        aria-label="Introducción"
      >
        <div className="absolute inset-0">
          {USE_VIDEO_BG ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              // poster="/media/hero.jpg"
              aria-hidden="true"
            >
              {/* <source src="/media/hero.webm" type="video/webm" /> */}
              <source src="/media/hero.mp4" type="video/mp4" />
            </video>
          ) : (
            <Image
              src="/media/hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent"
          aria-hidden="true"
        />
        <HeroCopy />
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] w-full"
      aria-label="Introducción"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <HeroBackground scale={bgScale} />

        {/* Gradient overlays for legibility: dark bottom-left wedge + top strip */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero copy */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute left-5 right-5 bottom-[12svh] md:left-14 md:right-auto md:bottom-16 md:max-w-[640px] text-white"
        >
          <HeroCopy inner />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-white pointer-events-none"
          aria-hidden="true"
        >
          <span className="font-figtree text-[11px] tracking-[0.25em] uppercase">
            Desliza
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-white/30">
            <span className="scroll-line absolute left-0 top-0 h-1/2 w-px bg-white" />
          </span>
        </motion.div>
      </div>

      <style jsx>{`
        .scroll-line {
          animation: scroll-hint 1.8s ease-in-out infinite;
        }
        @keyframes scroll-hint {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
      `}</style>
    </section>
  );
}

function HeroCopy({ inner = false }: { inner?: boolean }) {
  const className = inner
    ? ""
    : "absolute left-5 right-5 bottom-[12svh] md:left-14 md:right-auto md:bottom-16 md:max-w-[640px] text-white";
  return (
    <div className={className}>
      <h1 className="font-playfair font-medium text-[40px] md:text-[64px] leading-[1.05] max-w-[14ch]">
        Tu viaje a Europa, diseñado para tu familia
      </h1>
      <p className="font-figtree text-base md:text-lg mt-4 max-w-[520px] text-white/90">
        Itinerarios a la medida, los mejores hoteles y acompañamiento antes,
        durante y después de tu viaje.
      </p>
      <Link
        href={CTA.href}
        className="inline-flex items-center font-figtree text-sm md:text-base bg-white text-ink px-5 md:px-6 py-3 mt-6 rounded-[2px] hover:bg-cream transition-colors"
      >
        {CTA.label}
      </Link>
    </div>
  );
}
