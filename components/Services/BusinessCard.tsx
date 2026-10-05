import RevealImage from "@/components/RevealImage";
import Reveal from "@/components/Reveal";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { BUSINESS_FEATURES, BUSINESS_IMAGE } from "@/lib/services";
import { contactHref } from "@/lib/trip-types";

/** Tarjeta "Para empresas". La imagen es opcional (BUSINESS_IMAGE). */
export default function BusinessCard() {
  return (
    <Reveal
      distance={32}
      className="flex h-full flex-col rounded-[2px] bg-ink p-8 text-cream lg:p-14"
    >
      {BUSINESS_IMAGE && (
        <div className="relative mb-10 aspect-video overflow-hidden rounded-[2px]">
          <RevealImage
            src={BUSINESS_IMAGE}
            alt=""
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="!absolute inset-0"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />
        </div>
      )}

      <Reveal
        as="p"
        delay={0.15}
        distance={0}
        className="font-figtree text-[13px] font-medium uppercase tracking-[0.2em] text-accent"
      >
        Para empresas
      </Reveal>
      <Reveal
        as="h2"
        delay={0.25}
        distance={16}
        className="mt-5 font-fraunces text-[30px] font-light leading-[1.15] lg:text-[40px]"
      >
        Viajes de trabajo sin complicaciones
      </Reveal>
      <Reveal
        as="p"
        delay={0.35}
        distance={16}
        className="mt-5 max-w-[520px] font-figtree text-[17px] leading-[1.6] text-cream/85"
      >
        Organizo los viajes de tu equipo en un solo lugar: reservas, cambios,
        facturación y acompañamiento cuando algo se mueve.
      </Reveal>

      <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        {BUSINESS_FEATURES.map((feature, i) => (
          <Reveal
            as="li"
            key={feature}
            delay={0.45 + i * 0.06}
            distance={12}
            className="flex items-center gap-3 font-figtree text-[16px] text-cream"
          >
            <span aria-hidden="true" className="h-px w-4 shrink-0 bg-accent" />
            {feature}
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.7} distance={16} className="mt-10 lg:mt-auto lg:pt-10">
        <AnimatedButton href={contactHref("empresa")} variant="light">
          Cotiza para tu empresa
        </AnimatedButton>
      </Reveal>
    </Reveal>
  );
}
