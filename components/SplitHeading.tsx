"use client";

import {
  createElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type SplitHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** Segundos antes de que entre la primera línea. */
  delay?: number;
  /** Cascada entre líneas (s). */
  stagger?: number;
  duration?: number;
};

/**
 * Título que se revela por líneas visuales reales. Primero se renderiza
 * palabra por palabra (inline, invisible) para medir en qué línea cae cada
 * una una vez cargadas las fuentes; luego cada línea va dentro de un
 * contenedor con overflow hidden y entra de y 100% → 0%. Como el corte de
 * líneas es el mismo que hace el navegador, el título no se reacomoda.
 * Se vuelve a medir cuando cambia el ancho. Lectores de pantalla leen el
 * texto completo vía aria-label.
 */
export default function SplitHeading({
  text,
  as = "h2",
  id,
  className,
  delay = 0,
  stagger = 0.09,
  duration = 0.9,
}: SplitHeadingProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const [fontsReady, setFontsReady] = useState(false);
  const [lines, setLines] = useState<string[][] | null>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  // Con las palabras inline en el DOM, agrúpalas por su offsetTop.
  useLayoutEffect(() => {
    if (lines !== null || !fontsReady || !ref.current) return;
    const spans = ref.current.querySelectorAll<HTMLElement>("[data-word]");
    const groups: string[][] = [];
    let lastTop: number | null = null;
    spans.forEach((span, i) => {
      const top = span.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 2) {
        groups.push([]);
        lastTop = top;
      }
      groups[groups.length - 1].push(words[i]);
    });
    setLines(groups);
  }, [lines, fontsReady, words]);

  // Si cambia el ancho, vuelve a la versión inline para re-medir.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let lastWidth = el.clientWidth;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w !== lastWidth) {
        lastWidth = w;
        setLines(null);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (reduce) {
    return createElement(as, { id, className }, text);
  }

  let content;
  if (lines === null) {
    content = (
      <span aria-hidden="true" className="invisible">
        {words.map((w, i) => (
          <span key={i}>
            <span data-word className="inline-block">
              {w}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    );
  } else {
    content = lines.map((line, i) => (
      // El padding/margin negativo deja espacio a ascendentes y
      // descendentes de Playfair dentro del overflow hidden.
      <span
        key={`${i}-${line.join(" ")}`}
        aria-hidden="true"
        className="block overflow-hidden py-[0.12em] -my-[0.12em]"
      >
        <motion.span
          className="block"
          initial={played ? false : { y: "100%" }}
          animate={inView ? { y: "0%" } : undefined}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={
            i === lines.length - 1 ? () => setPlayed(true) : undefined
          }
        >
          {line.join(" ")}
        </motion.span>
      </span>
    ));
  }

  return createElement(
    as,
    { ref, id, className, "aria-label": text },
    content
  );
}
