"use client";

import {
  motion,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "motion/react";
import {
  PATH_1_D,
  PATH_1_VIEWBOX,
  PATH_2_D,
  PATH_2_VIEWBOX,
  LINE_1_LAYOUT,
  LINE_2_LAYOUT,
  DRAW_LEAD,
} from "@/lib/day-paths";

type DrawnPathProps = {
  progress: MotionValue<number>;
  slidesCount: number;
};

/**
 * Dos trazos a mano (shapes rellenos exportados de Figma) que se dibujan
 * progresivamente conforme avanza el scroll horizontal. El dibujo se hace
 * revelando una `rect` dentro de un <clipPath> (barrido de izquierda a
 * derecha). El avión al final aparece cuando el segundo trazo termina.
 */
export default function DrawnPath({ progress, slidesCount }: DrawnPathProps) {
  // drawFraction: fracción del "trazo total" que debe estar dibujada.
  // Avanza más rápido que el track (por LEAD) para que la punta siempre
  // esté dentro del viewport. Ver lib/day-paths.ts para ajustar.
  const drawFraction = useTransform(progress, (p) => {
    const base = (p * (slidesCount - 1) + 1) / slidesCount;
    return Math.min(1, Math.max(0, base + DRAW_LEAD));
  });

  // Mapeo global → progreso local por línea.
  // Línea 1 se dibuja mientras drawFraction va de LINE_1 start → end.
  // Línea 2, del segundo tramo.
  const line1Start = LINE_1_LAYOUT.left / 100;
  const line1End = (LINE_1_LAYOUT.left + LINE_1_LAYOUT.width) / 100;
  const line2Start = LINE_2_LAYOUT.left / 100;
  const line2End = (LINE_2_LAYOUT.left + LINE_2_LAYOUT.width) / 100;

  // Para cada línea, cuánto del viewBox mostrar (0 → viewBoxWidth).
  const [, , vb1W] = PATH_1_VIEWBOX.split(" ").map(Number);
  const [, , vb2W] = PATH_2_VIEWBOX.split(" ").map(Number);

  const line1ClipW = useTransform(
    drawFraction,
    [line1Start, line1End],
    [0, vb1W]
  );
  const line2ClipW = useTransform(
    drawFraction,
    [line2Start, line2End],
    [0, vb2W]
  );

  // Avión: aparece cuando el trazo 2 llega al final.
  const planeOpacity = useTransform(drawFraction, [0.96, 1], [0, 1]);
  const planeRotate = useTransform(drawFraction, [0.96, 1], [-25, -8]);
  const planeTranslate = useTransform(drawFraction, [0.96, 1], [-24, 0]);
  const planeTransformX = useMotionTemplate`${planeTranslate}px`;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 text-ink/80"
      aria-hidden="true"
    >
      {/* Línea 1 */}
      <svg
        className="absolute block"
        style={{
          left: `${LINE_1_LAYOUT.left}%`,
          top: `${LINE_1_LAYOUT.top}%`,
          width: `${LINE_1_LAYOUT.width}%`,
          height: "auto",
        }}
        viewBox={PATH_1_VIEWBOX}
      >
        <defs>
          <clipPath id="day-draw-clip-1">
            <motion.rect x={0} y={0} height={PATH_1_VIEWBOX.split(" ")[3]} width={line1ClipW} />
          </clipPath>
        </defs>
        <path
          d={PATH_1_D}
          fill="currentColor"
          clipPath="url(#day-draw-clip-1)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Línea 2 */}
      <svg
        className="absolute block"
        style={{
          left: `${LINE_2_LAYOUT.left}%`,
          top: `${LINE_2_LAYOUT.top}%`,
          width: `${LINE_2_LAYOUT.width}%`,
          height: "auto",
        }}
        viewBox={PATH_2_VIEWBOX}
      >
        <defs>
          <clipPath id="day-draw-clip-2">
            <motion.rect x={0} y={0} height={PATH_2_VIEWBOX.split(" ")[3]} width={line2ClipW} />
          </clipPath>
        </defs>
        <path
          d={PATH_2_D}
          fill="currentColor"
          clipPath="url(#day-draw-clip-2)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Avión al final del trazo */}
      <motion.svg
        className="absolute"
        style={{
          left: `${LINE_2_LAYOUT.left + LINE_2_LAYOUT.width - 2}%`,
          top: `${LINE_2_LAYOUT.top + 2}%`,
          opacity: planeOpacity,
          rotate: planeRotate,
          x: planeTransformX,
        }}
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 2L2 9l9 4 4 9 7-20Z" />
        <path d="M11 13l6-6" />
      </motion.svg>
    </div>
  );
}
