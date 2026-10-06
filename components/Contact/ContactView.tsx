"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseContactParams } from "@/lib/lead-types";
import type { LeadFormValues, LeadKind } from "@/lib/lead-schema";
import ContactInfo from "./ContactInfo";
import LeadForm from "./LeadForm";
import SuccessState from "./SuccessState";

/**
 * Une la columna de información y el formulario: el tipo elegido en el
 * formulario cambia el título, y al enviar el formulario se reemplaza por
 * el estado de éxito.
 */
export default function ContactView() {
  const params = useSearchParams();
  const [initial] = useState(() => parseContactParams(params));
  const [kind, setKind] = useState<LeadKind>(initial.kind);
  const [sent, setSent] = useState<LeadFormValues | null>(null);

  return (
    <main className="bg-cream px-6 pb-24 pt-28 text-ink md:px-10 lg:pb-32 lg:pt-40">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <ContactInfo kind={kind} />
        <div className="order-2 lg:col-span-7 lg:col-start-6">
          {sent ? (
            <SuccessState values={sent} />
          ) : (
            <LeadForm initial={initial} onKindChange={setKind} onSuccess={setSent} />
          )}
        </div>
      </div>
    </main>
  );
}
