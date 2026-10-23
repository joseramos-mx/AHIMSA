"use server";

import { z } from "zod";
import { escapeHtml, isLeadEmailConfigured, sendInternalEmail } from "@/lib/email/lead-email";
import { LEGAL } from "@/lib/legal";
import { ARCO_TYPES, type ArcoState } from "@/lib/arco";


const arcoSchema = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre completo").max(120),
  email: z.string().trim().min(1, "Escribe tu correo").email("Revisa tu correo").max(160),
  phone: z.string().trim().max(24),
  type: z.enum(ARCO_TYPES.map((t) => t.value) as [string, ...string[]], {
    errorMap: () => ({ message: "Elige qué quieres hacer" }),
  }),
  details: z.string().trim().max(1000, "Máximo 1000 caracteres"),
  holder: z.literal("on", {
    errorMap: () => ({ message: "Confirma que eres el titular de los datos o su representante" }),
  }),
  /** Honeypot. */
  website: z.string().max(200),
});


/** Solicitud de derechos ARCO: se envía por correo a la responsable (no se
 *  guarda en base de datos, para no acumular más datos). */
export async function submitArcoRequest(_prev: ArcoState, formData: FormData): Promise<ArcoState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    type: String(formData.get("type") ?? ""),
    details: String(formData.get("details") ?? ""),
    holder: formData.get("holder") ?? "",
    website: String(formData.get("website") ?? ""),
  };
  const values = { ...raw, holder: raw.holder ? "on" : "" } as Record<string, string>;

  const parsed = arcoSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors, values };
  }
  const d = parsed.data;

  // Honeypot lleno: éxito falso, sin enviar nada.
  if (d.website) {
    console.warn("[arco] envío descartado como spam");
    return { status: "success" };
  }

  if (!isLeadEmailConfigured()) {
    console.error("[arco] RESEND_API_KEY no está configurada");
    return {
      status: "error",
      message: `No pudimos enviar tu solicitud. Escríbenos directamente a ${LEGAL.email}.`,
      values,
    };
  }

  const typeLabel = ARCO_TYPES.find((t) => t.value === d.type)?.label ?? d.type;
  const rows: [string, string][] = [
    ["Solicitud", typeLabel],
    ["Nombre", d.name],
    ["Correo", d.email],
    ...(d.phone ? ([["Teléfono", d.phone]] as [string, string][]) : []),
    ["Detalle", d.details || "(sin detalle)"],
    ["Fecha", new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })],
  ];
  const text = [
    `Nueva solicitud de derechos ARCO: ${typeLabel}.`,
    `Plazo legal de respuesta: ${LEGAL.arcoResponseDays} días hábiles.`,
    "",
    ...rows.map(([l, v]) => `${l}: ${v}`),
    "",
    "Verifica la identidad del titular antes de entregar o eliminar datos. Responde a este correo para contestarle.",
  ].join("\n");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:600px">
  <h1 style="font-size:20px;font-weight:normal">Solicitud de derechos ARCO: ${escapeHtml(typeLabel)}</h1>
  <p style="font-size:14px;color:#555">Plazo legal de respuesta: ${LEGAL.arcoResponseDays} días hábiles. Verifica la identidad del titular antes de entregar o eliminar datos.</p>
  <table cellpadding="8" style="border-collapse:collapse;width:100%">${rows
    .map(([l, v]) => `<tr><td style="border-bottom:1px solid #eee;color:#555;width:30%">${escapeHtml(l)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
  <p style="font-size:14px;color:#555">Responde a este correo para contestarle directo a ${escapeHtml(d.email)}.</p>
</div>`;

  const sent = await sendInternalEmail({
    subject: `[ARCO] ${typeLabel} · ${d.name}`,
    html,
    text,
    replyTo: d.email,
    tag: "[arco]",
  });
  if (!sent) {
    return {
      status: "error",
      message: `No pudimos enviar tu solicitud. Escríbenos directamente a ${LEGAL.email}.`,
      values,
    };
  }
  return { status: "success" };
}
