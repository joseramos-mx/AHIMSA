"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Ancho del SVG (px); el trazo serpentea alrededor de su centro. */
const WIDTH = 24;
const CX = WIDTH / 2;
const SAMPLES = 400;
const ACCENT = "#B08A5B";
const CREAM = "#F3EEE6";

/** Curva suave de (CX, a) a (CX, b). */
function wiggle(a: number, b: number, fromX = CX) {
  const d = b - a;
  return `C ${fromX - 8} ${a + d * 0.35} ${CX + 8} ${a + d * 0.65} ${CX} ${b}`;
}

/**
 * Trazo PLACEHOLDER generado a partir de la posición real de cada paso:
 * baja serpenteando, pasa por el centro de cada número y hace un pequeño
 * loop a la mitad entre un paso y el siguiente.
 *
 * Para usar un trazo de Figma: exporta un path con stroke (no outline),
 * guárdalo en public/media/how/line.svg y sustituye esta función por una que
 * escale ese `d` al alto medido (`h`) — p. ej. envolviéndolo en
 * <path transform={`scale(${WIDTH / vbW} ${h / vbH})`}>; con
 * vector-effect non-scaling-stroke el grosor se mantiene en 1.5px. Los
 * puntos siguen ubicados en los números de cada paso.
 */
function buildPath(h: number, dots: number[]) {
  if (dots.length === 0) return `M ${CX} 0 L ${CX} ${h}`;
  let d = `M ${CX} 0 ${wiggle(0, dots[0])}`;
  for (let i = 0; i < dots.length - 1; i++) {
    const y1 = dots[i];
    const ym = (y1 + dots[i + 1]) / 2;
    d += ` ${wiggle(y1, ym - 14)}`;
    // Loop: baja a la derecha, rodea por abajo y regresa cruzando hacia arriba.
    d += ` C ${CX + 6} ${ym - 10} ${CX + 11} ${ym - 4} ${CX + 9} ${ym + 4}`;
    d += ` C ${CX + 8} ${ym + 12} ${CX + 2} ${ym + 13} ${CX - 2} ${ym + 11}`;
    d += ` C ${CX - 7} ${ym + 9} ${CX - 8} ${ym + 2} ${CX - 4} ${ym - 2}`;
    d += ` C ${CX - 1} ${ym - 5} ${CX + 4} ${ym - 4} ${CX + 5} ${ym + 2}`;
    d += ` ${wiggle(ym + 2, dots[i + 1], CX + 5)}`;
  }
  d += ` ${wiggle(dots[dots.length - 1], h)}`;
  return d;
}

type Geometry = { h: number; dots: number[]; d: string };

function Dot({
  y,
  drawnY,
  filled,
}: {
  y: number;
  drawnY: MotionValue<number>;
  filled: boolean;
}) {
  const fill = useTransform(drawnY, (v) => (v >= y - 1 ? ACCENT : CREAM));
  return (
    <motion.circle
      cx={CX}
      cy={y}
      r={3}
      stroke={ACCENT}
      strokeWidth={1}
      style={{ fill: filled ? ACCENT : fill }}
    />
  );
}

/**
 * Trazo vertical a mano que se dibuja con el scroll de la lista de pasos.
 * La punta sigue la línea central de la ventana: se traduce esa altura al
 * largo del path muestreándolo, así que la punta va a la altura del paso
 * activo aunque el trazo tenga loops. Cada paso tiene un punto que se
 * rellena de accent cuando el trazo lo alcanza.
 */
export default function StepLine({
  containerRef,
  progress,
}: {
  containerRef: RefObject<HTMLElement | null>;
  /** Progreso 0..1 de la lista cruzando el centro de la ventana
   *  (useScroll en el padre: aquí el ref del <ol> aún no existe al montar). */
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const height = useMotionValue(0);
  // prefixMaxY[i]: máxima y alcanzada hasta la muestra i del path.
  const prefixMaxY = useRef<number[]>([]);

  // Mide el alto de la lista y el centro de cada número de paso. useEffect
  // (no layout): el ref del <ol> padre se asigna después de los layout
  // effects de sus hijos.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // offsetTop/offsetHeight ignoran transforms (los pasos entran con un
    // desplazamiento de 24px); el contenedor debe ser su offsetParent.
    const measure = () => {
      const dots = Array.from(
        el.querySelectorAll<HTMLElement>("[data-step-anchor]")
      ).map((a) => {
        let top = 0;
        let node: HTMLElement | null = a;
        while (node && node !== el) {
          top += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return Math.round(top + a.offsetHeight / 2);
      });
      const h = el.offsetHeight;
      height.set(h);
      setGeo((prev) =>
        prev && prev.h === h && prev.dots.join() === dots.join()
          ? prev
          : { h, dots, d: buildPath(h, dots) }
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, height]);

  // Muestrea el path para traducir "altura alcanzada" → fracción del largo.
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !geo) return;
    const total = path.getTotalLength();
    const out: number[] = [];
    let max = -Infinity;
    for (let i = 0; i <= SAMPLES; i++) {
      max = Math.max(max, path.getPointAtLength((total * i) / SAMPLES).y);
      out.push(max);
    }
    prefixMaxY.current = out;
  }, [geo]);

  const smooth = useSpring(progress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.0001,
  });
  // Altura (px dentro de la lista) a la que llega la línea central.
  const drawnY = useTransform(() => smooth.get() * height.get());
  const h = geo?.h ?? 0;
  const pathLength = useTransform(drawnY, (y) => {
    const ys = prefixMaxY.current;
    if (ys.length === 0) return 0;
    let i = 0;
    while (i < ys.length && ys[i] <= y) i++;
    return Math.max(0, i - 1) / SAMPLES;
  });
  // Con largo 0 el linecap round pintaría un punto suelto al inicio.
  const pathOpacity = useTransform(pathLength, (v) => (v > 0.002 ? 1 : 0));

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 overflow-visible"
      width={WIDTH}
      height={h}
      viewBox={`0 0 ${WIDTH} ${Math.max(h, 1)}`}
    >
      {geo && (
        <>
          <motion.path
            ref={pathRef}
            d={geo.d}
            fill="none"
            stroke="#111111"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={reduce ? undefined : { pathLength, opacity: pathOpacity }}
          />
          {geo.dots.map((y) => (
            <Dot key={y} y={y} drawnY={drawnY} filled={reduce} />
          ))}
        </>
      )}
    </svg>
  );
}
