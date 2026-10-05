"use client";

import Image from "next/image";
import { useCallback, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { getVisibleTestimonials, type Testimonial } from "@/lib/testimonials";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import SliderControls from "./SliderControls";
import TestimonialSlide from "./TestimonialSlide";

/** Distancia (px) o velocidad (px/s) de arrastre para cambiar de slide. */
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;

const VISIBLE = getVisibleTestimonials();

export default function Testimonials() {
  // En producción sin testimonios publicados la sección no existe (el link
  // del nav también se oculta, ver lib/nav.ts).
  if (VISIBLE.length === 0) return null;
  return <Carousel items={VISIBLE} />;
}

function Carousel({ items }: { items: Testimonial[] }) {
  const reduce = useReducedMotion();
  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);
  // Hasta la primera navegación la foto usa RevealImage al entrar en pantalla.
  const [navigated, setNavigated] = useState(false);
  const total = items.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setPage(([i]) => {
        const next = Math.min(total - 1, Math.max(0, i + dir));
        return next === i ? [i, dir] : [next, dir];
      });
      setNavigated(true);
    },
    [total]
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) {
      go(1);
    } else if (
      info.offset.x > SWIPE_DISTANCE ||
      info.velocity.x > SWIPE_VELOCITY
    ) {
      go(-1);
    }
  };

  const current = items[index];
  const next = items[index + 1];

  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-title"
      className="scroll-mt-16 bg-cream py-20 text-ink lg:py-32"
    >
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Testimonios de clientes"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="mx-auto max-w-[1200px] px-6 focus-visible:outline-offset-8 md:px-10"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal
              as="p"
              distance={0}
              className="font-figtree text-[13px] font-medium uppercase tracking-[0.2em] text-accent-dark"
            >
              Testimonios
            </Reveal>
            <SplitHeading
              id="testimonios-title"
              delay={0.1}
              text="Lo que dicen quienes ya viajaron conmigo"
              className="mt-5 max-w-[680px] font-fraunces text-[34px] font-light leading-[1.1] text-ink lg:text-[48px]"
            />
          </div>
          <SliderControls
            index={index}
            total={total}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
          />
        </div>

        {/* Anuncia el cambio a lectores de pantalla. */}
        <p aria-live="polite" className="sr-only">
          {navigated
            ? `Testimonio ${index + 1} de ${total}: ${current.name}`
            : ""}
        </p>

        {/* Todos los slides comparten la misma celda del grid: las copias
            invisibles fijan la altura a la de la cita más larga y el que
            sale y el que entra se superponen durante la transición.
            drag="x" deja pasar el scroll vertical (touch-action: pan-y). */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          dragSnapToOrigin
          onDragEnd={onDragEnd}
          className="mt-12 grid cursor-grab select-none active:cursor-grabbing lg:mt-16"
        >
          {items.map((t, i) => (
            <div key={`ghost-${t.id}`} className="[grid-area:1/1]">
              <TestimonialSlide
                testimonial={t}
                index={i}
                total={total}
                mode="ghost"
              />
            </div>
          ))}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              className="[grid-area:1/1]"
            >
              <TestimonialSlide
                testimonial={current}
                index={index}
                total={total}
                mode={navigated ? "slide" : "reveal"}
                direction={direction}
                reduce={reduce}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Precarga la foto del siguiente testimonio (mismo sizes → misma URL). */}
        {next?.image && (
          <div aria-hidden="true" className="hidden">
            <Image
              src={next.image}
              alt=""
              width={800}
              height={1000}
              sizes="(min-width: 1024px) 40vw, 100vw"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
}
