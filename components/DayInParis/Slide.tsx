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
import RevealImage from "@/components/RevealImage";

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

/**
 * Medidas tomadas del mockup de Figma (frame 16:8.5 aprox.), expresadas en
 * vw/vh para que escalen con el viewport. Los trazos de DrawnPath
 * (lib/day-paths.ts) se anclan a los bordes de estas imágenes: si mueves
 * una imagen, ajusta también el trazo correspondiente.
 */
function IntroLayout({
  intro,
  slideFocus,
  index,
}: {
  intro: DayIntro;
  slideFocus: MotionValue<number>;
  index: number;
}) {
  return (
    <article
      className="relative z-10 shrink-0 w-screen h-full overflow-hidden"
      aria-label="Introducción"
    >
      <SlideDivider hidden={index === 0} />

      <div
        className="absolute"
        style={{ left: "30.3vw", top: "20.6vh", width: "30.9vw", height: "66.7vh" }}
      >
        <RevealImage
          src={intro.image.src}
          alt={intro.image.alt}
          className="h-full w-full rounded-[2px]"
          progress={slideFocus}
          revealStart={0.1}
          revealEnd={0.55}
          sizes="31vw"
        />
      </div>

      {/* top = baseline - 0.915em: coloca la línea base de Playfair donde
          cae en el mockup (cualquier tamaño de fuente). */}
      <h2 className="pointer-events-none font-playfair font-normal leading-none text-ink">
        <span
          className="absolute whitespace-nowrap z-20"
          style={{ left: "25.1vw", top: "calc(21.4vh - 0.915em)", fontSize: "6.2vw" }}
        >
          {intro.titleTop}
        </span>
        <span
          className="absolute whitespace-nowrap z-20"
          style={{ left: "53.4vw", top: "calc(91vh - 0.915em)", fontSize: "6.2vw" }}
        >
          {intro.titleBottom}
        </span>
      </h2>

      <IntroSubtitle subtitle={intro.subtitle} slideFocus={slideFocus} />
    </article>
  );
}

type Box = { left: string; top: string; width: string; height: string };

function PlacedImage({
  moment,
  box,
  slideFocus,
  revealStart,
}: {
  moment: DayMoment;
  box: Box;
  slideFocus: MotionValue<number>;
  revealStart: number;
}) {
  return (
    <div className="absolute" style={box}>
      <RevealImage
        src={moment.image.src}
        alt={moment.image.alt}
        className="h-full w-full rounded-[2px]"
        progress={slideFocus}
        revealStart={revealStart}
        revealEnd={revealStart + 0.3}
        sizes={box.width}
      />
    </div>
  );
}

/** Frame 3 del mockup: imagen a sangre + cuadrada arriba + textos abajo. */
function BleedLayout({
  slideId,
  moments,
  slideFocus,
  index,
}: {
  slideId: string;
  moments: DayMoment[];
  slideFocus: MotionValue<number>;
  index: number;
}) {
  const [square, bleed] = moments;
  return (
    <article
      className="relative z-10 shrink-0 w-screen h-full overflow-hidden"
      aria-label={slideId}
    >
      <SlideDivider hidden={index === 0} />
      <PlacedImage
        moment={bleed}
        box={{ left: "7.3vw", top: "0vh", width: "36.3vw", height: "100vh" }}
        slideFocus={slideFocus}
        revealStart={0.15}
      />
      <PlacedImage
        moment={square}
        box={{ left: "46.4vw", top: "5.3vh", width: "25.1vw", height: "49.3vh" }}
        slideFocus={slideFocus}
        revealStart={0.3}
      />
      <div
        className="absolute flex gap-[4vw]"
        style={{ left: "46.4vw", top: "64vh" }}
      >
        {moments.map((moment, i) => (
          <MomentText
            key={moment.title}
            moment={moment}
            slideFocus={slideFocus}
            startAt={0.4 + i * 0.1}
          />
        ))}
      </div>
    </article>
  );
}

/** Frame 2 del mockup: vertical + cuadrada (inicio del trazo 2) + textos. */
function SplitLayout({
  slideId,
  moments,
  slideFocus,
  index,
}: {
  slideId: string;
  moments: DayMoment[];
  slideFocus: MotionValue<number>;
  index: number;
}) {
  const [portrait, square] = moments;
  return (
    <article
      className="relative z-10 shrink-0 w-screen h-full overflow-hidden"
      aria-label={slideId}
    >
      <SlideDivider hidden={index === 0} />
      <PlacedImage
        moment={portrait}
        box={{ left: "5.6vw", top: "11.1vh", width: "28.6vw", height: "77.9vh" }}
        slideFocus={slideFocus}
        revealStart={0.15}
      />
      <PlacedImage
        moment={square}
        box={{ left: "36.5vw", top: "33.9vh", width: "25.2vw", height: "49.5vh" }}
        slideFocus={slideFocus}
        revealStart={0.3}
      />
      <div
        className="absolute flex flex-col gap-8"
        style={{ left: "66.1vw", top: "50vh" }}
      >
        {moments.map((moment, i) => (
          <MomentText
            key={moment.title}
            moment={moment}
            slideFocus={slideFocus}
            startAt={0.4 + i * 0.1}
          />
        ))}
      </div>
    </article>
  );
}

/** Un solo momento: imagen alta a la izquierda (destino del avión del
 *  trazo 2, ver LINE_2_LAYOUT) y texto a la derecha. */
function SingleLayout({
  slideId,
  moments,
  slideFocus,
  index,
}: {
  slideId: string;
  moments: DayMoment[];
  slideFocus: MotionValue<number>;
  index: number;
}) {
  const [moment] = moments;
  return (
    <article
      className="relative z-10 shrink-0 w-screen h-full overflow-hidden"
      aria-label={slideId}
    >
      <SlideDivider hidden={index === 0} />
      <PlacedImage
        moment={moment}
        box={{ left: "10vw", top: "7.5vh", width: "32vw", height: "85vh" }}
        slideFocus={slideFocus}
        revealStart={0.15}
      />
      <div className="absolute" style={{ left: "47vw", top: "62vh" }}>
        <MomentText moment={moment} slideFocus={slideFocus} startAt={0.4} />
      </div>
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
      className="relative z-10 shrink-0 w-screen h-full overflow-hidden"
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
      <IntroLayout intro={slide.intro} slideFocus={slideFocus} index={index} />
    );
  }

  if (slide.layout) {
    const Layout = {
      bleed: BleedLayout,
      split: SplitLayout,
      single: SingleLayout,
    }[slide.layout];
    return (
      <Layout
        slideId={slide.id}
        moments={slide.moments}
        slideFocus={slideFocus}
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
