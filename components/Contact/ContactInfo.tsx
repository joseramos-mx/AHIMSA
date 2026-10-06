"use client";

import SplitHeading from "@/components/SplitHeading";
import {
  RESPONSE_TIME,
  WHATSAPP_AGENT_URL,
  WHATSAPP_URL,
} from "@/lib/contact";
import {
  CONTACT_EMAIL,
  CONTACT_HOURS,
  SOCIAL_LINKS,
  isRealUrl,
} from "@/lib/footer";
import type { LeadKind } from "@/lib/lead-schema";

const COPY: Record<LeadKind, { title: string; text: string }> = {
  trip: {
    title: "Cuéntame tu viaje",
    text: `Mientras más me cuentes, mejor podré diseñarlo. Te contacto en ${RESPONSE_TIME}.`,
  },
  business: {
    title: "Viajes para tu empresa",
    text: "Cuéntame cómo viaja tu equipo y te propongo una forma más simple de organizarlo.",
  },
  agent: {
    title: "Únete a mi equipo",
    text: "Déjame tus datos y te cuento cómo empezar como agente de viajes.",
  },
};

const NEXT_STEPS = ["Reviso tu solicitud", "Te contacto por WhatsApp", "Agendamos una llamada"];

const LINK =
  "font-figtree text-[16px] text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-[2px]";

const NEW_TAB = <span className="sr-only"> (se abre en una pestaña nueva)</span>;

/**
 * Columna de información. En móvil usa `display: contents` para que el
 * título vaya antes del formulario y los datos de contacto después (orden
 * con `order-*` en el grid del padre); en desktop es una columna sticky.
 */
export default function ContactInfo({ kind }: { kind: LeadKind }) {
  const copy = COPY[kind];
  return (
    <div className="contents lg:sticky lg:top-[120px] lg:col-span-4 lg:block lg:self-start">
      <div className="order-1">
        {/* key: al cambiar de tipo se vuelve a medir y animar el título. */}
        <SplitHeading
          key={copy.title}
          as="h1"
          text={copy.title}
          className="font-fraunces text-[38px] font-light leading-[1.05] text-ink lg:text-[56px]"
        />
        <p className="mt-5 max-w-[420px] font-figtree text-[17px] leading-[1.6] text-ink/85">
          {copy.text}
        </p>
      </div>

      <div className="order-3 flex flex-col gap-10 lg:mt-12">
        <section aria-labelledby="contacto-directo">
          <h2 id="contacto-directo" className="font-figtree text-[12px] font-medium uppercase tracking-[0.2em] text-ink/60">
            Contacto directo
          </h2>
          <ul className="mt-4 flex flex-col items-start gap-2.5">
            <li>
              <a
                href={kind === "agent" ? WHATSAPP_AGENT_URL : WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                WhatsApp +52 556 188 8805{NEW_TAB}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
                {CONTACT_EMAIL}
              </a>
            </li>
            {SOCIAL_LINKS.filter((s) => isRealUrl(s.href)).map((s) => (
              <li key={s.network}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {s.network} {s.handle}
                  {NEW_TAB}
                </a>
              </li>
            ))}
            <li className="font-figtree text-[16px] text-ink/75">{CONTACT_HOURS}</li>
          </ul>
        </section>

        <section aria-labelledby="que-pasa-despues">
          <h2 id="que-pasa-despues" className="font-figtree text-[12px] font-medium uppercase tracking-[0.2em] text-ink/60">
            Qué pasa después
          </h2>
          <ol className="mt-4 flex flex-col gap-3">
            {NEXT_STEPS.map((step, i) => (
              <li key={step} className="flex items-baseline gap-4 font-figtree text-[16px] text-ink">
                <span aria-hidden="true" className="font-fraunces text-[20px] font-light text-accent-dark">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
