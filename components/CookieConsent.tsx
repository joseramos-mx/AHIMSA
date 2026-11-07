"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CONTENTSQUARE_TAG_ID,
  COOKIE_SETTINGS_EVENT,
  GTM_ID,
  clearAnalyticsCookies,
  readConsent,
  saveConsent,
  type Consent,
} from "@/lib/analytics";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const PILL =
  "min-h-11 rounded-full px-4 text-[14px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream";
const PILL_NEUTRAL = `${PILL} bg-cream/10 text-cream hover:bg-cream/20`;

/**
 * Tarjeta de cookies y carga de analítica. Google Tag Manager y Contentsquare
 * (Hotjar) solo se cargan si la persona acepta, y solo en producción. El
 * footer vuelve a abrir la tarjeta, ya desplegada, para cambiar la decisión.
 */
export default function CookieConsent() {
  // undefined: aún sin leer localStorage (igual que en el servidor).
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const reduce = useReducedMotion();
  const panelId = useId();
  const customizeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const saved = readConsent();
    setConsent(saved);
    setOpen(saved === null);
    const onOpen = () => {
      const current = readConsent();
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setAnalytics(current === "granted");
      setCustomizing(true);
      setOpen(true);
      requestAnimationFrame(() => customizeRef.current?.focus());
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, onOpen);
  }, []);

  const decide = (next: Consent) => {
    saveConsent(next);
    if (next === "denied" && consent === "granted") {
      // Los scripts ya cargados no se pueden descargar: se recarga sin ellos.
      clearAnalyticsCookies();
      window.location.reload();
      return;
    }
    setConsent(next);
    setOpen(false);
    setCustomizing(false);
    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
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

      <AnimatePresence>
        {open && (
          <motion.section
            key="cookie-consent"
            aria-label="Preferencias de cookies"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
            className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 max-h-[calc(100svh-1.5rem)] overflow-y-auto rounded-2xl border border-cream/10 bg-ink p-4 font-figtree text-cream shadow-[0_12px_40px_rgba(17,17,17,0.35)] md:inset-x-auto md:bottom-8 md:left-8 md:w-[400px]"
          >
            <div className="flex gap-3">
              <CookieIcon />
              <div>
                <p className="text-[15px] font-medium leading-snug">Tú decides sobre las cookies</p>
                <p className="mt-1 text-[14px] leading-[1.45] text-cream/70">
                  Con tu permiso medimos cómo se usa el sitio para mejorarlo. Puedes cambiar de
                  opinión cuando quieras.{" "}
                  <Link
                    href="/aviso-de-privacidad#cookies"
                    className="underline underline-offset-2 hover:text-cream"
                  >
                    Aviso de privacidad
                  </Link>
                </p>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {customizing && (
                <motion.div
                  key="cookie-options"
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 divide-y divide-cream/10 border-t border-cream/10">
                    <CookieOption
                      title="Necesarias"
                      description="Guardan tu elección. Siempre activas."
                      checked
                      disabled
                    />
                    <CookieOption
                      title="Analítica"
                      description="Google Analytics y Contentsquare (Hotjar): visitas, clics y grabaciones de la navegación."
                      checked={analytics}
                      onChange={setAnalytics}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <button
                ref={customizeRef}
                type="button"
                aria-expanded={customizing}
                aria-controls={customizing ? panelId : undefined}
                onClick={() => setCustomizing((value) => !value)}
                className={`${PILL} -ml-2 px-2 text-cream/70 hover:text-cream`}
              >
                {customizing ? "Volver" : "Personalizar"}
              </button>
              <div className="flex gap-2">
                {customizing ? (
                  <button
                    type="button"
                    onClick={() => decide(analytics ? "granted" : "denied")}
                    className={`${PILL} bg-cream text-ink hover:bg-cream/85`}
                  >
                    Guardar
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => decide("denied")} className={PILL_NEUTRAL}>
                      Rechazar
                    </button>
                    <button type="button" onClick={() => decide("granted")} className={PILL_NEUTRAL}>
                      Aceptar
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

type CookieOptionProps = {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

function CookieOption({ title, description, checked, disabled = false, onChange }: CookieOptionProps) {
  const labelId = useId();
  const descriptionId = useId();
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p id={labelId} className="text-[14px] font-medium leading-snug">
          {title}
        </p>
        <p id={descriptionId} className="mt-0.5 text-[13px] leading-[1.4] text-cream/70">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className="group -m-2 shrink-0 rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cream disabled:cursor-not-allowed"
      >
        <span
          className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors duration-200 motion-reduce:transition-none ${
            checked ? "bg-cream" : "bg-cream/20"
          } group-disabled:opacity-50`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-ink ring-1 ring-cream/30 transition-transform duration-200 motion-reduce:transition-none ${
              checked ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </span>
      </button>
    </div>
  );
}

function CookieIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-accent"
    >
      <path
        fill="currentColor"
        d="M16 3a13 13 0 1 0 13 13 .9.9 0 0 0-1.2-.85 3.6 3.6 0 0 1-4.5-3.9.9.9 0 0 0-1.05-1 3.6 3.6 0 0 1-4.1-4.1.9.9 0 0 0-.75-1.05A13 13 0 0 0 16 3Z"
      />
      <g className="fill-ink">
        <circle cx="11" cy="12" r="1.8" />
        <circle cx="20" cy="18" r="1.8" />
        <circle cx="12" cy="21" r="2.1" />
        <circle cx="17" cy="11.5" r="1.1" />
        <circle cx="16.5" cy="24" r="1.1" />
      </g>
    </svg>
  );
}
