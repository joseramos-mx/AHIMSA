"use client";

import { useEffect, useRef, useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldErrors,
  type Path,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { submitLead } from "@/app/contacto/actions";
import { track } from "@/lib/analytics";
import type { ContactParams } from "@/lib/lead-types";
import {
  KIND_OPTIONS,
  defaultLeadValues,
  leadSchema,
  type LeadFormValues,
  type LeadKind,
} from "@/lib/lead-schema";
import { interestTagLabel } from "@/lib/lead-summary";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import AnimatedButton from "@/components/ui/AnimatedButton";
import TripFields from "./fields/TripFields";
import BusinessFields from "./fields/BusinessFields";
import AgentFields from "./fields/AgentFields";
import CommonFields from "./fields/CommonFields";
import { ERROR_TEXT } from "./fields/ui";

const resolver = zodResolver(leadSchema) as unknown as Resolver<LeadFormValues>;

/** Cuenta los errores con mensaje (incluye anidados, p. ej. childAges.0). */
function countErrors(errors: FieldErrors): number {
  let n = 0;
  for (const value of Object.values(errors)) {
    if (!value || typeof value !== "object") continue;
    if ("message" in value && value.message) n += 1;
    else n += countErrors(value as FieldErrors);
  }
  return n;
}

function KindSelector() {
  return (
    <fieldset>
      <legend className="mb-3 font-figtree text-[14px] font-medium text-ink">
        ¿Qué te gustaría hacer?
      </legend>
      <KindRadios />
    </fieldset>
  );
}

function KindRadios() {
  const { register } = useFormContext<LeadFormValues>();
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-0 sm:rounded-[2px] sm:border sm:border-ink/30 sm:p-1">
      {KIND_OPTIONS.map((o) => (
        <label key={o.value} className="relative">
          <input {...register("kind")} type="radio" value={o.value} className="peer sr-only" />
          <span className="flex min-h-12 cursor-pointer select-none items-center justify-center rounded-[2px] border border-ink/30 px-3 text-center font-figtree text-[15px] font-medium text-ink transition-colors hover:bg-ink/5 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent sm:border-transparent">
            {o.label}
          </span>
        </label>
      ))}
    </div>
  );
}

export default function LeadForm({
  initial,
  onKindChange,
  onSuccess,
}: {
  initial: ContactParams;
  onKindChange: (kind: LeadKind) => void;
  onSuccess: (values: LeadFormValues) => void;
}) {
  const reduce = useReducedMotion();
  const loadedAt = useRef(Date.now());
  const started = useRef(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Hasta hidratar, el botón queda deshabilitado: un envío nativo antes de
  // que React tome el control perdería el lead.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const form = useForm<LeadFormValues>({
    resolver,
    defaultValues: defaultLeadValues(initial),
    mode: "onTouched",
    shouldFocusError: true,
  });
  const {
    handleSubmit,
    setValue,
    watch,
    setError,
    setFocus,
    formState: { isSubmitting },
  } = form;

  const kind = watch("kind");
  const service = watch("service");
  const circuit = watch("circuit");
  const interestTag = interestTagLabel({ service, circuit });

  // UTM y página de origen.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm = (key: string) => (params.get(key) ?? "").slice(0, 100);
    setValue("utm", {
      source: utm("utm_source"),
      medium: utm("utm_medium"),
      campaign: utm("utm_campaign"),
    });
    let path = window.location.pathname + window.location.search;
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === window.location.origin) path = ref.pathname + ref.hash;
    } catch {
      /* referrer inválido: se queda la URL actual */
    }
    setValue("sourcePath", path.slice(0, 300));
  }, [setValue]);

  // Avisa al padre (título de la página) y registra cambios de tipo.
  const prevKind = useRef(kind);
  useEffect(() => {
    onKindChange(kind);
    if (prevKind.current !== kind) {
      track("lead_form_type_change", { kind });
      prevKind.current = kind;
    }
  }, [kind, onKindChange]);

  const onValid = async (values: LeadFormValues) => {
    setFormError(null);
    try {
      const result = await submitLead({
        ...values,
        elapsedMs: Date.now() - loadedAt.current,
      });
      if (result.ok) {
        track("lead_form_submit_success", { kind: values.kind, priority: result.priority ?? "n/a" });
        onSuccess(values);
        return;
      }
      const keys = Object.keys(result.fieldErrors ?? {});
      for (const key of keys) {
        setError(key as Path<LeadFormValues>, { type: "server", message: result.fieldErrors![key] });
      }
      if (keys.length) setFocus(keys[0] as Path<LeadFormValues>);
      setFormError(result.formError ?? "No pudimos enviar tu solicitud.");
      track("lead_form_submit_error", { kind: values.kind, reason: keys.length ? "server_validation" : "server" });
    } catch {
      setFormError("No pudimos enviar tu solicitud. Revisa tu conexión e intenta de nuevo.");
      track("lead_form_submit_error", { kind: values.kind, reason: "network" });
    }
  };

  const onInvalid = (errors: FieldErrors<LeadFormValues>) => {
    const n = countErrors(errors);
    setFormError(`Revisa ${n === 1 ? "el campo marcado" : `los ${n} campos marcados`}.`);
    track("lead_form_submit_error", { kind, reason: "validation", fields: n });
  };

  const KindFields = kind === "business" ? BusinessFields : kind === "agent" ? AgentFields : TripFields;

  return (
    <FormProvider {...form}>
      <form
        // POST: si algo se enviara de forma nativa, los datos nunca van en la URL.
        method="post"
        noValidate
        onSubmit={handleSubmit(onValid, onInvalid)}
        onFocusCapture={() => {
          if (!started.current) {
            started.current = true;
            track("lead_form_start", { kind });
          }
        }}
        className="relative flex flex-col gap-10"
        aria-label="Formulario de contacto"
      >
        <KindSelector />

        {interestTag && (
          <div className="flex flex-wrap items-center gap-3 rounded-[2px] bg-ink/5 px-4 py-3 font-figtree text-[15px]">
            <span>
              Te interesa: <strong className="font-medium">{interestTag}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setValue("service", "");
                setValue("circuit", "");
              }}
              className="ml-auto min-h-11 rounded-[2px] px-2 text-[14px] text-ink/70 underline underline-offset-2 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Quitar
            </button>
          </div>
        )}

        {/* Campos del tipo elegido: altura + fade al cambiar (instantáneo con
            reduced motion). Los comunes no se desmontan y conservan lo escrito. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={kind}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="-mx-1 overflow-hidden px-1"
          >
            <div className="pb-1 pt-1">
              <KindFields />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="border-t border-ink/15 pt-10">
          <CommonFields />
        </div>

        <div className="flex flex-col gap-4">
          <p role="alert" className={`font-figtree text-[15px] ${ERROR_TEXT} empty:hidden`}>
            {formError ?? ""}
          </p>
          <div>
            <AnimatedButton
              type="submit"
              variant="dark"
              disabled={!ready || isSubmitting}
              aria-busy={isSubmitting}
              className="w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? "Enviando…" : "Enviar solicitud"}
            </AnimatedButton>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
