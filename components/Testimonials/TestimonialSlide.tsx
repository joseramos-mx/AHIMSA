"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, type Variants } from "motion/react";
import type { Testimonial } from "@/lib/testimonials";
import { NICHES } from "@/lib/niches";
import RevealImage from "@/components/RevealImage";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const EASE = [0.22, 1, 0.36, 1] as const;
const SIZES = "(min-width: 1024px) 40vw, 100vw";

export const PHOTO_FRAME =
  "relative aspect-square w-full overflow-hidden rounded-[2px] lg:aspect-[4/5]";

/** Las variantes reciben la dirección (1 = siguiente, -1 = anterior). Las
 *  dos fotos barren hacia el mismo lado: la que sale se recorta hacia ese
 *  lado y la nueva se descubre desde el contrario. */
const photoVariants: Variants = {
  enter: (dir: number) => ({
    clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
  }),
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.7, ease: EASE },
  },
  exit: (dir: number) => ({
    clipPath: dir > 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
    transition: { duration: 0.7, ease: EASE },
  }),
};

const scaleVariants: Variants = {
  enter: { scale: 1.08 },
  center: { scale: 1, transition: { duration: 0.7, ease: EASE } },
  exit: { scale: 1 },
};

const textVariants: Variants = {
  enter: { opacity: 0, y: 16 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.12, ease: EASE },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: EASE } },
};

const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

function Photo({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-ink/15 p-4 text-center">
        <span className="break-all font-figtree text-[11px] text-ink/60">
          {src.split("/").pop()}
        </span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={SIZES}
      draggable={false}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

type TestimonialSlideProps = {
  testimonial: Testimonial;
  index: number;
  total: number;
  /**
   * reveal: primera vista (RevealImage al entrar en pantalla).
   * slide: transición entre testimonios.
   * ghost: copia invisible que solo reserva altura.
   */
  mode: "reveal" | "slide" | "ghost";
  /** 1 = siguiente, -1 = anterior (para las variantes de la foto). */
  direction?: number;
  reduce?: boolean;
};

export default function TestimonialSlide({
  testimonial: t,
  index,
  total,
  mode,
  direction = 1,
  reduce = false,
}: TestimonialSlideProps) {
  const ghost = mode === "ghost";
  const niche = NICHES.find((n) => n.slug === t.nicheSlug);
  const animated = mode === "slide";
  const photoV = reduce ? fadeVariants : photoVariants;
  const textV = reduce ? fadeVariants : textVariants;

  let photo;
  if (ghost) {
    photo = <div className={PHOTO_FRAME} />;
  } else if (!t.image) {
    // Sin foto todavía: mismo marco (la altura no cambia) con una comilla
    // decorativa.
    photo = (
      <motion.div
        custom={direction}
        variants={animated ? photoV : undefined}
        aria-hidden="true"
        className={`${PHOTO_FRAME} flex items-center justify-center bg-[#E9E2D6]`}
      >
        <span className="translate-y-[12%] font-fraunces text-[220px] font-light leading-none text-accent/35 [font-variation-settings:'opsz'_144]">
          “
        </span>
      </motion.div>
    );
  } else if (mode === "reveal") {
    photo = (
      <div className={PHOTO_FRAME}>
        <RevealImage
          src={t.image}
          alt={t.imageAlt ?? ""}
          sizes={SIZES}
          className="!absolute inset-0"
        />
      </div>
    );
  } else {
    photo = (
      <motion.div
        custom={direction}
        variants={animated ? photoV : undefined}
        className={`${PHOTO_FRAME} bg-[#DCD8D1]`}
      >
        <motion.div
          variants={animated && !reduce ? scaleVariants : undefined}
          className="absolute inset-0"
        >
          <Photo src={t.image} alt={t.imageAlt ?? ""} />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div
      {...(ghost
        ? { "aria-hidden": true }
        : {
            role: "group",
            "aria-roledescription": "testimonio",
            "aria-label": `Testimonio ${index + 1} de ${total}`,
          })}
      className={`grid grid-cols-1 items-center gap-y-8 lg:grid-cols-12 lg:gap-x-10 ${
        ghost ? "invisible" : ""
      }`}
    >
      <div className="relative lg:col-span-5">
        {photo}
        {!ghost && !t.published && !IS_PRODUCTION && (
          <span className="absolute left-3 top-3 z-10 rounded-[2px] bg-ink px-2 py-1 font-figtree text-[11px] font-medium uppercase tracking-[0.15em] text-white">
            Borrador
          </span>
        )}
      </div>

      <motion.figure
        variants={animated ? textV : undefined}
        className="lg:col-span-6 lg:col-start-7"
      >
        <span
          aria-hidden="true"
          className="block h-[60px] font-fraunces font-light text-[120px] leading-[1] text-accent/40"
        >
          “
        </span>
        <blockquote className="max-w-[560px] font-fraunces text-[22px] font-light leading-[1.35] text-ink lg:text-[30px]">
          <p>{t.quote}</p>
        </blockquote>
        <span aria-hidden="true" className="mt-8 block h-px w-10 bg-accent" />
        <figcaption className="mt-6 flex flex-col items-start gap-1">
          <span className="font-figtree text-[16px] font-medium text-ink">
            {t.name}
          </span>
          {(t.city || t.destination || t.source) && (
            <span className="font-figtree text-[14px] text-ink/65">
              {[t.city, t.destination, t.source && `vía ${t.source}`]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
          {niche && (
            <span className="mt-3 border border-accent px-2 py-1 font-figtree text-[12px] uppercase tracking-[0.12em] text-accent-dark">
              {niche.name}
            </span>
          )}
        </figcaption>
      </motion.figure>
    </div>
  );
}
