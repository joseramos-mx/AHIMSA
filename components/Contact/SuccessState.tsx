"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { RESPONSE_TIME, whatsappUrl } from "@/lib/contact";
import type { LeadFormValues } from "@/lib/lead-schema";
import { buildLeadSummary } from "@/lib/lead-summary";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import AnimatedButton from "@/components/ui/AnimatedButton";

const CHANNEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  llamada: "llamada",
  correo: "correo",
};

export default function SuccessState({ values }: { values: LeadFormValues }) {
  const reduce = useReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Lleva el foco al título para que se anuncie el cambio.
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[2px] border border-ink/15 p-8 lg:p-12"
    >
      <h2
        ref={titleRef}
        tabIndex={-1}
        className="font-fraunces text-[32px] font-light leading-[1.1] text-ink focus:outline-none lg:text-[44px]"
      >
        ¡Listo, ya tengo tu solicitud!
      </h2>
      <p className="mt-5 max-w-[520px] font-figtree text-[18px] leading-[1.6] text-ink/85">
        Te contacto en {RESPONSE_TIME} por {CHANNEL[values.contactPreference] ?? "WhatsApp"}.
      </p>
      <p className="mt-2 font-figtree text-[15px] text-ink/70">
        ¿No quieres esperar? Mándame tu solicitud por WhatsApp.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <AnimatedButton
          href={whatsappUrl(buildLeadSummary(values))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbeme ahora por WhatsApp (se abre en una pestaña nueva)"
          variant="dark"
        >
          Escríbeme ahora por WhatsApp
        </AnimatedButton>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-[2px] border border-ink/30 px-7 font-figtree text-[15px] font-medium text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
        >
          Volver al inicio
        </Link>
      </div>
    </motion.div>
  );
}
