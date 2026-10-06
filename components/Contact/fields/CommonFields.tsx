"use client";

import { useFormContext } from "react-hook-form";
import { CONTACT_PREFERENCE_OPTIONS, type LeadFormValues } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";
import {
  ERROR_TEXT,
  FieldError,
  INPUT,
  LABEL,
  RadioPills,
  TextField,
  fieldId,
  useA11y,
  useFieldError,
} from "./ui";

function WhatsAppField() {
  const { register } = useFormContext<LeadFormValues>();
  const numberA11y = useA11y("whatsapp", true);
  const codeA11y = useA11y("phoneCode");
  const codeError = useFieldError("phoneCode");
  return (
    <div>
      <label htmlFor={fieldId("whatsapp")} className={LABEL}>
        WhatsApp
      </label>
      <div className="mt-2 flex gap-2">
        <input
          {...register("phoneCode")}
          {...codeA11y}
          aria-label="Lada"
          type="tel"
          inputMode="tel"
          autoComplete="tel-country-code"
          className={cn(INPUT, "w-[88px] shrink-0 text-center")}
        />
        <input
          {...register("whatsapp")}
          {...numberA11y}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="10 dígitos"
          className={INPUT}
        />
      </div>
      <p id={`${fieldId("whatsapp")}-hint`} className="mt-1.5 font-figtree text-[14px] text-ink/65">
        México: +52 y 10 dígitos. Otro país: cambia la lada.
      </p>
      {codeError && (
        <p id={`${fieldId("phoneCode")}-error`} className={cn("mt-1.5 font-figtree text-[14px]", ERROR_TEXT)}>
          {codeError}
        </p>
      )}
      <FieldError name="whatsapp" />
    </div>
  );
}

function PrivacyField() {
  const { register } = useFormContext<LeadFormValues>();
  const a11y = useA11y("privacy");
  return (
    <div>
      <label className="flex min-h-11 cursor-pointer items-start gap-3 font-figtree text-[15px] leading-[1.5] text-ink">
        <input
          {...register("privacy")}
          {...a11y}
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#7A5A33]"
        />
        <span>
          Acepto el{" "}
          <a
            href="/aviso-de-privacidad"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-accent-dark"
          >
            aviso de privacidad
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </span>
      </label>
      <FieldError name="privacy" />
    </div>
  );
}

/** Honeypot: invisible y fuera del orden de tabulación. Un humano no lo llena. */
function Honeypot() {
  const { register } = useFormContext<LeadFormValues>();
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Sitio web
        <input {...register("website")} type="text" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export default function CommonFields() {
  return (
    <div className="flex flex-col gap-8">
      <TextField name="name" label="Nombre completo" autoComplete="name" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <WhatsAppField />
        <TextField name="email" label="Correo" type="email" inputMode="email" autoComplete="email" />
      </div>
      <RadioPills
        name="contactPreference"
        legend="Prefiero que me contacten por"
        options={CONTACT_PREFERENCE_OPTIONS}
      />
      <PrivacyField />
      <Honeypot />
    </div>
  );
}
