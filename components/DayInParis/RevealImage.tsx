"use client";

import Image from "next/image";
import { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "motion/react";

type RevealImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  /** 0..1 motion value controlling the reveal. */
  progress: MotionValue<number>;
  /** When (in `progress`) the reveal starts. Default 0.1 */
  revealStart?: number;
  /** When (in `progress`) the reveal completes. Default 0.5 */
  revealEnd?: number;
  /** Extra translateX motion for parallax (px). Optional. */
  parallaxX?: MotionValue<number>;
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
}: RevealImageProps) {
  const [failed, setFailed] = useState(false);

  // Clip-path inset(top right bottom left). Reveal de abajo hacia arriba.
  const insetTop = useTransform(progress, [revealStart, revealEnd], [100, 0]);
  const clipPath = useMotionTemplate`inset(${insetTop}% 0 0 0)`;
  const scale = useTransform(progress, [revealStart, revealEnd], [1.15, 1]);

  const containerStyle = parallaxX
    ? { x: parallaxX, clipPath }
    : { clipPath };

  const filename = src.split("/").pop() ?? src;

  return (
    <motion.div
      className={`relative overflow-hidden bg-ink/10 ${className}`}
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
          className="absolute inset-0 will-change-transform"
          style={{ scale }}
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
