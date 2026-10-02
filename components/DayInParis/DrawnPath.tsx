"use client";

import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  PATH_1_D,
  PATH_1_VIEWBOX,
  PATH_2_D,
  PATH_2_VIEWBOX,
  LINE_1_LAYOUT,
  LINE_2_LAYOUT,
  DRAW_TIP_VW,
  type LineLayout,
} from "@/lib/day-paths";

type DrawnPathProps = {
  progress: MotionValue<number>;
  slidesCount: number;
};

/** Grosor del trazo de la máscara (unidades del viewBox). El trazo real mide
 *  ~1.2; con 2.5 cubre el ancho completo desde cualquiera de sus dos
 *  bordes sin revelar de más donde el trazo se cruza consigo mismo. */
const MASK_STROKE = 2.5;

/**
 * Un trazo a mano (shape relleno exportado de Figma) que se dibuja
 * siguiendo su recorrido. El shape es el contorno de una línea: va de ida
 * por un borde y regresa por el otro. La máscara pinta ese mismo contorno
 * con stroke-dasharray mostrando [0, t/2] y [1 - t/2, 1] (pathLength = 1),
 * o sea avanza desde el inicio por ambos bordes a la vez y los dos se
 * encuentran en la punta.
 */
function Line({
  id,
  d,
  viewBox,
  layout,
  tipVw,
}: {
  id: string;
  d: string;
  viewBox: string;
  layout: LineLayout;
  tipVw: MotionValue<number>;
}) {
  const [, , vbW, vbH] = viewBox.split(" ").map(Number);
  const scale = layout.width / vbW; // vw por unidad del viewBox

  const t = useTransform(tipVw, (tip) =>
    Math.min(1, Math.max(0, (tip - layout.left) / layout.width))
  );
  const half = useTransform(t, (v) => v / 2);
  const gap = useTransform(t, (v) => 1 - v);
  const dashArray = useMotionTemplate`${half} ${gap} ${half} 0`;

  return (
    <svg
      className="absolute block overflow-visible"
      style={{
        left: `${layout.left}vw`,
        top: `calc(${layout.startTop}vh - ${layout.startY * scale}vw)`,
        width: `${layout.width}vw`,
        height: "auto",
      }}
      viewBox={viewBox}
    >
      <defs>
        <mask
          id={id}
          maskUnits="userSpaceOnUse"
          x={-MASK_STROKE}
          y={-MASK_STROKE}
          width={vbW + MASK_STROKE * 2}
          height={vbH + MASK_STROKE * 2}
        >
          <motion.path
            d={d}
            pathLength={1}
            fill="none"
            stroke="white"
            strokeWidth={MASK_STROKE}
            strokeLinecap="butt"
            strokeDasharray={dashArray}
          />
        </mask>
      </defs>
      <path d={d} fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}

/**
 * Los dos trazos del "Día en París". El avión al final ya viene dibujado
 * dentro de line2.svg. Posiciones en lib/day-paths.ts.
 */
export default function DrawnPath({ progress, slidesCount }: DrawnPathProps) {
  // Punta de la pluma en vw del track: borde izquierdo del viewport
  // (p × (N-1) × 100vw) + DRAW_TIP_VW.
  const tipVw = useTransform(
    progress,
    (p) => p * (slidesCount - 1) * 100 + DRAW_TIP_VW
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 text-ink/80"
      aria-hidden="true"
    >
      <Line
        id="day-draw-mask-1"
        d={PATH_1_D}
        viewBox={PATH_1_VIEWBOX}
        layout={LINE_1_LAYOUT}
        tipVw={tipVw}
      />
      <Line
        id="day-draw-mask-2"
        d={PATH_2_D}
        viewBox={PATH_2_VIEWBOX}
        layout={LINE_2_LAYOUT}
        tipVw={tipVw}
      />
    </div>
  );
}
