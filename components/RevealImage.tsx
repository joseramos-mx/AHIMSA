"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type RevealImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  /**
   * 0..1 motion value que controla el reveal (p. ej. el scroll horizontal de
   * DayInParis). Si se omite, el reveal se dispara solo una vez al entrar en
   * pantalla.
   */
  progress?: MotionValue<number>;
  /** When (in `progress`) the reveal starts. Default 0.1 */
  revealStart?: number;
  /** When (in `progress`) the reveal completes. Default 0.5 */
  revealEnd?: number;
  /** Extra translateX motion for parallax (px). Optional. */
  parallaxX?: MotionValue<number>;
  /**
   * Parallax vertical de la imagen dentro de su marco (p. ej. "-4%".."4%").
   * La imagen se agranda un 5% arriba y abajo para no dejar huecos.
   */
  parallaxY?: MotionValue<string>;
};

/**
 * Imagen que se revela con clip-path (de abajo hacia arriba) + scale interno.
 * Si la imagen 404ea, muestra un bloque de color con el nombre del archivo
 * para no romper el layout.
 */
export default function RevealImage({
  src,
  alt,
  sizes = "(min-width: 768px) 40vw, 80vw",
  className = "",
  progress,
  revealStart = 0.1,
  revealEnd = 0.5,
  parallaxX,
  parallaxY,
}: RevealImageProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Modo "al entrar en pantalla": progreso propio animado de 0 a 1.
  const ownProgress = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  useEffect(() => {
    if (progress) return;
    if (reduce) {
      ownProgress.set(1);
    } else if (inView) {
      const controls = animate(ownProgress, 1, {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      });
      return () => controls.stop();
    }
  }, [progress, reduce, inView, ownProgress]);

  const p = progress ?? ownProgress;
  const start = progress ? revealStart : 0;
  const end = progress ? revealEnd : 1;

  // Clip-path inset(top right bottom left). Reveal de abajo hacia arriba.
  const insetTop = useTransform(p, [start, end], [100, 0]);
  const clipPath = useMotionTemplate`inset(${insetTop}% 0 0 0)`;
  const scale = useTransform(p, [start, end], [1.15, 1]);

  const containerStyle = parallaxX
    ? { x: parallaxX, clipPath }
    : { clipPath };

  const filename = src.split("/").pop() ?? src;

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-[#DCD8D1] ${className}`}
      style={containerStyle}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/15 p-4 text-center">
          <span className="font-figtree text-[11px] text-ink/60 break-all">
            {filename}
          </span>
        </div>
      ) : (
        <motion.div
          className={`absolute inset-x-0 will-change-transform ${
            parallaxY ? "-inset-y-[5%]" : "inset-y-0"
          }`}
          style={parallaxY ? { scale, y: parallaxY } : { scale }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
            onError={() => setFailed(true)}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
