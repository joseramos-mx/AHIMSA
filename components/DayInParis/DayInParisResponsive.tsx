"use client";

import { useEffect, useState } from "react";
import DayInParis from "./DayInParis";
import DayInParisMobile from "./DayInParisMobile";

/**
 * Selector cliente que monta solo la variante que corresponde al viewport
 * actual, para evitar cargar dos árboles de animación simultáneamente.
 * Durante SSR y la primera hidratación renderiza un placeholder con el id
 * correcto para que los anchors sigan funcionando.
 */
export default function DayInParisResponsive() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    setMounted(true);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!mounted) {
    return (
      <section
        id="un-dia"
        className="min-h-screen bg-cream"
        aria-hidden="true"
      />
    );
  }

  return isDesktop ? <DayInParis /> : <DayInParisMobile />;
}
