"use client";

import Link from "next/link";
import {
  motion,
  useTransform,
  type MotionValue,
} from "motion/react";
import type {
  DayClosing,
  DayIntro,
  DayMoment,
  DaySlide,
} from "@/lib/day-in-paris";
import RevealImage from "./RevealImage";

type SlideProps = {
  slide: DaySlide;
  index: number;
  slideFocus: MotionValue<number>;
  /** Track-level translateX; used for subtle parallax within the slide. */
  trackX: MotionValue<number>;
};

/** Divisor vertical a la izquierda del slide (excepto el primero). */
function SlideDivider({ hidden }: { hidden: boolean }) {
  if (hidden) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 top-[10%] bottom-[10%] w-px bg-ink/20"
    />
  );
}

function MomentText({
  moment,
  slideFocus,
  startAt,
  className = "",
}: {
  moment: DayMoment;
  slideFocus: MotionValue<number>;
  startAt: number;
  className?: string;
}) {
  const opacity = useTransform(
    slideFocus,
    [startAt, startAt + 0.25],
    [0, 1]
  );
  const y = useTransform(slideFocus, [startAt, startAt + 0.25], [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`flex flex-col gap-2 max-w-[240px] ${className}`}
    >
      <span className="font-figtree text-[12px] font-medium uppercase tracking-[0.2em] text-accent-dark">
        {moment.time}
      </span>
      <h3 className="font-playfair text-[22px] leading-tight text-ink">
        {moment.title}
      </h3>
      <p className="font-figtree text-[15px] leading-[1.5] text-ink/85">
        {moment.text}
      </p>
    </motion.div>
  );
}

function IntroSubtitle({
  subtitle,
  slideFocus,
}: {
  subtitle: string;
  slideFocus: MotionValue<number>;
}) {
  const opacity = useTransform(slideFocus, [0.4, 0.7], [0, 1]);
  const y = useTransform(slideFocus, [0.4, 0.7], [16, 0]);
  return (
    <motion.p
      style={{ opacity, y }}
      className="
        absolute right-[6vw] bottom-[12vh] max-w-[260px]
        font-figtree text-[17px] leading-[1.5] text-ink/85
      "
    >
      {subtitle}
    </motion.p>
  );
}

function ClosingBlock({
  closing,
  slideFocus,
}: {
  closing: DayClosing;
  slideFocus: MotionValue<number>;
}) {
  const opacity = useTransform(slideFocus, [0.55, 0.9], [0, 1]);
  const y = useTransform(slideFocus, [0.55, 0.9], [24, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="flex flex-col gap-6 max-w-[380px] self-center"
    >
      <h2 className="font-playfair font-normal text-[36px] md:text-[48px] leading-[1.1] text-ink">
        {closing.title}
      </h2>
      <Link
        href={closing.cta.href}
        className="
          inline-flex items-center self-start
          font-figtree font-medium text-sm md:text-base
          bg-ink text-white px-6 py-3 rounded-[2px]
          transition-colors duration-200 hover:bg-accent
        "
      >
        {closing.cta.label}
      </Link>
    </motion.div>
  );
}

function IntroLayout({
  intro,
  slideFocus,
  parallax,
  index,
}: {
  intro: DayIntro;
  slideFocus: MotionValue<number>;
  parallax: MotionValue<number>;
  index: number;
}) {
  return (
    <article
      className="relative shrink-0 w-screen h-full flex items-center justify-center overflow-hidden"
      aria-label="Introducción"
    >
      <SlideDivider hidden={index === 0} />

      <div className="relative">
        <RevealImage
          src={intro.image.src}
          alt={intro.image.alt}
          className="w-[260px] md:w-[320px] aspect-[2/3] rounded-[2px]"
          progress={slideFocus}
          revealStart={0.1}
          revealEnd={0.55}
          sizes="(min-width: 1024px) 320px, 60vw"
          parallaxX={parallax}
        />
        <h2 className="pointer-events-none">
          <span
            className="
              absolute -top-10 -left-24
              md:-top-16 md:-left-40
              font-playfair font-normal
              text-[68px] md:text-[96px] leading-none text-ink
              whitespace-nowrap z-20
            "
          >
            {intro.titleTop}
          </span>
          <span
            className="
              absolute -bottom-10 -right-24
              md:-bottom-16 md:-right-40
              font-playfair font-normal
              text-[68px] md:text-[96px] leading-none text-ink
              whitespace-nowrap z-20
            "
          >
            {intro.titleBottom}
          </span>
        </h2>
      </div>

      <IntroSubtitle subtitle={intro.subtitle} slideFocus={slideFocus} />
    </article>
  );
}

function MomentosLayout({
  slideId,
  moments,
  closing,
  slideFocus,
  parallax,
  index,
}: {
  slideId: string;
  moments: DayMoment[];
  closing?: DayClosing;
  slideFocus: MotionValue<number>;
  parallax: MotionValue<number>;
  index: number;
}) {
  return (
    <article
      className="relative shrink-0 w-screen h-full overflow-hidden"
      aria-label={slideId}
    >
      <SlideDivider hidden={index === 0} />

      <div className="relative h-full flex items-center justify-between px-[6vw] md:px-[8vw] gap-[6vw]">
        {moments.map((moment, i) => {
          const base = i * 0.15 + 0.15;
          const isBleed =
            (slideId === "manana" && i === 1) ||
            (slideId === "noche" && i === 0);
          const isShorter =
            (slideId === "manana" && i === 0) ||
            (slideId === "tarde" && i === 1);

          return (
            <div
              key={moment.title}
              className={`
                flex gap-8 lg:gap-10
                ${isBleed ? "self-stretch items-center" : "flex-col items-start"}
                ${isShorter && !isBleed ? "mt-16 md:mt-24" : ""}
                ${slideId === "tarde" && i === 1 ? "mt-32" : ""}
              `}
            >
              <RevealImage
                src={moment.image.src}
                alt={moment.image.alt}
                className={
                  isBleed
                    ? "h-[85%] w-[280px] md:w-[340px] self-center rounded-[2px]"
                    : isShorter
                    ? "aspect-square w-[200px] md:w-[220px] rounded-[2px]"
                    : "aspect-[3/4] w-[260px] md:w-[300px] rounded-[2px]"
                }
                progress={slideFocus}
                revealStart={base}
                revealEnd={base + 0.3}
                sizes="(min-width: 1024px) 320px, 60vw"
                parallaxX={parallax}
              />
              <MomentText
                moment={moment}
                slideFocus={slideFocus}
                startAt={base + 0.1}
                className={isBleed ? "self-end mb-10 md:mb-16" : ""}
              />
            </div>
          );
        })}

        {closing && <ClosingBlock closing={closing} slideFocus={slideFocus} />}
      </div>
    </article>
  );
}

export default function Slide({
  slide,
  index,
  slideFocus,
  trackX,
}: SlideProps) {
  // Parallax sutil, factor leve diferente por índice.
  const factor = 0.04 + (index % 2) * 0.03;
  const parallax = useTransform(trackX, (x) => -x * factor);

  if (slide.type === "intro") {
    return (
      <IntroLayout
        intro={slide.intro}
        slideFocus={slideFocus}
        parallax={parallax}
        index={index}
      />
    );
  }

  return (
    <MomentosLayout
      slideId={slide.id}
      moments={slide.moments}
      closing={slide.closing}
      slideFocus={slideFocus}
      parallax={parallax}
      index={index}
    />
  );
}
