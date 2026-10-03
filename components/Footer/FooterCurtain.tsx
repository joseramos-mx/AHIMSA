"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Efecto telón (desktop ≥1024px, sin reduced motion): el footer queda fijo
 * al fondo de la ventana, detrás del contenido; el contenido (fondo cream
 * sólido, z-index mayor) deja un margin-bottom igual a la altura real del
 * footer, así que al final sube y lo descubre.
 *
 * Se desactiva (footer normal en el flujo) en móvil/tablet, con reduced
 * motion o si el footer mide más que la ventana (quedaría contenido
 * inaccesible). Ningún ancestro tiene overflow, así que los sticky del
 * hero, DayInParis y HowWeWork siguen funcionando.
 */
export default function FooterCurtain({
  children,
  footer,
}: {
  children: ReactNode;
  footer: ReactNode;
}) {
  const reduce = useReducedMotion();
  const footerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      const h = el.offsetHeight;
      setHeight(h);
      setEnabled(!reduce && mq.matches && h <= window.innerHeight);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [reduce]);

  // Si se navega con teclado al footer mientras está tapado, baja hasta el
  // final para que el foco siempre quede visible.
  const onFocus = () => {
    if (!enabled) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY < max - 1) window.scrollTo({ top: max });
  };

  return (
    <>
      <div
        className="relative z-10 bg-cream"
        style={{ marginBottom: enabled ? height : 0 }}
      >
        {children}
      </div>
      <div
        ref={footerRef}
        onFocus={onFocus}
        className={enabled ? "fixed inset-x-0 bottom-0 z-0" : "relative"}
      >
        {footer}
      </div>
    </>
  );
}
