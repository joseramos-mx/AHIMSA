/** Contenedor de Google Tag Manager. */
export const GTM_ID = "GTM-N5FQQ63J";
/** Tag de Contentsquare (Hotjar). */
export const CONTENTSQUARE_TAG_ID = "089aa20146d97";

export type Consent = "granted" | "denied";

const CONSENT_KEY = "ahimsa-cookie-consent";
/** Evento con el que el footer vuelve a abrir el aviso de cookies. */
export const COOKIE_SETTINGS_EVENT = "ahimsa:cookie-settings";

export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {}
}

/** Al retirar el permiso: borra las cookies de Google y Contentsquare/Hotjar. */
export function clearAnalyticsCookies() {
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(`; domain=.${parts.slice(i).join(".")}`);
  }
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (!/^(_cs|_hj|_ga|_gid|_gcl)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

/**
 * Eventos de analítica. Por ahora solo se registran en consola en
 * desarrollo; conectar aquí el proveedor real (GA4, Plausible, etc.).
 * Nunca enviar datos personales en `props`.
 */
export type AnalyticsEvent =
  | "lead_form_start"
  | "lead_form_type_change"
  | "lead_form_submit_success"
  | "lead_form_submit_error";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, props ?? {});
  }
}
