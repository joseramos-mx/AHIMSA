"use client";

import { EXPERIENCE_OPTIONS, HEARD_FROM_OPTIONS } from "@/lib/lead-schema";
import { RadioPills, SelectField, TextField } from "./ui";

export default function AgentFields() {
  return (
    <div className="flex flex-col gap-8">
      <TextField name="location" label="Ciudad y país" autoComplete="address-level2" placeholder="Ej. Guadalajara, México" />
      <RadioPills name="experience" legend="¿Tienes experiencia en turismo?" options={EXPERIENCE_OPTIONS} optional />
      <SelectField name="heardFrom" label="¿Cómo te enteraste?" options={HEARD_FROM_OPTIONS} optional />
      <TextField name="wantToSell" label="¿Qué te gustaría vender?" optional placeholder="Ej. viajes a Europa, cruceros…" />
    </div>
  );
}
