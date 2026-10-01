"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SLIDES, type DaySlide } from "@/lib/day-in-paris";
import Slide from "./Slide";
import DrawnPath from "./DrawnPath";

const SLIDES_COUNT = SLIDES.length;

/**
 * Hook por slide: deriva un "focus" 0..1 que vale 0 cuando el slide
 * está fuera del viewport por la derecha, 1 cuando está perfectamente
 * centrado y 1 cuando ya salió por la izquierda. De esta forma al
 * hacer scroll inverso el reveal es reversible SOLO durante la fase
 * de entrada, no cuando el usuario ya pasó el slide.
 */
function SlideWithFocus({
  slide,
  index,
  progress,
  trackX,
  slidesCount,
}: {
  slide: DaySlide;
  index: number;
  progress: MotionValue<number>;
  trackX: MotionValue<number>;
  slidesCount: number;
}) {
  const slideFocus = useTransform(progress, (p) => {
    const v = p * (slidesCount - 1) - (index - 1);
    return Math.min(1, Math.max(0, v));
  });
  return (
    <Slide
      slide={slide}
      index={index}
      slideFocus={slideFocus}
      trackX={trackX}
    />
  );
}

export default function DayInParis() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ trackWidth: 0, viewportWidth: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0001,
    mass: 0.6,
  });

  const staticProgress = useMotionValue(1);
  const staticTrackX = useMotionValue(0);

  useLayoutEffect(() => {
    if (reduce) return;
    const measure = () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;
      setMetrics({
        trackWidth: track.scrollWidth,
        viewportWidth: sticky.clientWidth,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (stickyRef.current) ro.observe(stickyRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, [reduce]);

  const translateX = useTransform(smooth, (p) => {
    return -p * Math.max(0, metrics.trackWidth - metrics.viewportWidth);
  });

  // Rama reduced-motion: scroll horizontal nativo con snap. Trazo completo.
  if (reduce) {
    return (
      <section
        id="un-dia"
        className="relative bg-cream text-ink"
        aria-label="Un día en París con Ahimsa"
      >
        <div
          className="
            relative flex h-screen overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory
          "
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ width: `${SLIDES_COUNT * 100}vw` }}
          >
            <DrawnPath progress={staticProgress} slidesCount={SLIDES_COUNT} />
          </div>
          {SLIDES.map((slide, i) => (
            <div key={slide.id} className="snap-start">
              <Slide
                slide={slide}
                index={i}
                slideFocus={staticProgress}
                trackX={staticTrackX}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="un-dia"
      className="relative bg-cream text-ink"
      style={{ height: `${SLIDES_COUNT * 100}vh` }}
      aria-label="Un día en París con Ahimsa"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        <motion.div
          ref={trackRef}
          className="relative flex h-full will-change-transform"
          style={{ x: translateX, width: `${SLIDES_COUNT * 100}vw` }}
        >
          <DrawnPath progress={smooth} slidesCount={SLIDES_COUNT} />
          {SLIDES.map((slide, i) => (
            <SlideWithFocus
              key={slide.id}
              slide={slide}
              index={i}
              progress={smooth}
              trackX={translateX}
              slidesCount={SLIDES_COUNT}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
