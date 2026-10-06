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
