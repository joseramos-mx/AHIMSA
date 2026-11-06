"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  CONTENTSQUARE_TAG_ID,
  COOKIE_SETTINGS_EVENT,
  GTM_ID,
  clearAnalyticsCookies,
  readConsent,
  saveConsent,
  type Consent,
} from "@/lib/analytics";

/**
 * Aviso de cookies y carga de analítica. Google Tag Manager y Contentsquare
 * (Hotjar) solo se cargan si la persona acepta, y solo en producción. El
 * footer vuelve a abrir este aviso para cambiar la decisión.
 */
export default function CookieConsent() {
  // undefined: aún sin leer localStorage (igual que en el servidor).
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = readConsent();
    setConsent(saved);
    setOpen(saved === null);
    const onOpen = () => {
      setOpen(true);
      requestAnimationFrame(() => firstButtonRef.current?.focus());
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, onOpen);
  }, []);

  const decide = (next: Consent) => {
    saveConsent(next);
    setOpen(false);
    if (next === "denied" && consent === "granted") {
      // Los scripts ya cargados no se pueden descargar: se recarga sin ellos.
      clearAnalyticsCookies();
      window.location.reload();
      return;
    }
    setConsent(next);
  };

  return (
    <>
      {consent === "granted" && process.env.NODE_ENV === "production" && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
            strategy="afterInteractive"
          />
          <Script
            src={`https://t.contentsquare.net/uxa/${CONTENTSQUARE_TAG_ID}.js`}
            strategy="afterInteractive"
          />
        </>
      )}

      {open && (
        <section
          aria-label="Preferencias de cookies"
          className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 rounded-[2px] bg-ink p-5 font-figtree text-cream shadow-[0_8px_24px_rgba(17,17,17,0.25)] md:inset-x-auto md:left-8 md:bottom-8 md:max-w-[440px]"
        >
          <p className="text-[15px] leading-[1.5]">
            Con tu permiso usamos cookies de analítica y grabaciones de la navegación
            para mejorar el sitio. No son necesarias para navegar y puedes cambiar de
            opinión cuando quieras.{" "}
            <Link
              href="/aviso-de-privacidad#cookies"
              className="underline underline-offset-2 hover:text-cream/80"
            >
              Aviso de privacidad
            </Link>
          </p>
          <div className="mt-4 flex gap-3">
            <button
              ref={firstButtonRef}
              type="button"
              onClick={() => decide("granted")}
              className="min-h-11 flex-1 rounded-[2px] bg-cream px-4 text-[15px] text-ink transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={() => decide("denied")}
              className="min-h-11 flex-1 rounded-[2px] border border-cream/50 px-4 text-[15px] text-cream transition-colors duration-200 hover:bg-cream/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              Rechazar
            </button>
          </div>
        </section>
      )}
    </>
  );
}
