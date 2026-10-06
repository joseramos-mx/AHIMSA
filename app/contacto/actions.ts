"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { leadPriority, leadSchema, type LeadData, type LeadPriority } from "@/lib/lead-schema";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type SubmitLeadResult =
  | { ok: true; priority?: LeadPriority }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

/** Envíos permitidos por IP en la ventana. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
/** Menos de esto entre carga y envío = bot. */
const MIN_FILL_MS = 3000;

const GENERIC_ERROR =
  "No pudimos enviar tu solicitud. Intenta de nuevo o escríbeme por WhatsApp.";

/** Campos comunes que van en columnas propias (el resto va en payload). */
const COMMON_KEYS = [
  "kind", "name", "phoneCode", "whatsapp", "email", "contactPreference",
  "privacy", "website", "elapsedMs", "service", "circuit", "utm", "sourcePath",
  "interests",
] as const;

function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) console.warn("[leads] IP_HASH_SALT no está configurada");
  return createHash("sha256").update(`${salt ?? ""}:${ip}`).digest("hex");
}

function buildPayload(d: LeadData) {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(d)) {
    if (!(COMMON_KEYS as readonly string[]).includes(key)) payload[key] = value;
  }
  return payload;
}

/** Envía el lead a n8n. Si falla, el lead ya está guardado: solo se registra. */
async function notifyN8n(lead: Record<string, unknown>) {
  const url = process.env.N8N_LEADS_WEBHOOK_URL;
  if (!url) {
    console.warn("[leads] N8N_LEADS_WEBHOOK_URL no está configurada; no se notificó a n8n");
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify({ event: "lead.created", lead }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[leads] n8n respondió", res.status);
  } catch (error) {
    console.error("[leads] no se pudo notificar a n8n", error);
  }
}

export async function submitLead(input: unknown): Promise<SubmitLeadResult> {
  // 1. Validación en el servidor con el mismo esquema que el cliente.
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors, formError: "Revisa los campos marcados." };
  }
  const d = parsed.data;

  // 2. Antispam: honeypot lleno o envío demasiado rápido → éxito falso.
  if (d.website || d.elapsedMs < MIN_FILL_MS) {
    console.warn("[leads] envío descartado como spam", {
      honeypot: Boolean(d.website),
      elapsedMs: d.elapsedMs,
    });
    return { ok: true };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[leads] Supabase no está configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
    return { ok: false, formError: GENERIC_ERROR };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "";
  const ipHash = ip ? hashIp(ip) : null;

  // 3. Límite por IP (solo se guarda el hash, nunca la IP en claro).
  if (ipHash) {
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count, error } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (error) {
      console.error("[leads] no se pudo revisar el límite por IP", error.message);
    } else if ((count ?? 0) >= RATE_LIMIT) {
      console.warn("[leads] límite por IP alcanzado");
      return {
        ok: false,
        formError:
          "Recibí varias solicitudes desde tu conexión. Intenta de nuevo en unos minutos o escríbeme por WhatsApp.",
      };
    }
  }

  // 4. Guardar.
  const priority = leadPriority(d);
  const utm = Object.fromEntries(Object.entries(d.utm).filter(([, v]) => v));
  // Datos del lead (lo mismo que recibe n8n)…
  const lead = {
    kind: d.kind,
    priority,
    name: d.name,
    whatsapp: `${d.phoneCode}${d.whatsapp.replace(/\D/g, "")}`,
    email: d.email.toLowerCase(),
    contact_preference: d.contactPreference,
    interests: d.kind === "trip" ? d.interests : null,
    service: d.service || null,
    circuit: d.circuit || null,
    payload: buildPayload(d),
    source_path: d.sourcePath || null,
    utm: Object.keys(utm).length ? utm : null,
  };
  // …más los datos técnicos que solo se guardan en Supabase.
  const row = {
    ...lead,
    ip_hash: ipHash,
    user_agent: h.get("user-agent")?.slice(0, 300) ?? null,
  };

  const { data: inserted, error } = await supabase
    .from("leads")
    .insert(row)
    .select("id, created_at")
    .single();
  if (error) {
    console.error("[leads] no se pudo guardar el lead", error.message);
    return { ok: false, formError: GENERIC_ERROR };
  }

  // 5. Avisar a n8n (sin ip_hash ni user agent).
  await notifyN8n({ id: inserted.id, created_at: inserted.created_at, ...lead });

  return { ok: true, priority };
}
