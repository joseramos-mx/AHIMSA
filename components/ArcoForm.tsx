"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitArcoRequest } from "@/app/derechos-arco/actions";
import { ARCO_TYPES, type ArcoState } from "@/lib/arco";
import { LEGAL } from "@/lib/legal";
import { cn } from "@/lib/utils";

const INPUT =
  "w-full rounded-[2px] border border-ink/30 bg-transparent px-4 py-3 font-figtree text-[16px] text-ink placeholder:text-ink/45 focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 aria-[invalid=true]:border-[#B42318]";
const LABEL = "font-figtree text-[14px] font-medium text-ink";
const ERROR = "mt-1.5 font-figtree text-[14px] text-[#B42318]";

const FIELD_ORDER = ["type", "name", "email", "holder"];

/** Formulario de derechos ARCO. Funciona también sin JavaScript (Server
 *  Action); con JS lleva el foco al primer error o al mensaje de éxito. */
export default function ArcoForm() {
  const [state, action, pending] = useActionState<ArcoState, FormData>(submitArcoRequest, {
    status: "idle",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errors = state.fieldErrors ?? {};
  const v = state.values ?? {};

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error") {
      const first = FIELD_ORDER.find((k) => errors[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
    // Solo al recibir una respuesta nueva del servidor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="mt-12 rounded-[2px] border border-ink/15 p-8">
        <h2 ref={successRef} tabIndex={-1} className="font-fraunces text-[28px] font-light leading-tight focus:outline-none">
          Recibimos tu solicitud
        </h2>
        <p className="mt-4 font-figtree text-[17px] leading-[1.6] text-ink/85">
          Te responderemos por correo en un máximo de {LEGAL.arcoResponseDays} días hábiles. Es posible que te pidamos confirmar tu identidad antes de entregar o eliminar tus datos.
        </p>
      </div>
    );
  }

  const a11y = (name: string, hint = false) => ({
    id: `arco-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby":
      [errors[name] && `arco-${name}-error`, hint && `arco-${name}-hint`].filter(Boolean).join(" ") || undefined,
  });
  const Err = ({ name }: { name: string }) =>
    errors[name] ? (
      <p id={`arco-${name}-error`} className={ERROR}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} action={action} noValidate className="mt-12 flex flex-col gap-8 rounded-[2px] border border-ink/15 p-6 md:p-8" aria-labelledby="arco-form-title">
      <h2 id="arco-form-title" className="font-fraunces text-[28px] font-light leading-tight">
        Enviar una solicitud
      </h2>

      <fieldset aria-describedby={errors.type ? "arco-type-error" : undefined}>
        <legend className={cn(LABEL, "mb-3")}>¿Qué quieres hacer?</legend>
        <div className="flex flex-col gap-1">
          {ARCO_TYPES.map((t, i) => (
            <label key={t.value} className="flex min-h-11 cursor-pointer items-center gap-3 font-figtree text-[16px]">
              <input
                type="radio"
                name="type"
                value={t.value}
                defaultChecked={v.type ? v.type === t.value : i === 0}
                className="h-5 w-5 shrink-0 accent-[#7A5A33]"
              />
              {t.label}
            </label>
          ))}
        </div>
        <Err name="type" />
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="arco-name" className={LABEL}>Nombre completo</label>
          <input {...a11y("name")} name="name" autoComplete="name" defaultValue={v.name} className={cn(INPUT, "mt-2")} />
          <Err name="name" />
        </div>
        <div>
          <label htmlFor="arco-email" className={LABEL}>Correo con el que nos contactaste</label>
          <input {...a11y("email")} name="email" type="email" inputMode="email" autoComplete="email" defaultValue={v.email} className={cn(INPUT, "mt-2")} />
          <Err name="email" />
        </div>
      </div>

      <div>
        <label htmlFor="arco-phone" className={LABEL}>
          WhatsApp o teléfono <span className="font-normal text-ink/60">(opcional)</span>
        </label>
        <input {...a11y("phone", true)} name="phone" type="tel" inputMode="tel" autoComplete="tel" defaultValue={v.phone} className={cn(INPUT, "mt-2")} />
        <p id="arco-phone-hint" className="mt-1.5 font-figtree text-[14px] text-ink/65">
          Ayuda a encontrar tus datos si nos contactaste por WhatsApp.
        </p>
      </div>

      <div>
        <label htmlFor="arco-details" className={LABEL}>
          Detalle <span className="font-normal text-ink/60">(opcional)</span>
        </label>
        <textarea {...a11y("details")} name="details" rows={4} maxLength={1000} defaultValue={v.details} placeholder="Por ejemplo, qué dato quieres corregir." className={cn(INPUT, "mt-2 resize-y")} />
        <Err name="details" />
      </div>

      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 font-figtree text-[15px] leading-[1.5]">
          <input {...a11y("holder")} name="holder" type="checkbox" defaultChecked={v.holder === "on"} className="mt-0.5 h-5 w-5 shrink-0 accent-[#7A5A33]" />
          <span>Confirmo que soy el titular de estos datos o su representante legal.</span>
        </label>
        <Err name="holder" />
      </div>

      {/* Honeypot: invisible y fuera del orden de tabulación. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Sitio web
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <p role="alert" className="font-figtree text-[15px] text-[#B42318] empty:hidden">
          {state.status === "error" ? state.message : ""}
        </p>
        <div>
          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="inline-flex h-12 items-center justify-center rounded-[2px] bg-ink px-7 font-figtree text-[15px] font-medium text-cream transition-colors duration-200 hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Enviando…" : "Enviar solicitud"}
          </button>
        </div>
      </div>
    </form>
  );
}
