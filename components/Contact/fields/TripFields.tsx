"use client";

import { useFormContext, type UseFormRegister } from "react-hook-form";
import {
  BUDGET_RANGES,
  INTEREST_OPTIONS,
  MONTH_OPTIONS,
  OCCASION_OPTIONS,
  type LeadFormValues,
} from "@/lib/lead-schema";
import {
  ChipGroup,
  Field,
  INPUT,
  LABEL,
  LEGEND,
  RadioPills,
  SelectField,
  Stepper,
  TextField,
  TextareaField,
  fieldId,
  useA11y,
} from "./ui";

const DATE_MODES = [
  { value: "exact", label: "Tengo fechas" },
  { value: "flexible", label: "Aún no sé" },
] as const;

const AGES = Array.from({ length: 18 }, (_, i) => ({
  value: String(i),
  label: i === 0 ? "Menos de 1 año" : `${i} ${i === 1 ? "año" : "años"}`,
}));

const today = () => new Date().toISOString().slice(0, 10);

function DateFields() {
  const { register, watch } = useFormContext<LeadFormValues>();
  const mode = watch("dateMode");
  const depart = watch("departDate");
  const departA11y = useA11y("departDate");
  const returnA11y = useA11y("returnDate");
  const year = new Date().getFullYear();
  const years = [0, 1, 2].map((n) => ({ value: String(year + n), label: String(year + n) }));

  return (
    <div className="flex flex-col gap-5">
      <RadioPills name="dateMode" legend="Fechas" options={DATE_MODES} />
      {mode === "exact" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field name="departDate" label="Salida">
            <input {...register("departDate")} {...departA11y} type="date" min={today()} className={INPUT} />
          </Field>
          <Field name="returnDate" label="Regreso">
            <input
              {...register("returnDate")}
              {...returnA11y}
              type="date"
              min={depart || today()}
              className={INPUT}
            />
          </Field>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectField name="approxMonth" label="Mes aproximado" options={MONTH_OPTIONS} optional placeholder="Mes" />
          <SelectField name="approxYear" label="Año" options={years} optional placeholder="Año" />
        </div>
      )}
    </div>
  );
}

function NightsField() {
  const { watch, setValue } = useFormContext<LeadFormValues>();
  const nights = watch("nights");
  const undecided = nights === null;
  const id = fieldId("nights");
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className={LABEL}>
          Noches <span className="font-normal text-ink/60">(opcional)</span>
        </label>
        <span aria-hidden="true" className="font-figtree text-[16px] tabular-nums text-ink">
          {undecided ? "Sin definir" : `${nights} ${nights === 1 ? "noche" : "noches"}`}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={30}
        value={nights ?? 7}
        disabled={undecided}
        aria-valuetext={undecided ? "Sin definir" : `${nights} noches`}
        onChange={(e) => setValue("nights", Number(e.target.value), { shouldDirty: true })}
        className="mt-3 h-11 w-full cursor-pointer accent-[#7A5A33] disabled:cursor-not-allowed disabled:opacity-40"
      />
      <label className="mt-1 inline-flex min-h-11 cursor-pointer items-center gap-3 font-figtree text-[15px] text-ink">
        <input
          type="checkbox"
          checked={undecided}
          onChange={(e) => setValue("nights", e.target.checked ? null : 7, { shouldDirty: true })}
          className="h-5 w-5 accent-[#7A5A33]"
        />
        Aún no lo sé
      </label>
    </div>
  );
}

function TravelersFields() {
  const { watch, setValue, register } = useFormContext<LeadFormValues>();
  const adults = watch("adults");
  const children = watch("children");
  const ages = watch("childAges");

  const setChildren = (n: number) => {
    setValue("children", n, { shouldDirty: true });
    // Una edad por menor: recorta o agrega espacios vacíos.
    setValue("childAges", Array.from({ length: n }, (_, i) => ages[i] ?? ""), {
      shouldDirty: true,
    });
  };

  return (
    <fieldset>
      <legend className={LEGEND}>Viajeros</legend>
      <div className="flex flex-wrap gap-x-10 gap-y-5">
        <Stepper
          id={fieldId("adults")}
          label="Adultos"
          value={adults}
          min={1}
          max={20}
          onChange={(n) => setValue("adults", n, { shouldDirty: true })}
        />
        <Stepper id={fieldId("children")} label="Menores" value={children} min={0} max={10} onChange={setChildren} />
      </div>
      {children > 0 && (
        <div className="mt-5">
          <p className="font-figtree text-[14px] text-ink/70">
            La edad de cada menor me ayuda a cotizar parques y hoteles.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: children }, (_, i) => (
              <ChildAge key={i} index={i} register={register} />
            ))}
          </div>
        </div>
      )}
    </fieldset>
  );
}

function ChildAge({
  index,
  register,
}: {
  index: number;
  register: UseFormRegister<LeadFormValues>;
}) {
  const name = `childAges.${index}` as const;
  const a11y = useA11y(name);
  return (
    <Field name={name} label={`Edad del menor ${index + 1}`}>
      <select {...register(name)} {...a11y} className={INPUT}>
        <option value="">Elige la edad</option>
        {AGES.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export default function TripFields() {
  return (
    <div className="flex flex-col gap-8">
      <ChipGroup name="interests" legend="Tipo de viaje" options={INTEREST_OPTIONS} />
      <TextField name="destination" label="Destino en mente" optional placeholder="Ej. París y Londres" />
      <DateFields />
      <NightsField />
      <TravelersFields />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField name="occasion" label="Ocasión" options={OCCASION_OPTIONS} optional />
        <SelectField name="budget" label="Presupuesto por persona" options={BUDGET_RANGES} optional />
      </div>
      <TextareaField
        name="idea"
        label="Cuéntame tu idea"
        max={1000}
        optional
        placeholder="Qué les gusta, qué quieren vivir, qué les preocupa…"
      />
    </div>
  );
}
