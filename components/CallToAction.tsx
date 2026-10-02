"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { WHATSAPP_URL } from "@/lib/contact";
import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

/**
 * Imagen de fondo (public/media/cta/cta-bg.jpg, 2560px de ancho). Para
 * cambiarla, reemplaza ese archivo. Con null el fondo es un bloque ink.
 */
const BG_SRC: string | null = "/media/cta/cta-bg.jpg";

const BUTTON_BASE = `
  inline-flex h-12 w-full sm:w-auto items-center justify-center
  px-7 rounded-[2px] font-figtree font-medium text-[15px]
  transition-colors duration-200
  focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-[3px] focus-visible:outline-white
`;

export default function CallToAction() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax mientras la sección cruza la pantalla.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });
  const y = useTransform(smooth, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(smooth, [0, 1], [1.12, 1]);

  return (
    <section
      ref={sectionRef}
      id="empecemos"
      aria-labelledby="empecemos-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink text-white"
    >
      {/* Fondo: 20% más alto que la sección (-10% arriba y abajo). Con y de
          ±8% de su propia altura (= ±9.6% de la sección) nunca deja huecos. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -top-[10%] -bottom-[10%] -z-10 will-change-transform"
        style={reduce ? undefined : { y, scale }}
      >
        {BG_SRC ? (
          <Image
            src={BG_SRC}
            alt=""
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-ink" />
        )}
      </motion.div>

      {/* Overlay: negro 40% + radial más oscuro al centro, detrás del texto. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-center px-6 py-24 text-center md:px-10">
        <Reveal
          as="p"
          distance={0}
          className="font-figtree text-[13px] font-medium uppercase tracking-[0.2em] text-white/85"
        >
          Empecemos
        </Reveal>

        <SplitHeading
          id="empecemos-title"
          delay={0.15}
          text="Diseñemos juntos el viaje que tu familia va a recordar siempre."
          className="mt-6 font-playfair font-normal text-[38px] leading-[1.05] text-white md:text-[56px] lg:text-[80px]"
        />

        <Reveal
          as="p"
          delay={0.6}
          distance={16}
          className="mt-6 max-w-[560px] font-figtree text-[18px] leading-[1.6] text-white/85 md:mt-8"
        >
          Cuéntame tu idea, tus fechas y con quién viajas. Yo me encargo del
          resto.
        </Reveal>

        <Reveal
          delay={0.75}
          distance={16}
          className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Link
            href="/contacto"
            className={`${BUTTON_BASE} bg-white text-ink hover:bg-cream`}
          >
            Cotiza tu viaje
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUTTON_BASE} border border-white text-white hover:bg-white hover:text-ink`}
          >
            Escríbeme por WhatsApp
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
