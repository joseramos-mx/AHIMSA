"use client";

import type { ReactNode } from "react";
import { get, useFormContext, type Path } from "react-hook-form";
import type { LeadFormValues } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";

type Option = { readonly value: string; readonly label: string };
export type FieldName = Path<LeadFormValues>;

/** Rojo para errores: 5.7:1 sobre cream (AA). */
export const ERROR_TEXT = "text-[#B42318]";

export const fieldId = (name: string) => `lead-${name.replace(/\./g, "-")}`;

/** Clases de inputs: 16px mínimo (iOS no hace zoom al enfocar). */
export const INPUT = cn(
  "w-full rounded-[2px] border border-ink/30 bg-transparent px-4 py-3",
  "font-figtree text-[16px] text-ink placeholder:text-ink/45",
  "transition-colors focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
  "aria-[invalid=true]:border-[#B42318]"
);

export const LABEL = "font-figtree text-[14px] font-medium text-ink";
export const LEGEND = "mb-3 font-figtree text-[14px] font-medium text-ink";

/** Mensaje de error de un campo (acepta rutas como "childAges.0"). */
export function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext<LeadFormValues>();
  return get(errors, name)?.message as string | undefined;
}

/** Props de accesibilidad para el control de un campo. */
export function useA11y(name: string, hasHint = false) {
  const error = useFieldError(name);
  const id = fieldId(name);
  const describedBy = [error && `${id}-error`, hasHint && `${id}-hint`]
    .filter(Boolean)
    .join(" ");
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  } as const;
}

export function FieldError({ name }: { name: string }) {
  const error = useFieldError(name);
  if (!error) return null;
  return (
    <p id={`${fieldId(name)}-error`} className={cn("mt-1.5 font-figtree text-[14px]", ERROR_TEXT)}>
      {error}
    </p>
  );
}

/** Label visible + control + error. */
export function Field({
  name,
  label,
  optional,
  hint,
  children,
  className,
}: {
  name: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={fieldId(name)} className={LABEL}>
        {label}
        {optional && <span className="font-normal text-ink/60"> (opcional)</span>}
      </label>
      <div className="mt-2">{children}</div>
      {hint && (
        <p id={`${fieldId(name)}-hint`} className="mt-1.5 font-figtree text-[14px] text-ink/65">
          {hint}
        </p>
      )}
      <FieldError name={name} />
    </div>
  );
}

export function TextField({
  name,
  label,
  optional,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
}: {
  name: FieldName;
  label: string;
  optional?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  placeholder?: string;
}) {
  const { register } = useFormContext<LeadFormValues>();
  const a11y = useA11y(name);
  return (
    <Field name={name} label={label} optional={optional}>
      <input
        {...register(name)}
        {...a11y}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        className={INPUT}
      />
    </Field>
  );
}

export function SelectField({
  name,
  label,
  options,
  optional,
  placeholder = "Elige una opción",
}: {
  name: FieldName;
  label: string;
  options: readonly Option[];
  optional?: boolean;
  placeholder?: string;
}) {
  const { register } = useFormContext<LeadFormValues>();
  const a11y = useA11y(name);
  return (
    <Field name={name} label={label} optional={optional}>
      <select {...register(name)} {...a11y} className={cn(INPUT, "pr-3")}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function TextareaField({
  name,
  label,
  max,
  optional,
  placeholder,
}: {
  name: FieldName;
  label: string;
  max: number;
  optional?: boolean;
  placeholder?: string;
}) {
  const { register, watch } = useFormContext<LeadFormValues>();
  const length = String(watch(name) ?? "").length;
  const a11y = useA11y(name, true);
  return (
    <Field
      name={name}
      label={label}
      optional={optional}
      hint={
        <span aria-live="polite">
          {length} / {max} caracteres
        </span>
      }
    >
      <textarea
        {...register(name)}
        {...a11y}
        rows={5}
        maxLength={max}
        placeholder={placeholder}
        className={cn(INPUT, "resize-y")}
      />
    </Field>
  );
}

/** Opciones tipo chip (checkboxes, selección múltiple) dentro de fieldset. */
export function ChipGroup({
  name,
  legend,
  options,
  optional,
}: {
  name: FieldName;
  legend: string;
  options: readonly Option[];
  optional?: boolean;
}) {
  const { register } = useFormContext<LeadFormValues>();
  const error = useFieldError(name);
  const id = fieldId(name);
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className={LEGEND}>
        {legend}
        {optional && <span className="font-normal text-ink/60"> (opcional)</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o.value} className="relative">
            <input
              {...register(name)}
              id={i === 0 ? id : undefined}
              type="checkbox"
              value={o.value}
              aria-invalid={error ? true : undefined}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 cursor-pointer select-none items-center rounded-full border border-ink/30 px-4 font-figtree text-[15px] text-ink transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      <FieldError name={name} />
    </fieldset>
  );
}

/** Radios con apariencia de botones (segmented / pills). */
export function RadioPills({
  name,
  legend,
  options,
  optional,
  legendClassName,
}: {
  name: FieldName;
  legend: string;
  options: readonly Option[];
  optional?: boolean;
  legendClassName?: string;
}) {
  const { register } = useFormContext<LeadFormValues>();
  return (
    <fieldset>
      <legend className={cn(LEGEND, legendClassName)}>
        {legend}
        {optional && <span className="font-normal text-ink/60"> (opcional)</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="relative">
            <input {...register(name)} type="radio" value={o.value} className="peer sr-only" />
            <span className="inline-flex min-h-11 cursor-pointer select-none items-center rounded-full border border-ink/30 px-4 font-figtree text-[15px] text-ink transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {o.label}
            </span>
          </label>
        ))}
      </div>
      <FieldError name={name} />
    </fieldset>
  );
}

/** Contador +/- con botones de 44px. */
export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  id,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  id: string;
}) {
  const button =
    "flex h-11 w-11 items-center justify-center rounded-[2px] border border-ink/30 text-ink transition-colors hover:border-ink disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent";
  return (
    <div role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className={LABEL}>
        {label}
      </span>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          className={button}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Quitar ${label.toLowerCase()}`}
        >
          <span aria-hidden="true">−</span>
        </button>
        <output aria-live="polite" className="min-w-8 text-center font-figtree text-[18px] tabular-nums">
          {value}
        </output>
        <button
          type="button"
          className={button}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Agregar ${label.toLowerCase()}`}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
