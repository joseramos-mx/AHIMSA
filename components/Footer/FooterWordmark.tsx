"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const WORD = "AHIMSA";
/** Tamaño inicial aproximado (antes de medir) para minimizar el ajuste. */
const INITIAL_FONT = "21vw";

/**
 * "AHIMSA" a todo lo ancho, como sello de cierre. El font-size se calcula
 * midiendo el texto (tras cargar las fuentes y en cada resize) para que
 * ocupe el ancho disponible sin desbordar. Interlineado 0.7 (calculado para
 * las métricas de Fraunces): la línea recorta un poco la base de las
 * letras contra el borde inferior. Cada
 * letra sube de 100% a 0% en cascada al entrar en pantalla, una vez.
 */
export default function FooterWordmark() {
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<string>(INITIAL_FONT);
  const [inView, setInView] = useState(false);

  // Con el efecto telón el footer está fijo y "en pantalla" desde el
  // inicio, pero tapado por el contenido: useInView dispararía antes de
  // tiempo. Se considera visible cuando entra al viewport Y no hay nada
  // encima (elementFromPoint cae dentro del wordmark).
  useEffect(() => {
    if (inView) return;
    const check = () => {
      const box = boxRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top > vh * 0.9 || r.bottom < 0) return;
      const y = Math.min(vh - 2, Math.max(1, r.top + r.height / 2));
      const hit = document.elementFromPoint(r.left + r.width / 2, y);
      if (hit && box.contains(hit)) setInView(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [inView]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;
    const fit = () => {
      // Mide a 100px y escala al ancho disponible (sin padding).
      text.style.fontSize = "100px";
      const width = text.offsetWidth;
      const style = getComputedStyle(box);
      const available =
        box.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      if (width > 0) {
        // floor + 0.5% de margen: nunca rebasa por redondeo.
        const size = `${Math.floor((available / width) * 100 * 0.995)}px`;
        // Se aplica directo además del estado: si el tamaño no cambió,
        // React no vuelve a renderizar y el valor de prueba se quedaría.
        text.style.fontSize = size;
        setFontSize(size);
      }
    };
    fit();
    document.fonts.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className="w-full overflow-hidden px-6 md:px-10"
    >
      <span
        ref={textRef}
        className="flex w-max whitespace-nowrap font-fraunces font-light leading-[0.7] text-cream [font-variation-settings:'opsz'_144]"
        style={{ fontSize }}
      >
        {WORD.split("").map((letter, i) => (
          <span key={i} className="inline-block overflow-hidden">
            {reduce ? (
              <span className="inline-block">{letter}</span>
            ) : (
              <motion.span
                className="inline-block"
                initial={{ y: "100%" }}
                animate={inView ? { y: "0%" } : undefined}
                transition={{
                  duration: 0.9,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
}
