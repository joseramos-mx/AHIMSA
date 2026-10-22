"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WHATSAPP_AGENT_URL, WHATSAPP_URL } from "@/lib/contact";
import { FOUNDER } from "@/lib/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Botón flotante "Escríbele a Fátima" con su foto (marca personal).
 * - En la home aparece después de pasar el hero (no compite con el logo).
 * - En /contacto no se muestra: ahí ya está el formulario y en móvil
 *   taparía el botón de enviar.
 * - En /unete-a-mi-equipo abre WhatsApp con el mensaje de agentes.
 * - En móvil solo se ve la foto con el ícono; el texto queda para lectores
 *   de pantalla.
 */
export default function WhatsAppFloat() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (pathname === "/contacto") return null;
  const visible = !isHome || pastHero;
  const href = pathname === "/unete-a-mi-equipo" ? WHATSAPP_AGENT_URL : WHATSAPP_URL;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="whatsapp-float"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Escríbele a ${FOUNDER.firstName} por WhatsApp (se abre en una pestaña nueva)`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: reduce ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-5 z-40 flex items-center gap-3 rounded-full bg-ink p-1.5 text-cream shadow-[0_8px_24px_rgba(17,17,17,0.25)] transition-colors duration-200 hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:right-8 md:pr-5"
        >
          <span className="relative block h-12 w-12 shrink-0">
            <Image
              src={FOUNDER.avatar}
              alt=""
              width={96}
              height={96}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-cream"
            />
            {/* Ícono de WhatsApp sobre la foto. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] ring-2 ring-ink"
            >
              <svg viewBox="0 0 24 24" width="11" height="11" fill="#ffffff">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
              </svg>
            </span>
          </span>
          <span aria-hidden="true" className="hidden flex-col leading-tight md:flex">
            <span className="font-figtree text-[15px] font-medium">
              Escríbele a {FOUNDER.firstName}
            </span>
            <span className="font-figtree text-[12px] text-cream/75">por WhatsApp</span>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
