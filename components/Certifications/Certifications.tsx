"use client";

import Image from "next/image";
import { CERTIFICATIONS } from "@/lib/certifications";
import Reveal from "@/components/Reveal";

export default function Certifications() {
  return (
    <section
      id="certificaciones"
      className="bg-cream py-20 md:py-28"
      aria-labelledby="certifications-title"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 text-center mb-12 md:mb-16">
        <Reveal
          as="p"
          distance={0}
          className="font-figtree text-[12px] md:text-[13px] font-medium uppercase tracking-[0.2em] text-accent-dark mb-3"
        >
          Certificaciones oficiales
        </Reveal>
        <Reveal
          as="h2"
          delay={0.05}
          className="font-fraunces font-light text-[32px] md:text-[44px] leading-[1.1] max-w-[22ch] mx-auto text-ink"
        >
          <span id="certifications-title">
            Capacitada directamente por los operadores
          </span>
        </Reveal>
        <Reveal
          as="p"
          delay={0.12}
          distance={16}
          className="mt-5 max-w-[560px] mx-auto font-figtree text-[16px] leading-[1.6] text-ink/75"
        >
          Diez certificaciones vigentes en destinos, parques, trenes
          europeos y hotelería premium para que cada detalle quede en
          manos expertas.
        </Reveal>
      </div>

      {/* Grid de thumbnails. Aspect fijo para que la retícula sea pareja
          aunque los certificados varíen de proporción. Border + sombra
          suave simulan una pila de credenciales. */}
      <ul
        className="mx-auto max-w-[1200px] px-6 md:px-10
          grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5
          gap-5 md:gap-6"
      >
        {CERTIFICATIONS.map((c) => (
          <li key={c.src} className="flex flex-col gap-3">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden
                rounded-[2px] border border-ink/15 bg-white
                shadow-[0_1px_3px_rgba(17,17,17,0.08)]
                transition-shadow duration-300
                [@media(pointer:fine)]:hover:shadow-[0_6px_20px_rgba(17,17,17,0.12)]"
            >
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                loading="lazy"
                className="object-contain p-2"
              />
            </div>
            <div className="flex flex-col gap-0.5 text-center">
              <p className="font-figtree text-[12px] font-medium uppercase tracking-[0.15em] text-accent-dark">
                {c.issuer}
              </p>
              <p className="font-figtree text-[13px] leading-tight text-ink/75">
                {c.program}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
