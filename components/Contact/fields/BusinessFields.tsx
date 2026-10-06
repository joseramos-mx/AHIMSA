"use client";

import {
  BUSINESS_TRIP_OPTIONS,
  FREQUENCY_OPTIONS,
  TEAM_SIZE_OPTIONS,
} from "@/lib/lead-schema";
import { ChipGroup, SelectField, TextField, TextareaField } from "./ui";

export default function BusinessFields() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField name="company" label="Empresa" autoComplete="organization" />
        <TextField name="role" label="Cargo" optional autoComplete="organization-title" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField
          name="teamSize"
          label="Personas que viajan al año"
          options={TEAM_SIZE_OPTIONS}
          optional
        />
        <SelectField name="frequency" label="Frecuencia" options={FREQUENCY_OPTIONS} optional />
      </div>
      <ChipGroup name="tripTypes" legend="Tipo de viajes" options={BUSINESS_TRIP_OPTIONS} optional />
      <TextareaField name="comments" label="Comentarios" max={1000} optional />
    </div>
  );
}
