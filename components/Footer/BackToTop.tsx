"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Vuelve al inicio: suave, o instantáneo con reduced motion. El header y el
 * hero derivan su estado del scroll, así que al llegar arriba el logo vuelve
 * solo a su tamaño inicial.
 */
export default function BackToTop() {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
      }
      className="group inline-flex items-center gap-2 rounded-[2px] text-cream/60 transition-colors duration-200 hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
    >
      Volver arriba
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5"
      >
        <path d="M7 12V2" />
        <path d="M3 6l4-4 4 4" />
      </svg>
    </button>
  );
}
