/** Contenedor de Google Tag Manager con Google Analytics (permiso de analítica). */
export const GTM_ANALYTICS_ID = "GTM-N5FQQ63J";
/** Contenedor de Google Tag Manager con Google Ads (permiso de publicidad). */
export const GTM_ADS_ID = "GTM-W2L9HRCG";
/** Tag de Contentsquare (Hotjar), permiso de analítica. */
export const CONTENTSQUARE_TAG_ID = "089aa20146d97";

/** Lo que la persona aceptó, por categoría. */
export type Consent = { analytics: boolean; marketing: boolean };

const CONSENT_KEY = "ahimsa-cookie-consent";
/** Evento con el que el footer vuelve a abrir el aviso de cookies. */
export const COOKIE_SETTINGS_EVENT = "ahimsa:cookie-settings";

export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    // Formato anterior (solo analítica): "granted" | "denied".
    if (value === "granted" || value === "denied") {
      return { analytics: value === "granted", marketing: false };
    }
    if (!value) return null;
    const parsed = JSON.parse(value);
    return { analytics: parsed.analytics === true, marketing: parsed.marketing === true };
  } catch {
    return null;
  }
}

export function saveConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {}
}

/** Cookies de cada categoría, para borrarlas al retirar el permiso. */
export const ANALYTICS_COOKIES = /^(_cs|_hj|_ga|_gid)/;
export const MARKETING_COOKIES = /^(_gcl|_gac)/;

/** Al retirar un permiso: borra las cookies que coinciden con `pattern`. */
export function clearCookies(pattern: RegExp) {
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(`; domain=.${parts.slice(i).join(".")}`);
  }
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (!pattern.test(name)) continue;
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
